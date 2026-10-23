import os
from contextlib import contextmanager
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'itroad.db'}")
IS_SQLITE = DATABASE_URL.startswith("sqlite")

connect_args = {"check_same_thread": False} if IS_SQLITE else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


if IS_SQLITE:
    # "database is locked" errors happen because SQLite only allows one
    # writer at a time. Two concrete, additive fixes (no PostgreSQL
    # migration, no disabling of tracking/scoring):
    #
    # 1. WAL (Write-Ahead Logging) mode lets readers run concurrently with
    #    a writer instead of blocking each other - this alone fixes the
    #    vast majority of "locked" errors seen under normal traffic
    #    (tracking heartbeats + chat + lead reads all happening close
    #    together).
    # 2. busy_timeout makes SQLite retry for up to 5s before raising
    #    "database is locked" instead of failing immediately if two writes
    #    do land at the exact same instant (e.g. a heartbeat and a chat
    #    message committing back to back).
    #
    # This runs on every new DBAPI connection (SQLite connections are
    # cheap/short-lived here, so this is negligible overhead).
    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, connection_record):  # noqa: ARG001
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA busy_timeout=5000")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def session_scope():
    """Short-lived DB session for code that runs OUTSIDE a request's
    lifecycle - background tasks must never reuse the request-scoped
    session from `Depends(get_db)` (it may already be closed by the time
    the background task runs, and holding it open would extend a
    transaction across an Ollama call). Always commits-or-rolls-back and
    closes, so the connection is returned to the pool promptly."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def run_sqlite_autopatch(base, bound_engine):
    """Add any columns that exist on the ORM models but not yet in an
    existing on-disk SQLite database.

    `Base.metadata.create_all()` only creates missing *tables* - it never
    alters an existing table's columns. Without this, a previously-created
    local `itroad.db` (from before the visitor-analytics upgrade) would be
    missing the new tracking_profiles / tracking_events columns and every
    request would crash with "no such column". This is a lightweight,
    additive, SQLite-only patch (real deployments should use a proper
    migration tool such as Alembic); it is a no-op on Postgres/MySQL and on
    a fresh database (create_all already created the right shape there).
    """
    if not bound_engine.dialect.name == "sqlite":
        return

    from sqlalchemy import inspect, text

    inspector = inspect(bound_engine)
    existing_tables = set(inspector.get_table_names())

    with bound_engine.begin() as conn:
        for table in base.metadata.sorted_tables:
            if table.name not in existing_tables:
                continue  # brand new table, create_all already handled it
            existing_columns = {col["name"] for col in inspector.get_columns(table.name)}
            for column in table.columns:
                if column.name in existing_columns:
                    continue
                try:
                    col_type = column.type.compile(bound_engine.dialect)
                except Exception:
                    col_type = "TEXT"
                conn.execute(text(f'ALTER TABLE "{table.name}" ADD COLUMN "{column.name}" {col_type}'))

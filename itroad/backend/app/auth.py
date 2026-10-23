import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Header, HTTPException, status

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")


def require_admin(x_admin_token: str = Header(default="")):
    """
    Minimal shared-secret auth for the admin endpoints.

    There is no user/login system here on purpose: the original project
    (ZIP 2) had no admin dashboard or authentication at all, so this is
    new, intentionally lightweight protection - not a full auth system.
    Set ADMIN_TOKEN in backend/.env before exposing this anywhere but
    your own machine.
    """
    if not ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ADMIN_TOKEN is not configured on the server (see backend/.env.example).",
        )
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin token")
    return True

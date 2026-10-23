import { Home, Mail } from 'lucide-react';
import { type Route } from '../lib/router';
import { useT } from '../lib/useT';

export function NotFoundPage({ navigate }: { navigate: (r: Route) => void }) {
  const t = useT();
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-white" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 grid-pattern opacity-50" />
      </div>

      <div className="container-px max-w-2xl mx-auto text-center">
        <div className="font-display font-extrabold text-[120px] sm:text-[180px] leading-none text-gradient">
          {t.notFound.code}
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy-900 mt-4">
          {t.notFound.title}
        </h1>
        <p className="text-navy-500 mt-4 text-lg">{t.notFound.text}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => navigate('home')}
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-navy-900 text-white font-semibold hover:bg-navy-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.notFound.home}
          </button>
          <button
            onClick={() => navigate('contact')}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-navy-200 text-navy-700 font-semibold hover:bg-navy-50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {t.notFound.contact}
          </button>
        </div>
      </div>
    </section>
  );
}

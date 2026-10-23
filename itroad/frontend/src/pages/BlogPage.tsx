import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import { type Route } from '../lib/router';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { useT } from '../lib/useT';
import { useLang } from '../lib/i18n';
import { getOrCreateClientId, sendTrackingEvent } from '../lib/tracking';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function BlogHero() {
  const t = useT();
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white" />
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-electric-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 grid-pattern opacity-50" />
      </div>
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-brand-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">{t.blog.eyebrow}</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-navy-900">
              {t.blog.title1} <span className="text-gradient">{t.blog.title2}</span>
            </h1>
            <p className="text-lg text-navy-500 mt-6 leading-relaxed max-w-2xl">
              {t.blog.subtitle}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedPost({ navigate }: { navigate: (r: Route) => void }) {
  const t = useT();
  const post = t.blog.posts.find((p) => p.featured) ?? t.blog.posts[0];
  return (
    <section className="py-16 lg:py-20">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative overflow-hidden rounded-4xl aspect-[4/3] bg-gradient-to-br from-navy-900 via-brand-900 to-navy-950">
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <div className="absolute top-6 left-6">
                <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white text-xs font-semibold">
                  {t.blog.featured}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-white/40 text-sm">{post.category}</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 text-sm text-navy-400">
                <span>{post.category}</span>
                <span className="w-1 h-1 rounded-full bg-navy-300" />
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-navy-300" />
                <span>{post.readTime}</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy-900 mt-4">{post.title}</h2>
              <p className="text-navy-500 mt-4 leading-relaxed">{post.excerpt}</p>
              <button
                onClick={() => navigate('contact')}
                className="group inline-flex items-center gap-2 mt-6 text-brand-600 font-semibold"
              >
                {t.blog.readArticle}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BlogGrid() {
  const t = useT();
  const posts = t.blog.posts.filter((p) => !p.featured);
  return (
    <section className="py-16 lg:py-20 bg-navy-50/50">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow={t.blog.latestEyebrow} title={t.blog.latestTitle} />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <article className="group p-7 rounded-3xl bg-white border border-navy-100 shadow-soft card-hover h-full flex flex-col">
                <div className="flex items-center gap-2 text-xs text-navy-400">
                  <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 font-medium">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-navy-900 mt-4 group-hover:text-brand-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-navy-500 mt-2 leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-5 pt-5 border-t border-navy-100">
                  <span className="text-xs text-navy-400">{post.date}</span>
                  <ArrowUpRight className="w-4 h-4 text-navy-400 group-hover:text-brand-600 transition-colors" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const t = useT();
  const { lang } = useLang();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const response = await fetch(`${API_URL}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, clientId: getOrCreateClientId() }),
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        // eslint-disable-next-line no-console
        console.error(`Newsletter submission failed: HTTP ${response.status}`, detail);
        throw new Error(`HTTP ${response.status}`);
      }
      await sendTrackingEvent('newsletter_subscription', { meta: 'blog-newsletter-form' });
      setStatus('success');
      setEmail('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Newsletter submission error:', err, `apiUrl=${API_URL}`);
      setStatus('error');
    }
  };

  return (
    <section className="section-py">
      <div className="container-px max-w-3xl mx-auto">
        <Reveal>
          <div className="text-center">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-navy-900">{t.blog.newsletterTitle}</h3>
            <p className="text-navy-500 mt-3">{t.blog.newsletterText}</p>
            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 mt-8 text-brand-600 font-semibold">
                <Check className="w-5 h-5" />
                {lang === 'fr' ? 'Merci, vous êtes bien inscrit !' : "Thanks, you're subscribed!"}
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto" onSubmit={handleSubmit}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.blog.placeholder}
                  className="flex-1 px-5 py-3.5 rounded-full border border-navy-200 bg-white text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  data-track-cta="newsletter-subscribe"
                  className="px-6 py-3.5 rounded-full bg-navy-900 text-white font-semibold hover:bg-navy-800 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? (lang === 'fr' ? 'Envoi...' : 'Sending...') : t.blog.subscribe}
                </button>
              </form>
            )}
            {status === 'error' && (
              <div className="flex items-center justify-center gap-2 mt-4 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {lang === 'fr' ? "Une erreur est survenue, veuillez réessayer." : 'Something went wrong, please try again.'}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function BlogPage({ navigate }: { navigate: (r: Route) => void }) {
  const t = useT();
  return (
    <>
      <BlogHero />
      <FeaturedPost navigate={navigate} />
      <BlogGrid />
      <NewsletterSection />
      <CTASection navigate={navigate} title={t.blog.ctaTitle} />
    </>
  );
}

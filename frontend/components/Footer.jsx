import Link from 'next/link';
import Logo from '@/components/Logo';
import { siteConfig } from '@/lib/site';

const FOOTER_LINKS = {
  product: [
    { label: 'Browse exams', href: '/#exams' },
    { label: 'Add exam with AI', href: '/exams/add' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  company: [
    { label: 'About us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Methodology', href: '/about#methodology' },
  ],
  legal: [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms of service', href: '/terms' },
    { label: 'Disclaimer', href: '/terms#disclaimer' },
  ],
};

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
              {siteConfig.tagline}. Built for students preparing for India&apos;s top competitive exams.
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="inline-flex items-center gap-2 mt-5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {siteConfig.contactEmail}
            </a>
          </div>

          <FooterColumn title="Product" links={FOOTER_LINKS.product} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Predictions are estimates based on crowdsourced data and historical trends — not official
            exam results. Always verify with official sources.
          </p>
        </div>
      </div>
    </footer>
  );
}

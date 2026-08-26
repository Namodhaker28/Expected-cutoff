import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import { siteConfig } from '@/lib/site';

export const metadata = {
  title: 'Contact',
  description: `Get in touch with the ${siteConfig.name} team for support, feedback, or partnership inquiries.`,
};

const CONTACT_TOPICS = [
  {
    title: 'General support',
    description: 'Questions about using the platform, submitting scores, or viewing predictions.',
  },
  {
    title: 'Exam data & accuracy',
    description: 'Report incorrect historical data or suggest improvements to our prediction model.',
  },
  {
    title: 'Partnerships',
    description: 'Coaching institutes, ed-tech platforms, and content creators.',
  },
  {
    title: 'Privacy & legal',
    description: 'Data requests, privacy concerns, or terms-related inquiries.',
  },
];

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact us"
      description="We'd love to hear from you. Reach out for support, feedback, or collaboration."
    >
      <section>
        <div className="not-prose grid gap-4 sm:grid-cols-2 mb-10">
          {CONTACT_TOPICS.map((topic) => (
            <div
              key={topic.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{topic.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{topic.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Email us</h2>
        <p>
          The fastest way to reach us is by email. We typically respond within 2–3 business days.
        </p>
        <p>
          <a href={`mailto:${siteConfig.contactEmail}`} className="font-medium">
            {siteConfig.contactEmail}
          </a>
        </p>
      </section>

      <section>
        <h2>Before you write</h2>
        <ul>
          <li>
            For prediction questions, include the exam name, shift, category, and your submitted
            score.
          </li>
          <li>
            Predictions are estimates — we cannot influence or access official results.
          </li>
          <li>
            See our{' '}
            <Link href="/about#methodology">methodology</Link> for how cutoffs are calculated.
          </li>
        </ul>
      </section>
    </ContentPage>
  );
}

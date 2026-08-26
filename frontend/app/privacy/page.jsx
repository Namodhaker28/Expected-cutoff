import ContentPage from '@/components/ContentPage';
import { siteConfig } from '@/lib/site';

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${siteConfig.name} — how we collect, use, and protect your data.`,
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      description={`Last updated: ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`}
    >
      <section>
        <h2>Overview</h2>
        <p>
          {siteConfig.name} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy
          explains what information we collect when you use our website and how we use it.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account data</strong> — Email address and name when you register.
          </li>
          <li>
            <strong>Submission data</strong> — Exam scores, difficulty ratings, category, and shift
            selections you submit for predictions.
          </li>
          <li>
            <strong>Usage data</strong> — Pages visited, browser type, and general analytics to
            improve the service.
          </li>
          <li>
            <strong>Technical data</strong> — Hashed IP addresses for rate limiting and abuse
            prevention (not stored in plain text).
          </li>
        </ul>
      </section>

      <section>
        <h2>How we use your data</h2>
        <ul>
          <li>To generate and improve cutoff predictions.</li>
          <li>To provide your dashboard and submission history.</li>
          <li>To prevent spam and maintain platform integrity.</li>
          <li>To communicate important service updates (if you have an account).</li>
        </ul>
        <p>We do not sell your personal data to third parties.</p>
      </section>

      <section>
        <h2>Data sharing</h2>
        <p>
          Aggregated, anonymised submission data may be displayed publicly (e.g. average scores per
          shift). Individual submissions are not linked to your identity in public views unless you
          are logged in and viewing your own dashboard.
        </p>
      </section>

      <section>
        <h2>Cookies &amp; local storage</h2>
        <p>
          We use browser local storage to keep you signed in (JWT token). We do not use third-party
          advertising cookies.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You may request access to or deletion of your account data by contacting us at{' '}
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. Continued use of the service after changes
          constitutes acceptance of the updated policy.
        </p>
      </section>
    </ContentPage>
  );
}

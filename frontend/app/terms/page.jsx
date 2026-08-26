import ContentPage from '@/components/ContentPage';
import { siteConfig } from '@/lib/site';

export const metadata = {
  title: 'Terms of Service',
  description: `Terms of service and disclaimer for ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Service"
      description={`Last updated: ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`}
    >
      <section id="disclaimer">
        <h2>Disclaimer</h2>
        <p>
          <strong>
            All cutoff predictions on {siteConfig.name} are estimates only and are not official
            results.
          </strong>{' '}
          We are not affiliated with NTA, IITs, AIIMS, UPSC, SSC, or any other exam conducting
          authority. Do not make admission, counselling, or career decisions based solely on our
          predictions. Always rely on official announcements.
        </p>
      </section>

      <section>
        <h2>Acceptance of terms</h2>
        <p>
          By accessing or using {siteConfig.name}, you agree to these terms. If you do not agree,
          please do not use the service.
        </p>
      </section>

      <section>
        <h2>Use of the service</h2>
        <ul>
          <li>You must provide accurate information when submitting scores.</li>
          <li>You must not submit false, misleading, or manipulated data.</li>
          <li>You must not attempt to disrupt, scrape, or overload the platform.</li>
          <li>You must be at least 13 years old to create an account.</li>
        </ul>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          The platform, its design, prediction methodology, and content are owned by {siteConfig.name}.
          You may not copy, redistribute, or commercially exploit our data without written permission.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          {siteConfig.name} is provided &quot;as is&quot; without warranties of any kind. We are not
          liable for any damages arising from reliance on predictions, service interruptions, or
          data inaccuracies.
        </p>
      </section>

      <section>
        <h2>Account termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms or engage
          in abusive behaviour.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms? Email{' '}
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
        </p>
      </section>
    </ContentPage>
  );
}

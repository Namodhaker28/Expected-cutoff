import ContentPage from '@/components/ContentPage';
import { siteConfig } from '@/lib/site';

export const metadata = {
  title: 'About Us',
  description: `Learn about ${siteConfig.name} — how we predict exam cutoffs using crowdsourced data, historical trends, and seat analysis.`,
};

export default function AboutPage() {
  return (
    <ContentPage
      title="About Expected Cutoff"
      description="Helping students make informed decisions with data-driven cutoff predictions."
    >
      <section>
        <h2>Our mission</h2>
        <p>
          Every year, millions of students in India wait anxiously for official cutoff announcements.
          Expected Cutoff bridges that gap by combining real student feedback, historical cutoff data,
          and seat competition analysis to produce timely, transparent predictions.
        </p>
        <p>
          We built this platform for students who want clarity after an exam — not guesswork based on
          social media rumours.
        </p>
      </section>

      <section id="methodology">
        <h2>How we predict cutoffs</h2>
        <p>Our prediction engine blends three weighted signals:</p>
        <ul>
          <li>
            <strong>30% Crowd data</strong> — Student-submitted scores and perceived paper difficulty,
            with outlier trimming for accuracy.
          </li>
          <li>
            <strong>40% Historical trends</strong> — Up to five years of official cutoff data, analysed
            with weighted moving averages.
          </li>
          <li>
            <strong>30% Structural factors</strong> — Seat availability vs. applicant volume for each
            category.
          </li>
        </ul>
        <p>
          The result is an expected closing score and rank estimate, along with a confidence indicator
          based on how much data is available for that exam and shift.
        </p>
      </section>

      <section>
        <h2>Supported exams</h2>
        <p>
          We support major competitive exams including JEE Main, NEET, JEE Advanced, GATE, CAT, UPSC
          CSE Prelims, SSC CGL, IBPS PO, CLAT, and CUET UG. Don&apos;t see your exam? You can add it
          instantly using our AI-powered exam generator.
        </p>
      </section>

      <section>
        <h2>Built for students, by data</h2>
        <p>
          Expected Cutoff is an independent platform. We are not affiliated with any exam conducting
          body. Our goal is to give students a reliable reference point while they wait for official
          results.
        </p>
      </section>
    </ContentPage>
  );
}

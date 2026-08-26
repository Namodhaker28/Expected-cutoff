import { absoluteUrl } from '@/lib/site';
import { fetchExam } from '@/lib/api/server';

export async function generateMetadata({ params }) {
  const exam = await fetchExam(params.slug);

  if (!exam) {
    return { title: 'Results', robots: { index: false, follow: false } };
  }

  const title = `${exam.name} Cutoff Prediction Results`;
  const description = `View the predicted cutoff, rank estimate, and historical trends for ${exam.name}.`;
  const url = absoluteUrl(`/exams/${params.slug}/results`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: false, follow: true },
  };
}

export default function ResultsLayout({ children }) {
  return children;
}

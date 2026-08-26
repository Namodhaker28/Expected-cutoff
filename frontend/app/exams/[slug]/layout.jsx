import { siteConfig, absoluteUrl } from '@/lib/site';
import { fetchExam } from '@/lib/api/server';

export async function generateMetadata({ params }) {
  const exam = await fetchExam(params.slug);

  if (!exam) {
    return {
      title: 'Exam Not Found',
      robots: { index: false, follow: false },
    };
  }

  const title = `${exam.name} Expected Cutoff Prediction`;
  const description =
    exam.description ||
    `Predict the expected cutoff for ${exam.name}. Submit your score, see crowd stats, historical trends, and data-driven cutoff estimates.`;

  const url = absoluteUrl(`/exams/${params.slug}`);

  return {
    title,
    description,
    keywords: [
      `${exam.name} cutoff`,
      `${exam.name} expected cutoff`,
      `${exam.name} prediction`,
      'exam cutoff',
      'rank predictor',
      ...siteConfig.keywords.slice(0, 4),
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function ExamLayout({ children }) {
  return children;
}

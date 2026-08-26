import { absoluteUrl, getSiteUrl } from '@/lib/site';
import { fetchExams } from '@/lib/api/server';

export default async function sitemap() {
  const baseUrl = getSiteUrl();
  const exams = await fetchExams();

  const staticRoutes = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/exams/add'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/login'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const examRoutes = exams.map((exam) => ({
    url: absoluteUrl(`/exams/${exam.slug}`),
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticRoutes, ...examRoutes];
}

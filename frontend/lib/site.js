export const siteConfig = {
  name: 'Expected Cutoff',
  shortName: 'Expected Cutoff',
  tagline: 'Know your expected cutoff before results drop',
  description:
    'Crowdsourced exam cutoff predictions for JEE, NEET, GATE, CAT, SSC and more. Data-driven estimates from student scores, historical trends, and seat competition.',
  keywords: [
    'expected cutoff',
    'exam cutoff prediction',
    'JEE Main cutoff',
    'NEET cutoff',
    'GATE cutoff',
    'CAT cutoff',
    'SSC CGL cutoff',
    'exam rank predictor',
    'India competitive exams',
    'cutoff analysis',
  ],
  locale: 'en_IN',
  twitterHandle: null,
  creator: 'Expected Cutoff',
  contactEmail: 'hello@expectedcutoff.com',
  foundedYear: 2025,
};

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export function absoluteUrl(path = '/') {
  const base = getSiteUrl();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

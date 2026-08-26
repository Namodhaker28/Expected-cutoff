/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // On Vercel Services, root vercel.json routes /api → backend service.
    // This rewrite is only for local frontend-only dev (npm run dev in frontend/).
    if (process.env.VERCEL) return [];

    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:5001/api'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

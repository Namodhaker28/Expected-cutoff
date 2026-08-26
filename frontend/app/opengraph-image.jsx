import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #E0E7FF 0%, #EDE9FE 50%, #E0F2FE 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
              <path
                d="M14 42 L26 30 L36 36 L50 18"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="14"
                y1="46"
                x2="50"
                y2="46"
                stroke="white"
                strokeWidth="2.5"
                strokeDasharray="6 5"
                strokeLinecap="round"
                opacity="0.85"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 52,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {siteConfig.name}
          </span>
        </div>
        <p
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#0F172A',
            lineHeight: 1.3,
            maxWidth: 900,
            margin: 0,
          }}
        >
          {siteConfig.tagline}
        </p>
        <p
          style={{
            fontSize: 22,
            color: '#475569',
            marginTop: 24,
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          JEE · NEET · GATE · CAT · SSC and more — powered by crowdsourced data &amp; historical trends
        </p>
      </div>
    ),
    { ...size }
  );
}

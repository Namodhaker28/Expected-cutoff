import { ImageResponse } from 'next/og';
import { fetchExam } from '@/lib/api/server';

export const alt = 'Exam cutoff prediction';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function ExamOpenGraphImage({ params }) {
  const exam = await fetchExam(params.slug);
  const name = exam?.name || 'Exam Cutoff';
  const description =
    exam?.description || 'Data-driven cutoff prediction from crowd data and historical trends';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #E0E7FF 0%, #EDE9FE 50%, #E0F2FE 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            }}
          />
          <span style={{ fontSize: 28, fontWeight: 600, color: '#4F46E5' }}>
            Expected Cutoff
          </span>
        </div>

        <div>
          <p
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.2,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            {name}
          </p>
          <p
            style={{
              fontSize: 28,
              color: '#475569',
              marginTop: 20,
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            {description.length > 120 ? `${description.slice(0, 117)}...` : description}
          </p>
        </div>

        <p style={{ fontSize: 22, color: '#6366F1', fontWeight: 600, margin: 0 }}>
          Predict cutoff · Submit score · View trends
        </p>
      </div>
    ),
    { ...size }
  );
}

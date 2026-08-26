function getApiBase() {
  if (process.env.API_URL) return process.env.API_URL.replace(/\/$/, '');
  if (process.env.NEXT_PUBLIC_API_URL?.startsWith('http')) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }
  return 'http://localhost:5001/api';
}

async function safeFetch(path) {
  try {
    const res = await fetch(`${getApiBase()}${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchExams() {
  const data = await safeFetch('/exams');
  if (!data) return [];
  return Array.isArray(data) ? data : data.data ?? [];
}

export async function fetchExam(slug) {
  const data = await safeFetch(`/exams/${slug}`);
  if (!data) return null;
  return data.exam ?? data;
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createExam } from '@/lib/api/client';

export default function AddExamPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '', maxScore: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setLoading(true);

    try {
      setStatus('Asking Gemini AI for historical cutoff data...');
      const res = await createExam({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        maxScore: form.maxScore ? Number(form.maxScore) : undefined,
      });
      router.push(`/exams/${res.data.exam.slug}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create exam');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700">
        ← Back to exams
      </Link>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900">Add New Exam</h1>
        <p className="text-sm text-slate-500 mt-2">
          Enter an exam name and Gemini AI will fetch historical cutoffs, seat data, and exam structure for you.
        </p>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>
        )}

        {status && (
          <div className="mt-4 bg-indigo-50 text-indigo-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Exam Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. BITSAT, NDA, AFCAT"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Brief description to help AI"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Max Score <span className="text-slate-400">(optional hint)</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 300"
              value={form.maxScore}
              onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.name.trim()}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Generating with AI...' : 'Create Exam with AI'}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-4 text-center">
          AI-generated data is estimated from public trends. Verify before relying on predictions.
        </p>
      </div>
    </div>
  );
}

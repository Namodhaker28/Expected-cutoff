'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getExam, getStats, submitScore } from '@/lib/api/client';

export default function PredictPage() {
  const params = useParams();
  const slug = params.slug;
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    category: '',
    sessionId: '',
    rawScore: '',
    overallDifficulty: 3,
    difficultyBySubject: {},
  });

  useEffect(() => {
    getExam(slug)
      .then((res) => {
        setExam(res.data.exam);
        setSessions(res.data.sessions);
        const defaultCategory = res.data.exam.categories[0];
        const defaultSession = res.data.sessions[0]?._id || '';
        setForm((f) => ({
          ...f,
          category: defaultCategory,
          sessionId: defaultSession,
          difficultyBySubject: Object.fromEntries(
            res.data.exam.subjects.map((s) => [s, 3])
          ),
        }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (form.sessionId) {
      getStats(slug, form.sessionId).then((res) => setStats(res.data)).catch(console.error);
    }
  }, [slug, form.sessionId]);

  const handleSubjectDifficulty = (subject, value) => {
    setForm((f) => {
      const updated = { ...f.difficultyBySubject, [subject]: Number(value) };
      const values = Object.values(updated);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return { ...f, difficultyBySubject: updated, overallDifficulty: Math.round(avg * 10) / 10 };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await submitScore({
        examSlug: slug,
        sessionId: form.sessionId,
        category: form.category,
        rawScore: Number(form.rawScore),
        difficultyBySubject: form.difficultyBySubject,
        overallDifficulty: form.overallDifficulty,
      });
      router.push(`/exams/${slug}/results?category=${form.category}&sessionId=${form.sessionId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading...</div>;
  if (!exam) return <div className="text-center py-12 text-red-500">Exam not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{exam.name}</h1>
        <p className="text-slate-500 mt-1">{exam.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-semibold text-lg">Submit Your Data</h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {exam.categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Shift</label>
              <select
                value={form.sessionId}
                onChange={(e) => setForm({ ...form, sessionId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>{s.shift}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estimated Raw Score (max {exam.maxScore})
            </label>
            <input
              type="number"
              min="0"
              max={exam.maxScore}
              required
              value={form.rawScore}
              onChange={(e) => setForm({ ...form, rawScore: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder={`0 - ${exam.maxScore}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Perceived Difficulty by Subject (1 = Easy, 5 = Hard)
            </label>
            <div className="space-y-4">
              {exam.subjects.map((subject) => (
                <div key={subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{subject}</span>
                    <span className="text-indigo-600 font-medium">
                      {form.difficultyBySubject[subject] || 3}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={form.difficultyBySubject[subject] || 3}
                    onChange={(e) => handleSubjectDifficulty(subject, e.target.value)}
                    className="w-full accent-indigo-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit & View Prediction'}
          </button>
        </form>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Live Crowd Stats</h3>
            {stats ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Submissions</span>
                  <span className="font-semibold">{stats.submissionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Avg Difficulty</span>
                  <span className="font-semibold">{stats.avgDifficulty || '—'}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Avg Score</span>
                  <span className="font-semibold">{stats.avgScore || '—'}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No submissions yet for this shift</p>
            )}
          </div>

          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-5">
            <h3 className="font-semibold text-indigo-900 mb-2">How it works</h3>
            <ul className="text-sm text-indigo-700 space-y-1.5">
              <li>30% from crowd submissions</li>
              <li>40% from historical cutoffs</li>
              <li>30% from seats & applicants</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

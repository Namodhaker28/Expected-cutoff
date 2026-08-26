'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserSubmissions } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserSubmissions()
      .then((res) => setSubmissions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 mb-4">Please login to view your dashboard</p>
        <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Your Dashboard</h1>
      <p className="text-slate-500 mb-8">Welcome, {user.name || user.email}</p>

      {loading ? (
        <div className="text-center text-slate-400 py-8">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500 mb-4">No submissions yet</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Pick an exam to get started
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Exam</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Score</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Difficulty</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s._id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/exams/${s.exam?.slug}/results?category=${s.category}`}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      {s.exam?.name || 'Unknown'}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.category}</td>
                  <td className="px-4 py-3 text-slate-600">{s.rawScore}</td>
                  <td className="px-4 py-3 text-slate-600">{s.overallDifficulty}/5</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

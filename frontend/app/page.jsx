'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getExams } from '@/lib/api/client';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ExamCard from '@/components/ExamCard';
import Footer from '@/components/Footer';

const POPULAR_SLUGS = ['jee-main', 'neet', 'gate', 'cat', 'ssc-cgl'];

function ExamSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="w-12 h-12 bg-white/60 rounded-xl" />
      <div className="h-5 bg-white/60 rounded mt-4 w-3/4" />
      <div className="h-4 bg-white/40 rounded mt-2 w-full" />
      <div className="h-4 bg-white/40 rounded mt-1 w-2/3" />
      <div className="flex gap-2 mt-4 pt-4 border-t border-white/40">
        <div className="h-6 bg-white/40 rounded w-16" />
        <div className="h-6 bg-white/40 rounded w-16" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExams()
      .then((res) => setExams(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = exams.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.slug.includes(search.toLowerCase())
  );

  const popular = exams.filter((e) => POPULAR_SLUGS.includes(e.slug));

  return (
    <div className="min-h-screen landing-gradient relative overflow-hidden">
      {/* Soft gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-violet-300/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-sky-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <Hero examCount={exams.length} />
        <HowItWorks />

        {!loading && popular.length > 0 && !search && (
          <section className="max-w-6xl mx-auto px-4 pb-4">
            <div className="glass-strong rounded-2xl p-4 sm:p-5">
              <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-3">
                Popular right now
              </p>
              <div className="flex flex-wrap gap-2">
                {popular.map((exam) => (
                  <Link
                    key={exam.slug}
                    href={`/exams/${exam.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-white/50 hover:bg-white/80 hover:text-indigo-700 border border-white/60 px-3 py-1.5 rounded-lg transition-all backdrop-blur-sm"
                  >
                    {exam.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="exams" className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">All exams</h2>
                <p className="text-slate-600 mt-1">
                  {loading ? 'Loading...' : `${filtered.length} exam${filtered.length !== 1 ? 's' : ''} available`}
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search JEE, NEET, GATE..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 backdrop-blur border border-white/60 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white/70 transition-all"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <ExamSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((exam) => (
                <ExamCard key={exam.slug} exam={exam} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass rounded-2xl">
              <p className="text-slate-600">No exams match &ldquo;{search}&rdquo;</p>
              <Link
                href="/exams/add"
                className="inline-block mt-4 text-sm text-indigo-700 hover:text-indigo-800 font-medium"
              >
                Add it with AI →
              </Link>
            </div>
          )}

          {!loading && (
            <div className="mt-10 text-center">
              <p className="text-sm text-slate-600 mb-3">Can&apos;t find your exam?</p>
              <Link
                href="/exams/add"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-300/40"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate with Gemini AI
              </Link>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getExam, getPrediction, getHistory } from '@/lib/api/client';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import BreakdownChart from '@/components/BreakdownChart';
import HistoricalChart from '@/components/HistoricalChart';

const SENTIMENT_LABELS = {
  easy: 'Paper felt easy',
  moderately_easy: 'Paper felt moderately easy',
  moderate: 'Paper felt moderate',
  moderately_hard: 'Paper felt moderately hard',
  hard: 'Paper felt hard',
  unknown: 'Not enough data yet',
};

export default function ResultsPage() {
  const params = useParams();
  const slug = params.slug;
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'General';
  const sessionId = searchParams.get('sessionId') || '';

  const [exam, setExam] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getExam(slug),
      getPrediction(slug, category, sessionId),
      getHistory(slug, category),
    ])
      .then(([examRes, predRes, histRes]) => {
        setExam(examRes.data.exam);
        setPrediction(predRes.data);
        setHistory(histRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, category, sessionId]);

  if (loading) return <div className="text-center py-12 text-slate-400">Calculating prediction...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{exam?.name} — Expected Cutoff</h1>
          <p className="text-slate-500 mt-1">Category: {category}</p>
        </div>
        <Link
          href={`/exams/${slug}`}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          Submit again
        </Link>
      </div>

      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Predicted Cutoff</h2>
              <ConfidenceBadge level={prediction.confidence} />
            </div>

            <div className="text-center py-6">
              <div className="text-5xl font-bold text-indigo-600">
                {prediction.expectedClosingScore}
              </div>
              <p className="text-sm text-slate-500 mt-2">Expected Closing Score</p>
              {prediction.expectedClosingRank && (
                <p className="text-lg text-slate-700 mt-3">
                  Est. Rank: ~{prediction.expectedClosingRank.toLocaleString()}
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Paper Sentiment</span>
                <span className="font-medium capitalize">
                  {SENTIMENT_LABELS[prediction.difficultySentiment]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trend</span>
                <span className="font-medium capitalize">{prediction.trend || 'stable'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Based on</span>
                <span className="font-medium">{prediction.submissionCount} submissions</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-lg mb-4">Score Breakdown</h2>
            <BreakdownChart breakdown={prediction.breakdown} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-indigo-50 rounded-lg p-2">
                <div className="font-semibold text-indigo-700">{prediction.breakdown.crowd}</div>
                <div className="text-xs text-indigo-500">Crowd</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-2">
                <div className="font-semibold text-indigo-700">{prediction.breakdown.historical}</div>
                <div className="text-xs text-indigo-500">Historical</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-2">
                <div className="font-semibold text-indigo-700">{prediction.breakdown.structural}</div>
                <div className="text-xs text-indigo-500">Structural</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-lg mb-4">Historical Cutoffs — {category}</h2>
            <HistoricalChart data={history} />
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function HistoricalChart({ data }) {
  if (!data?.length) {
    return <p className="text-sm text-slate-400 text-center py-8">No historical data available</p>;
  }

  const chartData = data.map((d) => ({
    year: d.year,
    score: d.closingScore,
    rank: d.closingRank,
  }));

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, name) => [value, name === 'score' ? 'Closing Score' : 'Closing Rank']}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: '#6366f1', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

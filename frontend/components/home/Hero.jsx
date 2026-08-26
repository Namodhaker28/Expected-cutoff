import Link from 'next/link';

export default function Hero({ examCount }) {
  return (
    <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass-strong rounded-3xl p-8 sm:p-12">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-800 bg-white/50 backdrop-blur border border-white/70 rounded-full px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live predictions · {examCount > 0 ? `${examCount} exams` : '10+ exams'} supported
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-slate-900">
            Know your expected cutoff{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              before results drop
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-700 max-w-2xl leading-relaxed">
            Stop guessing. Get data-driven cutoff predictions from student crowdsourcing,
            5 years of historical trends, and real seat competition — all in minutes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#exams"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-300/40"
            >
              Find your exam
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <Link
              href="/exams/add"
              className="inline-flex items-center gap-2 glass text-indigo-800 font-semibold px-6 py-3 rounded-xl hover:bg-white/70 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add exam with AI
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '30%', label: 'Crowd signals', sub: 'Student scores & difficulty' },
            { value: '40%', label: 'Historical data', sub: '5-year cutoff trends' },
            { value: '30%', label: 'Seat analysis', sub: 'Applicants vs seats' },
            { value: '< 2 min', label: 'To predict', sub: 'Submit & see results' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-4 sm:p-5">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-700">{stat.value}</div>
              <div className="text-sm font-semibold text-slate-800 mt-1.5">{stat.label}</div>
              <div className="text-xs text-slate-600 mt-1 leading-snug">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

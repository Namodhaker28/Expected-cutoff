import Link from 'next/link';

const EXAM_ICONS = {
  'jee-main': '🎓',
  neet: '🏥',
  'jee-advanced': '🔬',
  gate: '⚙️',
  cat: '📊',
  'upsc-cse': '🏛️',
  'ssc-cgl': '📋',
  'ibps-po': '🏦',
  clat: '⚖️',
  'cuet-ug': '📚',
};

const ICON_COLORS = {
  'jee-main': 'bg-blue-500/15 text-blue-700',
  neet: 'bg-rose-500/15 text-rose-700',
  'jee-advanced': 'bg-violet-500/15 text-violet-700',
  gate: 'bg-amber-500/15 text-amber-700',
  cat: 'bg-emerald-500/15 text-emerald-700',
  'upsc-cse': 'bg-slate-500/15 text-slate-700',
  'ssc-cgl': 'bg-cyan-500/15 text-cyan-700',
  'ibps-po': 'bg-teal-500/15 text-teal-700',
  clat: 'bg-orange-500/15 text-orange-700',
  'cuet-ug': 'bg-indigo-500/15 text-indigo-700',
};

export default function ExamCard({ exam }) {
  const iconClass = ICON_COLORS[exam.slug] || 'bg-indigo-500/15 text-indigo-700';

  return (
    <Link
      href={`/exams/${exam.slug}`}
      className="group block glass rounded-2xl p-5 hover:bg-white/60 hover:shadow-xl hover:shadow-indigo-200/30 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm ${iconClass}`}>
          {EXAM_ICONS[exam.slug] || '📝'}
        </div>
        <svg
          className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <h3 className="font-semibold text-slate-900 mt-4 group-hover:text-indigo-700 transition-colors">
        {exam.name}
      </h3>

      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {exam.source === 'ai' && (
          <span className="text-xs bg-violet-500/15 text-violet-700 px-2 py-0.5 rounded-md font-medium">
            AI generated
          </span>
        )}
        <span className="text-xs bg-white/50 text-slate-700 px-2 py-0.5 rounded-md border border-white/60">
          Max {exam.maxScore} marks
        </span>
      </div>

      <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
        {exam.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/50">
        {exam.categories.slice(0, 3).map((cat) => (
          <span key={cat} className="text-xs bg-white/40 text-slate-700 px-2 py-1 rounded-md border border-white/60">
            {cat}
          </span>
        ))}
        {exam.categories.length > 3 && (
          <span className="text-xs text-slate-500 self-center">+{exam.categories.length - 3} more</span>
        )}
      </div>
    </Link>
  );
}

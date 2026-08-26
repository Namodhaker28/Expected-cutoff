const COLORS = {
  low: 'bg-amber-100 text-amber-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-green-100 text-green-700',
};

export default function ConfidenceBadge({ level }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${COLORS[level] || COLORS.low}`}>
      {level} confidence
    </span>
  );
}

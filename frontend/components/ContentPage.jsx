export default function ContentPage({ title, description, children }) {
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {description && (
            <p className="mt-3 text-lg text-slate-600 leading-relaxed">{description}</p>
          )}
        </header>
        <div className="space-y-8 text-slate-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-indigo-600 [&_a]:font-medium hover:[&_a]:text-indigo-700 [&_strong]:text-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}

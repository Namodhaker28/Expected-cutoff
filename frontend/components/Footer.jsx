import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="mt-8 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <Logo />
            <p className="text-sm text-slate-600 mt-2">Predictions are estimates, not official results.</p>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-700">
            <Link href="/exams/add" className="hover:text-indigo-700 transition-colors">
              Add Exam
            </Link>
            <Link href="/login" className="hover:text-indigo-700 transition-colors">
              Login
            </Link>
            <a href="#exams" className="hover:text-indigo-700 transition-colors">
              Browse Exams
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

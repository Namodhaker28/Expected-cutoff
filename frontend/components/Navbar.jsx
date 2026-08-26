'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors ${
        isHome
          ? 'bg-white/40 backdrop-blur-xl border-b border-white/50'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3 sm:gap-4">
          {isHome && (
            <a
              href="#exams"
              className="hidden sm:inline text-sm font-medium text-slate-700 hover:text-indigo-700 transition-colors"
            >
              Browse exams
            </a>
          )}
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-700 hover:text-indigo-700"
              >
                Dashboard
              </Link>
              <span className="hidden sm:inline text-sm text-slate-500">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-700 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200/50"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

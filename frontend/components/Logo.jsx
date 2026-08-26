import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ className = '', showText = true, size = 32, variant = 'default' }) {
  const textClass =
    variant === 'light'
      ? 'font-bold text-lg text-white'
      : 'font-bold text-lg bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent';

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Expected Cutoff — Home">
      <Image
        src="/logo-mark.svg"
        alt=""
        width={size}
        height={size}
        className="shrink-0"
        priority
        aria-hidden
      />
      {showText && <span className={textClass}>Expected Cutoff</span>}
    </Link>
  );
}

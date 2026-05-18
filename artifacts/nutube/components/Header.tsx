import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function Header() {
  return (
    <header className="nt-header">
      <div className="nt-header-inner">
        <Link href="/" className="nt-logo">{SITE.name}</Link>
        <nav className="nt-nav">
          <Link href="/blog">가이드</Link>
          <Link href="/about">소개</Link>
          <Link href="/publish" className="nt-nav-cta">메타데이터 생성기</Link>
        </nav>
      </div>
    </header>
  );
}

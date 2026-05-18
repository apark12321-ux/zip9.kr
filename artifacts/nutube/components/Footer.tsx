import Link from 'next/link';
import { SITE, CATEGORIES } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="nt-footer">
      <div className="nt-footer-inner">
        <div className="nt-footer-brand">
          <h3>{SITE.name}</h3>
          <p>유튜브 채널 운영자를 위한 실전 가이드.<br/>알고리즘, 시니어 쇼츠, AI 도구, 수익화를 다룹니다.</p>
        </div>

        <div className="nt-footer-section">
          <h4>카테고리</h4>
          <ul>
            <li><Link href={`/blog?category=${CATEGORIES.algorithm.key}`}>{CATEGORIES.algorithm.label}</Link></li>
            <li><Link href={`/blog?category=${CATEGORIES.senior.key}`}>{CATEGORIES.senior.label}</Link></li>
            <li><Link href={`/blog?category=${CATEGORIES.aitools.key}`}>{CATEGORIES.aitools.label}</Link></li>
            <li><Link href={`/blog?category=${CATEGORIES.monetization.key}`}>{CATEGORIES.monetization.label}</Link></li>
          </ul>
        </div>

        <div className="nt-footer-section">
          <h4>사이트 정보</h4>
          <ul>
            <li><Link href="/about">소개</Link></li>
            <li><Link href="/announcement">공지사항</Link></li>
            <li><Link href="/partnership">제휴 문의</Link></li>
            <li><Link href="/privacy">개인정보처리방침</Link></li>
            <li><Link href="/terms">이용약관</Link></li>
          </ul>
        </div>
      </div>

      <div className="nt-footer-bottom">
        <div className="nt-footer-operator">
          {SITE.operator.company} · 대표: {SITE.operator.representative} · 사업자등록번호: {SITE.operator.taxId}<br/>
          {SITE.operator.address} · 이메일: <a href={`mailto:${SITE.operator.email}`}>{SITE.operator.email}</a>
        </div>
        <div className="nt-footer-copyright">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
      </div>
    </footer>
  );
}

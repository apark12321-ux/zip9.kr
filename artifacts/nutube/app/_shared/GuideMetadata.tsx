'use client';

// NuTube 가이드 SEO 메타 + JSON-LD 컴포넌트
// 박 대표님 사이트 검색 최적화 (애드센스 승인 후 SEO ↑)
//
// 사용 방법 (각 가이드 page.tsx):
//
// import { GuideMetadata } from '../../_shared/GuideMetadata';
//
// <GuideMetadata
//   slug="shorts-algorithm-mastery"
//   title="유튜브 쇼츠 알고리즘 완전 정복"
//   subtitle="100만 조회의 비밀"
//   description="긴 영상과 다른 쇼츠만의 알고리즘 5가지 핵심 원칙"
//   category="알고리즘"
//   publishedAt="2026-05-08"
//   readTime="9분"
// />

import { useEffect } from 'react';

interface GuideMetadataProps {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  publishedAt: string;
  readTime?: string;
  author?: string;
  image?: string;
}

const SITE_URL = 'https://nutube.kr';
const SITE_NAME = 'NuTube';
const DEFAULT_AUTHOR = '알고파트너스';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const PUBLISHER_LOGO = `${SITE_URL}/logo.png`;

export function GuideMetadata({
  slug,
  title,
  subtitle,
  description,
  category,
  publishedAt,
  readTime = '8분',
  author = DEFAULT_AUTHOR,
  image = DEFAULT_IMAGE,
}: GuideMetadataProps) {
  const url = `${SITE_URL}/blog/${slug}`;
  const fullTitle = subtitle ? `${title} - ${subtitle}` : title;
  
  // JSON-LD Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    author: {
      '@type': 'Organization',
      name: author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO,
      },
    },
    datePublished: publishedAt,
    dateModified: publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
    inLanguage: 'ko-KR',
  };
  
  // JSON-LD Breadcrumb
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '가이드',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: url,
      },
    ],
  };
  
  // 동적으로 head 메타 태그 삽입 (Client Component)
  useEffect(() => {
    // document title
    document.title = `${fullTitle} | ${SITE_NAME}`;
    
    // meta description
    setMetaTag('description', description);
    
    // canonical URL
    setLinkTag('canonical', url);
    
    // Open Graph
    setMetaProperty('og:title', fullTitle);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', url);
    setMetaProperty('og:type', 'article');
    setMetaProperty('og:site_name', SITE_NAME);
    setMetaProperty('og:image', image);
    setMetaProperty('og:locale', 'ko_KR');
    setMetaProperty('article:published_time', publishedAt);
    setMetaProperty('article:section', category);
    setMetaProperty('article:author', author);
    
    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);
    
    // 정리 함수 (페이지 이동 시)
    return () => {
      // 기본 메타로 복원 (선택)
    };
  }, [slug, fullTitle, description, url, category, publishedAt, author, image]);
  
  return (
    <>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

// Helper: meta tag with name attribute
function setMetaTag(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Helper: meta tag with property attribute (Open Graph)
function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Helper: link tag
function setLinkTag(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// 페이지 상단 Breadcrumb UI (선택)
export function Breadcrumb({ title }: { title: string }) {
  return (
    <nav
      aria-label="breadcrumb"
      style={{
        fontSize: 13,
        color: '#737373',
        marginBottom: 16,
        wordBreak: 'keep-all',
      }}
    >
      <a href="/" style={{ color: '#737373', textDecoration: 'none' }}>홈</a>
      <span style={{ margin: '0 8px', color: '#d4d4d4' }}>›</span>
      <a href="/blog" style={{ color: '#737373', textDecoration: 'none' }}>가이드</a>
      <span style={{ margin: '0 8px', color: '#d4d4d4' }}>›</span>
      <span style={{ color: '#0a0a0a', fontWeight: 500 }}>{title}</span>
    </nav>
  );
}

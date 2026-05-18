/**
 * SEO 헬퍼 및 JSON-LD 컴포넌트
 *
 * JsonLd: 구조화 데이터 삽입 컴포넌트
 * generate 함수들: JSON-LD 객체 생성 헬퍼
 */

import React from 'react';

/**
 * JSON-LD 구조화 데이터 삽입 컴포넌트
 * 
 * 사용법:
 * <JsonLd data={someJsonLdObject} />
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Breadcrumb JSON-LD 생성 헬퍼
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article JSON-LD 생성 헬퍼
 */
export function generateArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  imageUrl,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  modifiedAt?: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl || 'https://project-blackbox-cpqy.vercel.app/og-image.jpg',
    datePublished: publishedAt || '2025-01-01T00:00:00+09:00',
    dateModified: modifiedAt || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'NuTube',
      url: 'https://project-blackbox-cpqy.vercel.app',
    },
    publisher: {
      '@type': 'Organization',
      name: '한줄컴퍼니',
      logo: {
        '@type': 'ImageObject',
        url: 'https://project-blackbox-cpqy.vercel.app/logo-512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://project-blackbox-cpqy.vercel.app/knowhow/${slug}`,
    },
  };
}

/**
 * FAQ JSON-LD 생성 헬퍼
 */
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * HowTo JSON-LD 생성 헬퍼
 */
export function generateHowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

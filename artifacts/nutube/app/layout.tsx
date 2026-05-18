import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - 유튜브 채널 운영 실전 가이드`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ['유튜브', '유튜브 알고리즘', '시니어 쇼츠', 'AI 도구', '유튜브 수익화', '채널 운영'],
  authors: [{ name: SITE.operator.company }],
  creator: SITE.operator.representative,
  publisher: SITE.operator.company,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} - 유튜브 채널 운영 실전 가이드`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} - 유튜브 채널 운영 실전 가이드`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    other: {
      'google-adsense-account': SITE.adsenseClient,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // WebSite JSON-LD (홈 검색 액션)
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    alternateName: SITE.fullName,
    url: SITE.url,
    description: SITE.description,
    inLanguage: 'ko-KR',
    publisher: {
      '@type': 'Organization',
      name: SITE.operator.company,
      url: SITE.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Organization JSON-LD (사업자 정보 풀세트)
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.operator.company,
    alternateName: 'AlgoPartners',
    url: SITE.url,
    logo: `${SITE.url}/og-default.jpg`,
    foundingDate: SITE.operator.foundingDate,
    taxID: SITE.operator.taxId,
    vatID: SITE.operator.taxId,
    founder: {
      '@type': 'Person',
      name: SITE.operator.representative,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.operator.streetAddress,
      addressLocality: SITE.operator.addressLocality,
      addressRegion: SITE.operator.addressRegion,
      addressCountry: 'KR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE.operator.email,
      contactType: 'customer support',
      availableLanguage: ['Korean'],
    },
    sameAs: [SITE.url],
  };

  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={SITE.url} />
        <meta name="naver-site-verification" content="" />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}`}
          crossOrigin="anonymous"
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main className="nt-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SITE, CATEGORIES } from '@/lib/site';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: '가이드를 찾을 수 없습니다' };

  const cat = CATEGORIES[post.category as keyof typeof CATEGORIES];
  const url = `${SITE.url}/blog/${post.slug}`;
  const description = post.summary || post.subtitle || `${cat?.label || 'NuTube'} 카테고리 가이드`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      siteName: SITE.name,
      publishedTime: post.publishedAt,
      authors: ['NuTube 편집팀'],
      images: [{ url: post.thumbnail || SITE.ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.thumbnail || SITE.ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const cat = CATEGORIES[post.category as keyof typeof CATEGORIES] || CATEGORIES.algorithm;
  const related = await getRelatedPosts(post.slug, post.category, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary || post.subtitle,
    author: { '@type': 'Organization', name: 'NuTube 편집팀' },
    publisher: {
      '@type': 'Organization',
      name: SITE.operator.company,
      url: SITE.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/og-default.jpg` },
      founder: { '@type': 'Person', name: SITE.operator.representative },
      foundingDate: SITE.operator.foundingDate,
      taxID: SITE.operator.taxId,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.operator.streetAddress,
        addressLocality: SITE.operator.addressLocality,
        addressRegion: SITE.operator.addressRegion,
        addressCountry: 'KR',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/${post.slug}` },
    image: post.thumbnail ? `${SITE.url}${post.thumbnail}` : `${SITE.url}${SITE.ogImage}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: cat.label, item: `${SITE.url}/blog?category=${post.category}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE.url}/blog/${post.slug}` },
    ],
  };

  return (
    <article className="nt-post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <style>{`
        .nt-post-container { max-width: 760px; margin: 0 auto; padding: 32px 20px 80px; }
        @media(max-width: 640px){ .nt-post-container { padding: 24px 16px 60px; } }

        .nt-breadcrumb {
          display: flex; gap: 8px; align-items: center;
          font-size: 13px; color: #9ca3af; margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .nt-breadcrumb a { color: #6b7280; }
        .nt-breadcrumb a:hover { color: #4f46e5; }
        .nt-breadcrumb .sep { color: #d1d5db; }

        .nt-post-cat-badge {
          display: inline-block; padding: 6px 14px; border-radius: 999px;
          font-size: 12px; font-weight: 700; margin-bottom: 16px;
        }

        .nt-post-title {
          font-size: 36px; font-weight: 800; line-height: 1.25;
          letter-spacing: -0.025em; color: #111827;
          margin: 0 0 16px; word-break: keep-all;
        }
        @media(max-width: 640px){ .nt-post-title { font-size: 26px; } }

        .nt-post-subtitle {
          font-size: 17px; color: #6b7280; line-height: 1.6;
          margin: 0 0 24px; word-break: keep-all;
        }

        .nt-post-meta {
          display: flex; align-items: center; gap: 12px;
          padding: 20px 0; border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6; margin-bottom: 32px;
        }
        .nt-post-avatar {
          width: 44px; height: 44px; border-radius: 999px;
          background: #eef2ff; color: #4f46e5;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 18px;
        }
        .nt-post-meta-text { font-size: 13px; }
        .nt-post-author { font-weight: 700; color: #111827; }
        .nt-post-date { color: #9ca3af; margin-top: 2px; }

        .nt-post-thumb {
          aspect-ratio: 16/9; border-radius: 20px; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 96px; margin-bottom: 40px;
        }
        @media(max-width: 640px){
          .nt-post-thumb { border-radius: 16px; font-size: 64px; margin-bottom: 24px; }
        }

        .nt-post-body {
          font-size: 17px; line-height: 1.85; color: #374151;
          word-break: keep-all;
        }
        .nt-post-body h2 {
          font-size: 26px; font-weight: 800; color: #111827;
          margin: 48px 0 16px; padding-bottom: 10px;
          border-bottom: 2px solid #eef2ff;
        }
        .nt-post-body h3 {
          font-size: 19px; font-weight: 700; color: #111827;
          margin: 32px 0 12px;
        }
        .nt-post-body p { margin: 0 0 18px; line-height: 1.85; }
        .nt-post-body strong { color: #4f46e5; font-weight: 700; }
        .nt-post-body ul, .nt-post-body ol { margin: 0 0 18px; padding-left: 24px; }
        .nt-post-body li { margin-bottom: 8px; line-height: 1.75; }
        .nt-post-body a { color: #4f46e5; text-decoration: underline; }
        .nt-post-body code {
          background: #f3f4f6; border-radius: 4px;
          padding: 2px 6px; font-size: 14px; font-family: 'D2Coding', monospace;
          color: #dc2626;
        }
        .nt-post-body pre {
          background: #1f2937; color: #f9fafb; border-radius: 12px;
          padding: 20px; overflow-x: auto; margin: 0 0 24px;
        }
        .nt-post-body pre code { background: none; padding: 0; color: inherit; }
        .nt-post-body blockquote {
          background: #f8f7ff; border-left: 4px solid #4f46e5;
          border-radius: 8px; padding: 16px 24px; margin: 0 0 24px;
          color: #4b5563; font-style: italic;
        }
        .nt-post-body table {
          width: 100%; border-collapse: collapse; margin: 0 0 24px;
          font-size: 15px;
        }
        .nt-post-body th, .nt-post-body td {
          border: 1px solid #e5e7eb; padding: 10px 14px; text-align: left;
        }
        .nt-post-body th { background: #f9fafb; font-weight: 700; color: #111827; }

        .nt-tags {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin: 48px 0 0; padding-top: 24px; border-top: 1px solid #f3f4f6;
        }
        .nt-tag {
          font-size: 13px; font-weight: 600; color: #6366f1;
          background: #eef2ff; padding: 5px 12px; border-radius: 999px;
        }

        .nt-cta-box {
          margin-top: 60px; padding: 36px;
          background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
          border-radius: 24px; text-align: center;
        }
        @media(max-width: 640px){ .nt-cta-box { padding: 24px; } }
        .nt-cta-title { font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 8px; }
        .nt-cta-desc { font-size: 15px; color: #6b7280; margin: 0 0 20px; }
        .nt-cta-btn {
          display: inline-block; padding: 12px 28px;
          background: #4f46e5; color: #fff;
          font-size: 15px; font-weight: 700; border-radius: 999px;
          box-shadow: 0 4px 16px rgba(79,70,229,.25);
        }
        .nt-cta-btn:hover { background: #4338ca; color: #fff; }

        .nt-related {
          margin-top: 80px; padding-top: 40px; border-top: 1px solid #f3f4f6;
        }
        .nt-related h3 {
          font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 24px;
        }
        .nt-related-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
        }
        @media(max-width: 768px){ .nt-related-grid { grid-template-columns: 1fr; } }
        .nt-related-card {
          background: #fff; border: 1px solid #f3f4f6; border-radius: 12px;
          padding: 16px; transition: all 0.2s;
        }
        .nt-related-card:hover {
          border-color: #c7d2fe; transform: translateY(-2px);
        }
        .nt-related-card-cat {
          display: inline-block; padding: 2px 8px; border-radius: 999px;
          font-size: 10px; font-weight: 700; margin-bottom: 8px;
        }
        .nt-related-card-title {
          font-size: 14px; font-weight: 700; color: #111827; line-height: 1.4;
          margin: 0;
        }
      `}</style>

      <div className="nt-post-container">
        {/* Breadcrumb */}
        <nav className="nt-breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">›</span>
          <Link href={`/blog?category=${post.category}`}>{cat.label}</Link>
          <span className="sep">›</span>
          <span style={{ color: '#4b5563' }}>{post.title.length > 30 ? post.title.slice(0, 30) + '…' : post.title}</span>
        </nav>

        <span className="nt-post-cat-badge" style={{ background: cat.bgLight, color: cat.color }}>
          {cat.icon} {cat.label}
        </span>

        <h1 className="nt-post-title">{post.title}</h1>
        {post.subtitle && <p className="nt-post-subtitle">{post.subtitle}</p>}

        <div className="nt-post-meta">
          <div className="nt-post-avatar">N</div>
          <div className="nt-post-meta-text">
            <div className="nt-post-author">NuTube 편집팀</div>
            <div className="nt-post-date">
              {formatDate(post.publishedAt)} · {calculateReadTime(post.body)} 읽기
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <span className="nt-post-updated"> · {formatDate(post.updatedAt)} 업데이트</span>
              )}
            </div>
          </div>
        </div>

        <div className="nt-post-thumb" style={{ background: cat.gradient }}>{cat.icon}</div>

        {/* 본문 - 서버사이드 마크다운 렌더링 */}
        <div className="nt-post-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="nt-tags">
            {post.tags.slice(0, 10).map((tag) => (
              <span key={tag} className="nt-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="nt-cta-box">
          <h3 className="nt-cta-title">유튜브 메타데이터, 한 번에 만들어보세요</h3>
          <p className="nt-cta-desc">제목·설명·태그·썸네일 카피까지 NuTube의 메타데이터 생성기로.</p>
          <Link href="/publish" className="nt-cta-btn">메타데이터 생성기 →</Link>
        </div>

        {related.length > 0 && (
          <div className="nt-related">
            <h3>{cat.label} 관련 가이드</h3>
            <div className="nt-related-grid">
              {related.map((r) => {
                const rcat = CATEGORIES[r.category as keyof typeof CATEGORIES] || CATEGORIES.algorithm;
                return (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="nt-related-card">
                    <span className="nt-related-card-cat" style={{ background: rcat.bgLight, color: rcat.color }}>{rcat.label}</span>
                    <p className="nt-related-card-title">{r.title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function calculateReadTime(text: string): string {
  if (!text) return '1분';
  const plain = text.replace(/[#>*_\[\]`]/g, '').replace(/\s+/g, ' ').trim();
  return `${Math.max(1, Math.ceil(plain.length / 500))}분`;
}

import Link from 'next/link';
import { Suspense } from 'react';
import { CATEGORIES, CATEGORY_KEYS } from '@/lib/site';
import { getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '가이드 모음',
  description: '유튜브 알고리즘, 시니어 사연 쇼츠, AI 도구, 수익화까지 - NuTube 편집팀이 정리한 가이드 모음입니다.',
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || 'all';

  const allPosts = await getAllPosts();
  const filteredPosts = selectedCategory === 'all'
    ? allPosts
    : allPosts.filter((p) => p.category === selectedCategory);

  return (
    <div className="nt-blog-list">
      <style>{`
        .nt-blog-list { max-width: 1200px; margin: 0 auto; padding: 60px 20px 80px; }
        @media(max-width: 640px){ .nt-blog-list { padding: 40px 16px 60px; } }

        .nt-blog-header { margin-bottom: 32px; }
        .nt-blog-title {
          font-size: 36px; font-weight: 800; margin: 0 0 12px;
          letter-spacing: -0.02em; color: #111827;
        }
        @media(max-width: 640px){ .nt-blog-title { font-size: 26px; } }
        .nt-blog-desc { font-size: 16px; color: #6b7280; margin: 0; }

        .nt-cat-tabs {
          display: flex; gap: 8px; flex-wrap: wrap; margin: 32px 0;
        }
        .nt-cat-tab {
          padding: 8px 16px; border-radius: 999px;
          font-size: 14px; font-weight: 600;
          background: #f3f4f6; color: #4b5563;
          transition: all 0.15s;
        }
        .nt-cat-tab:hover { background: #e5e7eb; color: #111827; }
        .nt-cat-tab.active {
          background: #4f46e5; color: #fff;
        }
        .nt-cat-tab.active:hover { background: #4338ca; color: #fff; }

        .nt-result-count {
          font-size: 13px; color: #9ca3af; margin-bottom: 24px;
        }

        .nt-post-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
        }
        @media(max-width: 900px){ .nt-post-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 600px){ .nt-post-grid { grid-template-columns: 1fr; } }
        .nt-post-card {
          background: #fff; border: 1px solid #f3f4f6; border-radius: 16px;
          overflow: hidden; transition: all 0.2s;
        }
        .nt-post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,.08);
          border-color: #e0e7ff;
        }
        .nt-post-thumb {
          aspect-ratio: 16/9; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 56px;
        }
        .nt-post-body { padding: 20px; }
        .nt-post-cat {
          display: inline-block; padding: 3px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 700; margin-bottom: 10px;
        }
        .nt-post-title {
          font-size: 16px; font-weight: 700; color: #111827; margin: 0 0 8px;
          line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .nt-post-summary {
          font-size: 13px; color: #6b7280; line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; margin: 0 0 8px;
        }
        .nt-post-meta { font-size: 12px; color: #9ca3af; }

        .nt-empty {
          text-align: center; padding: 80px 20px; color: #9ca3af;
        }
      `}</style>

      <div className="nt-blog-header">
        <h1 className="nt-blog-title">가이드 모음</h1>
        <p className="nt-blog-desc">유튜브 채널 운영에 도움 되는 글들을 카테고리별로 정리했습니다.</p>
      </div>

      <div className="nt-cat-tabs">
        <Link
          href="/blog"
          className={`nt-cat-tab ${selectedCategory === 'all' ? 'active' : ''}`}
        >
          전체 ({allPosts.length})
        </Link>
        {CATEGORY_KEYS.map((key) => {
          const cat = CATEGORIES[key];
          const count = allPosts.filter((p) => p.category === key).length;
          return (
            <Link
              key={key}
              href={`/blog?category=${key}`}
              className={`nt-cat-tab ${selectedCategory === key ? 'active' : ''}`}
            >
              {cat.icon} {cat.label} ({count})
            </Link>
          );
        })}
      </div>

      <div className="nt-result-count">총 {filteredPosts.length}개 가이드</div>

      {filteredPosts.length === 0 ? (
        <div className="nt-empty">아직 게시된 가이드가 없습니다.</div>
      ) : (
        <div className="nt-post-grid">
          {filteredPosts.map((post) => {
            const cat = CATEGORIES[post.category as keyof typeof CATEGORIES] || CATEGORIES.algorithm;
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="nt-post-card">
                <div className="nt-post-thumb" style={{ background: cat.gradient }}>{cat.icon}</div>
                <div className="nt-post-body">
                  <span className="nt-post-cat" style={{ background: cat.bgLight, color: cat.color }}>{cat.label}</span>
                  <h3 className="nt-post-title">{post.title}</h3>
                  {post.summary && <p className="nt-post-summary">{post.summary}</p>}
                  <div className="nt-post-meta">{formatDate(post.publishedAt)} · NuTube 편집팀</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

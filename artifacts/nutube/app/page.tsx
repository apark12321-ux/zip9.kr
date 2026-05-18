import Link from 'next/link';
import { CATEGORIES, CATEGORY_KEYS, SITE } from '@/lib/site';
import { getAllPosts } from '@/lib/posts';

export const revalidate = 60;

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 9);

  return (
    <div className="nt-home">
      <style>{`
        .nt-hero {
          background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fef3c7 100%);
          padding: 80px 20px 100px; text-align: center;
        }
        @media(max-width: 640px){ .nt-hero { padding: 56px 16px 64px; } }
        .nt-hero h1 {
          font-size: 44px; font-weight: 800; letter-spacing: -0.03em;
          color: #111827; margin: 0 0 16px; line-height: 1.2;
        }
        @media(max-width: 640px){ .nt-hero h1 { font-size: 28px; } }
        .nt-hero p {
          font-size: 18px; color: #4b5563; margin: 0 auto 32px;
          max-width: 640px; line-height: 1.6;
        }
        @media(max-width: 640px){ .nt-hero p { font-size: 15px; margin-bottom: 24px; } }
        .nt-hero-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: #4f46e5; color: #fff;
          font-size: 16px; font-weight: 700; border-radius: 999px;
          box-shadow: 0 8px 24px rgba(79,70,229,.3);
          transition: transform 0.2s;
        }
        .nt-hero-cta:hover { transform: translateY(-2px); color: #fff; }
        .nt-hero-sub {
          margin-top: 14px; font-size: 13px; color: #6b7280;
        }

        .nt-section {
          max-width: 1200px; margin: 0 auto; padding: 60px 20px;
        }
        @media(max-width: 640px){ .nt-section { padding: 40px 16px; } }
        .nt-section-title {
          font-size: 28px; font-weight: 800; color: #111827;
          margin: 0 0 8px; letter-spacing: -0.02em;
        }
        .nt-section-desc {
          font-size: 15px; color: #6b7280; margin: 0 0 32px;
        }

        .nt-cat-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
        }
        @media(max-width: 768px){ .nt-cat-grid { grid-template-columns: repeat(2, 1fr); } }
        .nt-cat-card {
          padding: 28px 20px; border-radius: 16px;
          color: #fff; transition: transform 0.2s;
          display: block; min-height: 160px;
        }
        .nt-cat-card:hover { transform: translateY(-4px); color: #fff; }
        .nt-cat-card .icon { font-size: 32px; margin-bottom: 12px; }
        .nt-cat-card h3 { font-size: 17px; font-weight: 800; margin: 0 0 6px; }
        .nt-cat-card p { font-size: 13px; opacity: 0.9; margin: 0; line-height: 1.5; }

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
        .nt-post-meta { font-size: 12px; color: #9ca3af; }

        .nt-more-link {
          display: inline-block; margin-top: 24px;
          padding: 10px 20px; background: #f3f4f6;
          color: #4b5563; font-size: 14px; font-weight: 600;
          border-radius: 8px;
        }
        .nt-more-link:hover { background: #e5e7eb; color: #111827; }
      `}</style>

      {/* Hero */}
      <section className="nt-hero">
        <h1>유튜브 채널, 제대로 키우는 법</h1>
        <p>알고리즘, 시니어 사연 쇼츠, AI 도구, 수익화까지<br/>실전에서 검증된 노하우를 정리했습니다.</p>
        <Link href="/publish" className="nt-hero-cta">메타데이터 생성기 사용하기 →</Link>
        <div className="nt-hero-sub">제목·설명·태그·썸네일 카피를 한 번에</div>
      </section>

      {/* 카테고리 */}
      <section className="nt-section">
        <h2 className="nt-section-title">카테고리</h2>
        <p className="nt-section-desc">관심 주제를 골라서 들어가 보세요.</p>
        <div className="nt-cat-grid">
          {CATEGORY_KEYS.map((key) => {
            const cat = CATEGORIES[key];
            return (
              <Link key={key} href={`/blog?category=${key}`} className="nt-cat-card" style={{ background: cat.gradient }}>
                <div className="icon">{cat.icon}</div>
                <h3>{cat.label}</h3>
                <p>{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 최신 글 */}
      <section className="nt-section">
        <h2 className="nt-section-title">최신 가이드</h2>
        <p className="nt-section-desc">방금 올라온 가이드들입니다.</p>
        {recentPosts.length === 0 ? (
          <p style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>아직 게시된 가이드가 없습니다.</p>
        ) : (
          <>
            <div className="nt-post-grid">
              {recentPosts.map((post) => {
                const cat = CATEGORIES[post.category as keyof typeof CATEGORIES] || CATEGORIES.algorithm;
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="nt-post-card">
                    <div className="nt-post-thumb" style={{ background: cat.gradient }}>{cat.icon}</div>
                    <div className="nt-post-body">
                      <span className="nt-post-cat" style={{ background: cat.bgLight, color: cat.color }}>{cat.label}</span>
                      <h3 className="nt-post-title">{post.title}</h3>
                      <div className="nt-post-meta">
                        {formatDate(post.publishedAt)} · NuTube 편집팀
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link href="/blog" className="nt-more-link">모든 가이드 보기 →</Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

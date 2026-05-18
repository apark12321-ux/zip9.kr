import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      maxWidth: 560, margin: '0 auto', padding: '120px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 80, fontWeight: 800, color: '#e0e7ff', lineHeight: 1, marginBottom: 16 }}>
        404
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>
        페이지를 찾을 수 없습니다
      </h1>
      <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 32px', lineHeight: 1.6 }}>
        주소가 잘못되었거나, 글이 옮겨졌을 수 있어요.
      </p>
      <Link href="/" style={{
        display: 'inline-block', padding: '12px 24px',
        background: '#4f46e5', color: '#fff',
        fontSize: 15, fontWeight: 700, borderRadius: 999,
      }}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}

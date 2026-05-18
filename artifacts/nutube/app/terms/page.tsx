import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: '이용약관',
  description: 'NuTube 이용약관입니다.',
};

export default function TermsPage() {
  return (
    <div className="nt-page">
      <h1>이용약관</h1>
      <p className="nt-lead">본 약관은 NuTube({SITE.url})를 이용하는 모든 이용자와 운영자 간의 권리·의무를 규정합니다.</p>

      <h2>제1조 (목적)</h2>
      <p>본 약관은 {SITE.operator.company}가 제공하는 콘텐츠 및 서비스의 이용 조건, 절차, 운영자와 이용자 간의 권리·의무·책임 사항 등을 정함을 목적으로 합니다.</p>

      <h2>제2조 (용어의 정의)</h2>
      <ul>
        <li><strong>운영자</strong>: {SITE.operator.company} (대표: {SITE.operator.representative}, 사업자등록번호: {SITE.operator.taxId})</li>
        <li><strong>서비스</strong>: NuTube가 제공하는 웹사이트({SITE.url}) 및 부수 서비스</li>
        <li><strong>이용자</strong>: 본 사이트에 접속하여 서비스를 이용하는 모든 사람</li>
        <li><strong>콘텐츠</strong>: 본 사이트에 게시된 모든 글, 이미지, 데이터 등</li>
      </ul>

      <h2>제3조 (약관의 효력 및 변경)</h2>
      <p>본 약관은 사이트에 게시함으로써 효력이 발생합니다. 약관 변경 시에는 변경 사항을 사이트에 7일 이상 사전 공지합니다.</p>

      <h2>제4조 (서비스의 제공)</h2>
      <p>운영자는 다음 서비스를 제공합니다.</p>
      <ul>
        <li>유튜브 채널 운영 관련 정보 및 가이드</li>
        <li>메타데이터 생성기 (제목·설명·태그·썸네일 카피 보조 도구)</li>
        <li>관련 도구, 자료, 안내</li>
      </ul>

      <h2>제5조 (이용자의 의무)</h2>
      <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
      <ul>
        <li>본 사이트의 콘텐츠를 운영자의 사전 동의 없이 복제·배포·상업적 이용</li>
        <li>본 사이트의 운영을 방해하는 행위</li>
        <li>타인의 권리(저작권, 초상권 등)를 침해하는 행위</li>
      </ul>

      <h2>제6조 (저작권)</h2>
      <p>본 사이트의 모든 콘텐츠 저작권은 {SITE.operator.company}에 귀속됩니다. 인용 시 출처를 명시하고 비상업적 목적에 한해 일부 인용이 가능합니다. 전문 복제·재배포·상업적 이용은 사전 서면 동의가 필요합니다.</p>

      <h2>제7조 (책임의 제한)</h2>
      <p>NuTube가 제공하는 정보는 일반적 안내 목적의 참고 자료이며, 다음 사항에 대해 운영자는 직접적 책임을 지지 않습니다.</p>
      <ul>
        <li>본 사이트의 정보를 활용한 채널 운영 결과</li>
        <li>유튜브 정책 및 알고리즘 변경에 따른 결과 변동</li>
        <li>제3자 도구·서비스 이용으로 발생한 분쟁</li>
      </ul>
      <p>중요한 의사결정 전에는 공식 출처 및 전문가 검토를 권장합니다.</p>

      <h2>제8조 (광고)</h2>
      <p>본 사이트는 Google AdSense를 비롯한 광고 네트워크의 광고를 표시할 수 있습니다. 광고의 콘텐츠와 그 결과에 대한 책임은 해당 광고주에게 있습니다.</p>

      <h2>제9조 (준거법 및 관할)</h2>
      <p>본 약관은 대한민국 법률에 따라 해석되며, 분쟁 시 운영자 소재지 관할 법원을 1심 관할로 합니다.</p>

      <h2>제10조 (운영자 정보)</h2>
      <div className="nt-info-box">
        <dl>
          <dt>상호</dt>
          <dd>{SITE.operator.company}</dd>
          <dt>대표자</dt>
          <dd>{SITE.operator.representative}</dd>
          <dt>사업자등록번호</dt>
          <dd>{SITE.operator.taxId}</dd>
          <dt>사업장 주소</dt>
          <dd>{SITE.operator.address}</dd>
          <dt>이메일</dt>
          <dd><a href={`mailto:${SITE.operator.email}`}>{SITE.operator.email}</a></dd>
        </dl>
      </div>

      <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 32 }}>본 약관 시행일자: 2026년 4월 28일</p>
    </div>
  );
}

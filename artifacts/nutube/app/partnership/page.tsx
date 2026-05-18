import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: '제휴 및 비즈니스 문의',
  description: 'NuTube 제휴, 광고, 콘텐츠 협력 문의 안내입니다.',
};

export default function PartnershipPage() {
  return (
    <div className="nt-page">
      <h1>제휴 및 비즈니스 문의</h1>
      <p className="nt-lead">NuTube와 함께 일하고 싶으시면 아래 채널로 문의해주세요.</p>

      <h2>다루는 제휴 분야</h2>
      <ul>
        <li><strong>도구·서비스 리뷰 협력</strong> - 유튜버용 AI 도구, 편집 소프트웨어, 자막 서비스 등</li>
        <li><strong>콘텐츠 게재 협력</strong> - 가이드성 콘텐츠 공동 제작</li>
        <li><strong>광고 및 후원</strong> - 카테고리 적합성을 확인한 후 진행</li>
        <li><strong>강연·인터뷰</strong> - 유튜브 운영 관련 전문가 인터뷰, 강연 등</li>
      </ul>

      <h2>제안 시 안내</h2>
      <p>제안 메일에는 다음 사항을 포함해주시면 검토가 빠릅니다.</p>
      <ul>
        <li>회사·서비스 이름 및 간단한 소개</li>
        <li>제안하시는 협력 형태와 기간</li>
        <li>예상 진행 일정</li>
        <li>담당자 연락처</li>
      </ul>

      <h2>편집 독립성 원칙</h2>
      <p>NuTube는 다음 원칙에 따라 광고와 협력 콘텐츠를 운영합니다.</p>
      <ul>
        <li><strong>표시 의무</strong> - 협력 콘텐츠는 "광고", "협찬", "유료 광고 포함" 등으로 명확히 표시합니다</li>
        <li><strong>독립성 보장</strong> - 광고주가 편집권을 행사할 수 없습니다. 가이드의 결론은 편집팀이 단독 결정합니다</li>
        <li><strong>주제 적합성</strong> - 유튜브·영상 콘텐츠와 무관한 광고는 게재하지 않습니다</li>
        <li><strong>비판 가능성</strong> - 협력 제품·서비스의 단점도 균형 있게 안내합니다</li>
      </ul>

      <h2>응답 시간</h2>
      <p>제안 메일은 영업일 기준 5일 이내 답변드리는 것을 원칙으로 합니다. 사안에 따라 더 길어질 수 있으니 양해 부탁드립니다.</p>

      <h2>운영자 정보</h2>
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
          <dd><a href={`mailto:${SITE.operator.email}?subject=[NuTube 제휴 문의]`}>{SITE.operator.email}</a></dd>
        </dl>
      </div>
      <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 24 }}>
        제목에 [NuTube 제휴 문의]를 붙여주시면 빠른 분류에 도움이 됩니다.
      </p>
    </div>
  );
}

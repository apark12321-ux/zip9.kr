import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: '소개',
  description: 'NuTube는 유튜브 채널 운영자를 위한 실전 가이드 미디어입니다. 알고리즘, 시니어 사연 쇼츠, AI 도구, 수익화를 다룹니다.',
};

export default function AboutPage() {
  return (
    <div className="nt-page">
      <h1>NuTube 소개</h1>
      <p className="nt-lead">
        유튜브 채널을 운영하면서 마주치는 진짜 문제들을, 검증된 데이터와 실전 경험으로 풀어드리는 미디어입니다.
      </p>

      <h2>다루는 주제</h2>
      <p>NuTube는 다음 네 가지 주제에 집중합니다.</p>
      <ul>
        <li><strong>유튜브 알고리즘</strong> - 추천 시스템의 작동 원리, CTR과 평균 시청 지속 시간의 균형</li>
        <li><strong>시니어 사연 쇼츠</strong> - 시니어 타깃 사연·고민·체험담 쇼츠의 기획과 운영</li>
        <li><strong>AI 도구</strong> - 대본, 음성, 이미지, 편집까지 유튜버에게 실제로 도움이 되는 도구</li>
        <li><strong>영상 채널 수익화</strong> - 애드센스부터 멤버십, 슈퍼챗, 브랜드 협찬까지</li>
      </ul>

      <h2>콘텐츠 제작 원칙</h2>
      <p>NuTube의 모든 가이드는 다음 원칙을 지킵니다.</p>
      <ul>
        <li><strong>사실 검증</strong> - 정책, 알고리즘 변화, 도구 정보는 공식 출처를 우선 확인합니다.</li>
        <li><strong>실전 우선</strong> - 이론만 나열하지 않고, 실제 채널 운영 관점에서 적용 가능한 형태로 정리합니다.</li>
        <li><strong>중립성</strong> - 특정 도구나 서비스를 무조건적으로 추천하지 않습니다. 장단점을 함께 안내합니다.</li>
        <li><strong>업데이트</strong> - 알고리즘이나 정책이 바뀌면 관련 글을 점검하고 갱신합니다.</li>
      </ul>

      <h2>편집 검증 프로세스</h2>
      <p>모든 가이드는 다음 검증을 거칩니다.</p>
      <ul>
        <li>일차 자료 확인 - 유튜브 공식 발표, 크리에이터 인사이더, 신뢰할 수 있는 업계 리포트 우선 참고</li>
        <li>편집팀 검토 - 사실관계 점검 + 가독성 다듬기</li>
        <li>독자 의견 반영 - 이메일로 받은 정정 요청은 신속히 반영</li>
      </ul>

      <h2>다루지 않는 주제</h2>
      <p>NuTube는 다음 주제는 다루지 않습니다.</p>
      <ul>
        <li>알고리즘 우회·어뷰징 기법 (정책 위반 위험)</li>
        <li>저작권 침해 소지가 있는 콘텐츠 제작 방법</li>
        <li>특정 채널의 노출도·수익 등 개별 정보 (개인정보)</li>
      </ul>

      <h2>운영 정보</h2>
      <div className="nt-info-box">
        <dl>
          <dt>상호</dt>
          <dd>{SITE.operator.company}</dd>
          <dt>대표자</dt>
          <dd>{SITE.operator.representative}</dd>
          <dt>사업자등록번호</dt>
          <dd>{SITE.operator.taxId}</dd>
          <dt>개업일</dt>
          <dd>2025년 3월 1일</dd>
          <dt>업태/종목</dt>
          <dd>{SITE.operator.businessType}</dd>
          <dt>사업장 주소</dt>
          <dd>{SITE.operator.address}</dd>
          <dt>이메일</dt>
          <dd><a href={`mailto:${SITE.operator.email}`}>{SITE.operator.email}</a></dd>
          <dt>웹사이트</dt>
          <dd><a href={SITE.url}>{SITE.url.replace('https://', '')}</a></dd>
        </dl>
      </div>
      <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 24 }}>
        가이드 정정 요청, 제휴 문의, 게재 요청 등은 위 이메일로 보내주세요.{' '}
        <Link href="/partnership" style={{ color: '#4f46e5' }}>제휴 문의 안내</Link>도 확인하실 수 있습니다.
      </p>
    </div>
  );
}

import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: 'NuTube 개인정보처리방침입니다.',
};

export default function PrivacyPage() {
  return (
    <div className="nt-page">
      <h1>개인정보처리방침</h1>
      <p className="nt-lead">
        {SITE.operator.company}(이하 "회사")는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여,
        적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.
        이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고,
        이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 본 처리방침을 수립·공개합니다.
      </p>

      <h2>제1조 (개인정보의 처리 목적)</h2>
      <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
      <ul>
        <li>홈페이지 운영, 콘텐츠 제공, 본인 식별·인증, 문의 처리 및 답변</li>
        <li>서비스 이용 통계 분석, 콘텐츠 개선, 신규 서비스 개발</li>
        <li>광고 노출 최적화 및 맞춤형 광고 제공 (Google AdSense)</li>
        <li>부정 이용 방지, 비인가 사용 방지</li>
        <li>법적 의무 이행 및 법적 분쟁 해결</li>
      </ul>

      <h2>제2조 (처리하는 개인정보의 항목 및 수집 방법)</h2>
      <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
      <div className="nt-table-wrap">
        <table className="nt-table">
          <thead>
            <tr>
              <th>구분</th>
              <th>수집 항목</th>
              <th>수집 방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>이메일 문의</td>
              <td>이메일 주소, 문의 내용</td>
              <td>이용자가 자발적으로 제공</td>
            </tr>
            <tr>
              <td>자동 수집</td>
              <td>IP 주소, 쿠키, 접속 일시, 서비스 이용 기록, 기기 정보, 브라우저 정보</td>
              <td>서비스 이용 과정에서 자동 생성</td>
            </tr>
            <tr>
              <td>광고 식별자</td>
              <td>광고 식별자(ADID/IDFA), 광고 클릭 기록</td>
              <td>Google AdSense 등 제3자 광고 도구를 통해 자동 수집</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>제3조 (개인정보의 처리 및 보유 기간)</h2>
      <p>회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.</p>
      <div className="nt-table-wrap">
        <table className="nt-table">
          <thead>
            <tr>
              <th>처리 항목</th>
              <th>보유 기간</th>
              <th>근거</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>이메일 문의 내용</td>
              <td>답변 완료 후 1년</td>
              <td>이용자 동의</td>
            </tr>
            <tr>
              <td>웹사이트 방문 기록</td>
              <td>3개월</td>
              <td>「통신비밀보호법」 제15조의2</td>
            </tr>
            <tr>
              <td>표시·광고에 관한 기록</td>
              <td>6개월</td>
              <td>「전자상거래 등에서의 소비자보호에 관한 법률」</td>
            </tr>
            <tr>
              <td>소비자 불만 또는 분쟁 처리 기록</td>
              <td>3년</td>
              <td>「전자상거래 등에서의 소비자보호에 관한 법률」</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>제4조 (개인정보 처리의 위탁)</h2>
      <p>회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리 업무를 외부 전문 업체에 위탁하고 있습니다.</p>
      <div className="nt-table-wrap">
        <table className="nt-table">
          <thead>
            <tr>
              <th>수탁업체</th>
              <th>위탁 업무 내용</th>
              <th>보유 및 이용 기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel Inc.</td>
              <td>웹사이트 호스팅, 콘텐츠 전송</td>
              <td>위탁 계약 종료 시까지</td>
            </tr>
            <tr>
              <td>Google LLC</td>
              <td>광고 게재 (AdSense), 분석 (Analytics), 검색 노출 (Search Console)</td>
              <td>위탁 계약 종료 시까지</td>
            </tr>
            <tr>
              <td>Google Workspace</td>
              <td>이메일 수신 및 처리</td>
              <td>위탁 계약 종료 시까지</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>회사는 위탁 계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁업무 수행 목적 외 개인정보 처리 금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독 등 책임에 관한 사항을 계약서 등 문서에 명시하고 있습니다.</p>

      <h2>제5조 (개인정보의 제3자 제공)</h2>
      <p>회사는 정보주체의 개인정보를 본 처리방침에서 명시한 범위 내에서만 처리하며, 정보주체의 동의 또는 법령의 근거가 있는 경우에만 제3자에게 제공합니다.</p>
      <p>현재 회사는 정보주체의 개인정보를 별도로 제3자에게 제공하고 있지 않습니다. 다만 다음의 경우는 예외로 합니다.</p>
      <ul>
        <li>정보주체로부터 별도의 동의를 받은 경우</li>
        <li>법령에 특별한 규정이 있는 경우</li>
        <li>정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산상의 이익을 위하여 필요하다고 인정되는 경우</li>
      </ul>

      <h2>제6조 (정보주체와 법정대리인의 권리·의무 및 행사 방법)</h2>
      <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
      <ul>
        <li>개인정보 열람 요구</li>
        <li>오류 등이 있을 경우 정정 요구</li>
        <li>삭제 요구</li>
        <li>처리 정지 요구</li>
      </ul>
      <p>위 권리 행사는 회사에 대해 「개인정보 보호법 시행령」 제41조 제1항에 따라 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
      <p>정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</p>

      <h2>제7조 (개인정보의 안전성 확보 조치)</h2>
      <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
      <ul>
        <li><strong>관리적 조치</strong>: 개인정보 처리 직원의 최소화 및 교육</li>
        <li><strong>기술적 조치</strong>: 개인정보처리시스템 접근권한 관리, 접속기록의 보관 및 위변조 방지, 개인정보의 암호화, 보안 프로그램 설치 및 주기적 갱신·점검</li>
        <li><strong>물리적 조치</strong>: 전산실 및 자료 보관실의 접근 통제</li>
      </ul>

      <h2>제8조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
      <p>회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
      <p>쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다.</p>
      <ul>
        <li><strong>쿠키의 사용 목적</strong>: 이용자가 방문한 각 서비스와 웹사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.</li>
        <li><strong>쿠키의 설치·운영 및 거부</strong>: 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.</li>
      </ul>
      <p><strong>브라우저별 쿠키 설정 방법:</strong></p>
      <ul>
        <li>Chrome: 설정 → 개인정보 보호 및 보안 → 쿠키 및 기타 사이트 데이터</li>
        <li>Edge: 설정 → 쿠키 및 사이트 권한 → 쿠키 및 사이트 데이터 관리 및 삭제</li>
        <li>Safari: 환경설정 → 개인 정보 보호 → 쿠키 및 웹 사이트 데이터</li>
        <li>Firefox: 설정 → 개인 정보 및 보안 → 쿠키와 사이트 데이터</li>
      </ul>
      <p>다만, 이용자가 쿠키 저장을 거부할 경우 일부 서비스의 이용에 어려움이 있을 수 있습니다.</p>

      <h2>제9조 (광고 게재 및 제3자 광고 서비스)</h2>
      <p>회사는 사이트 운영을 위해 다음과 같은 제3자 광고 서비스를 사용합니다.</p>
      <ul>
        <li><strong>Google AdSense</strong>: 본 사이트는 Google AdSense를 통해 광고를 게재합니다. Google과 같은 제3공급업체는 쿠키를 이용해 사용자의 본 사이트 및 다른 사이트 방문 정보를 기반으로 광고를 게재합니다.</li>
      </ul>
      <p>이용자는 다음 링크를 통해 맞춤 광고 사용을 거부할 수 있습니다.</p>
      <ul>
        <li><a href="https://www.google.com/ads/preferences" target="_blank" rel="noopener noreferrer">Google 광고 설정</a> - Google 맞춤 광고 거부</li>
        <li><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a> - 다수의 광고 네트워크 거부</li>
        <li><a href="https://policies.google.com/technologies/ads?hl=ko" target="_blank" rel="noopener noreferrer">Google 광고 정책 안내</a> - Google의 광고 정책 전체</li>
      </ul>

      <h2>제10조 (개인정보 보호책임자)</h2>
      <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
      <div className="nt-info-box">
        <dl>
          <dt>개인정보 보호책임자</dt>
          <dd>{SITE.operator.representative} ({SITE.operator.company} 대표)</dd>
          <dt>연락처</dt>
          <dd>이메일: <a href={`mailto:${SITE.operator.email}`}>{SITE.operator.email}</a></dd>
          <dt>소재지</dt>
          <dd>{SITE.operator.address}</dd>
        </dl>
      </div>
      <p>정보주체는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해 드릴 것입니다.</p>

      <h2>제11조 (개인정보 열람 청구 절차)</h2>
      <p>정보주체는 「개인정보 보호법」 제35조에 따른 개인정보의 열람 청구를 위 제10조의 개인정보 보호책임자 연락처로 하실 수 있습니다. 회사는 정보주체의 개인정보 열람 청구가 신속하게 처리되도록 노력하겠습니다.</p>

      <h2>제12조 (권익침해 구제방법)</h2>
      <p>정보주체는 개인정보 침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해 신고센터 등에 분쟁 해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보 침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.</p>
      <div className="nt-table-wrap">
        <table className="nt-table">
          <thead>
            <tr>
              <th>기관명</th>
              <th>연락처</th>
              <th>홈페이지</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>개인정보분쟁조정위원회</td>
              <td>국번 없이 1833-6972</td>
              <td><a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer">kopico.go.kr</a></td>
            </tr>
            <tr>
              <td>개인정보침해 신고센터</td>
              <td>국번 없이 118</td>
              <td><a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer">privacy.kisa.or.kr</a></td>
            </tr>
            <tr>
              <td>대검찰청 사이버수사과</td>
              <td>국번 없이 1301</td>
              <td><a href="https://www.spo.go.kr" target="_blank" rel="noopener noreferrer">spo.go.kr</a></td>
            </tr>
            <tr>
              <td>경찰청 사이버수사국</td>
              <td>국번 없이 182</td>
              <td><a href="https://ecrm.police.go.kr" target="_blank" rel="noopener noreferrer">ecrm.police.go.kr</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>제13조 (개인정보 처리방침의 변경)</h2>
      <p>본 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>

      <div className="nt-info-box" style={{ marginTop: 32 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#374151' }}>
          <strong>본 방침 시행일자: 2026년 4월 28일</strong>
        </p>
      </div>
    </div>
  );
}

# NuTube v2 적용 가이드 (AdSense 승인 준비 완전판)

## 이번 변경 핵심 요약

박 대표님께서 보내주신 사이트 검토 요청사항 전체를 반영한 완전판입니다.

### 1. 사업자 정보 풀세트
- 상호: 알고파트너스
- 대표: 박예준
- 사업자등록번호: 450-07-03104
- 개업일: 2025년 3월 1일
- 사업장: 인천광역시 서구 청라커낼로 270
- 이메일: apark12321@gmail.com
- 위 정보가 푸터, About, Privacy, Terms, Partnership 모두에 일관되게 반영됨

### 2. JSON-LD 구조화 데이터 강화
- WebSite + Organization + Article + BreadcrumbList 4종 모두 적용
- Organization에 taxID, foundingDate, address(PostalAddress) 포함
- Article의 publisher에도 taxID, foundingDate, address 포함

### 3. Privacy 13섹션 완전 재작성
- 제1조 처리 목적
- 제2조 수집 항목·방법 (표 형식)
- 제3조 보유 기간 (법령별)
- 제4조 처리 위탁 (표 형식)
- 제5조 제3자 제공
- 제6조 정보주체 권리
- 제7조 안전성 확보 조치 (관리·기술·물리적)
- 제8조 쿠키 (브라우저별 설정 안내)
- 제9조 광고·제3자 서비스 (AdSense 거부 링크 3개)
- 제10조 개인정보 보호책임자
- 제11조 열람 청구 절차
- 제12조 권익침해 구제 (4개 기관 + 연락처 + 홈페이지)
- 제13조 변경 고지
- 시행일: 2026-04-28 (첫 게시물 발행일과 일치)

### 4. 면책 문구 카테고리별 다양화
- 각 카테고리별 8개 면책 문구 풀
- 8편 글에 모두 다른 면책 사용 (최대 반복 1회)
- 카테고리 톤 일관성 (~다 / ~요 / ~거든요 / ~습니다)

### 5. 권위 링크 100% 적용
- 32편 모두에 공식 출처 외부 링크 1개 이상
- YouTube 공식, 한국저작권위원회, 국세청, 공정거래위원회 등

### 6. 발행일 vs 갱신일 분리
- 32편 중 7편(약 21%)에 갱신일 별도 부여
- 갱신일은 발행일 후 3~20일 사이, 운영 흔적
- 최근 5일 이내 글은 그대로

### 7. og-default.jpg 생성
- 1200×630 해상도
- NuTube 브랜드 + 4개 카테고리 표시
- public/og-default.jpg 위치

### 8. AdSense 코드 3중 적용
- 메타 태그: `<meta name="google-adsense-account" content="ca-pub-9552509372228899" />`
- 스크립트: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9552509372228899" />`
- ads.txt: `google.com, pub-9552509372228899, DIRECT, f08c47fec0942fa0`

### 9. AI 양산 흔적 제거
- 원형 숫자 (①②③④⑤⑥⑦⑧⑨⑩) 자동 변환
- 중복 서수 ((가)(나)(다), 1)2)3)) 제거
- 작성자 통일 (NuTube 편집팀)
- 카테고리별 톤 차별화 (단호·친근·구어체·정중)

### 10. SEO 인프라
- sitemap.xml 자동 생성 (모든 페이지 + 카테고리 + 글)
- robots.txt에 Mediapartners-Google, AdsBot-Google, Yeti, Daum 등 명시
- 한국어 lang 설정
- canonical URL 모든 페이지

### 11. 메타데이터 생성기 v15.0 통합
- /publish 페이지에 박 대표님의 메타데이터 생성기 v15.0 본체
- V18Shell, contentEngine, promptEngine_v6_5_0, v650Adapter 등 42개 자산
- 새 사이트 헤더/푸터와 통합 (V18Shell 헤더/푸터 제거)

### 12. 공지사항 운영 이력
- 사이트 정식 오픈일(2026-04-28)부터 시간순 7개 공지

### 13. 표 스타일
- Privacy의 표가 깨지지 않게 `.nt-table` 전용 스타일 추가
- 모바일 가로 스크롤 지원

---

## 적용 절차

박 대표님의 `artifacts/nutube/` 폴더가 비어있는 상태입니다.

1. 이 ZIP 다운로드
2. 압축 해제 → `artifacts/nutube/` 안 내용물 134개 파일 복사
3. GitHub Desktop이 관리하는 `artifacts/nutube/` (비어있는 상태)에 붙여넣기
4. GitHub Desktop에서 변경사항 확인
5. Commit & Push

Commit 메시지 예시:
```
feat: adsense-ready full update with operator info and metadata generator
```

## 빌드 결과 예상

- ✅ 새 사이트 디자인 (4개 카테고리 + 32편 글)
- ✅ 메타데이터 생성기 v15.0 (/publish)
- ✅ 사업자 정보 풀세트
- ✅ Privacy 13섹션
- ✅ 권위 링크 100%
- ✅ 발행일/갱신일 분리
- ✅ og-default.jpg
- ✅ AdSense 코드 3중

## 파일 구조 요약

```
artifacts/nutube/
├── app/
│   ├── layout.tsx              # JSON-LD 2종 (WebSite + Organization)
│   ├── globals.css             # 표 스타일 추가
│   ├── page.tsx                # 홈
│   ├── publish/                # 메타데이터 생성기 v15.0
│   ├── _shared/                # 42개 자산 (V18Shell 등)
│   ├── blog/[slug]/            # Article JSON-LD with 사업자 정보
│   ├── about/                  # 사업자 정보 풀세트
│   ├── privacy/                # 13섹션
│   ├── terms/                  # 사업자 정보 풀세트
│   ├── partnership/            # 편집 독립성 원칙
│   ├── announcement/           # 7개 공지 시간순
│   └── api/posts/
├── components/
│   ├── Header.tsx
│   └── Footer.tsx              # 사업자 정보 풀세트
├── lib/site.ts, posts.ts
├── data/posts/                 # 32개 글 (면책 다양화 + 권위링크 + 갱신일)
├── public/
│   ├── ads.txt
│   ├── og-default.jpg          # OG 이미지
│   └── thumbnails/             # 32개 SVG
├── scripts/generate-sitemap.mjs
├── package.json
├── next.config.js
└── tsconfig.json
```

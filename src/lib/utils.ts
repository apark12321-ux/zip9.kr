import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateReadTime(content: string): string {
  const charactersPerMinute = 500;
  // Remove HTML tags if any (basic check)
  const plainText = content.replace(/<[^>]*>/g, "");
  const minutes = Math.ceil(plainText.length / charactersPerMinute);
  return `${minutes}분`;
}

/**
 * 제목을 URL 친화적 slug로 변환.
 * - 영문/한글/숫자/하이픈만 남김 (한글 그대로 유지)
 * - 공백 → 하이픈
 * - 특수문자 제거
 * - 연속 하이픈 정리
 * - 최대 80자 (너무 긴 URL 방지)
 */
export function slugify(title: string): string {
  if (!title) return "";
  return title
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\uAC00-\uD7A3\-]/g, "") // 영숫자, 한글, 하이픈만
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 25)
    .replace(/-+$/g, ""); // slice 후 끝에 하이픈 남으면 제거
}

/**
 * HTML 태그를 제거하고 일반 텍스트만 반환.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * 본문 콘텐츠에서 렌더링되지 않는 마크다운 잔재를 정리한다.
 * dangerouslySetInnerHTML로 HTML을 직접 삽입하기 때문에,
 * 글에 실수로 들어간 마크다운 문법(예: **굵게**)이 그대로 화면에 노출될 위험이 있다.
 * 이 함수는 그런 패턴들을 안전한 HTML로 자동 변환한다.
 *
 * 처리 대상:
 *  - **굵게** → <strong>굵게</strong>
 *  - *기울임* → <em>기울임</em>  (단, **와 충돌하지 않게 처리)
 *  - __굵게__ → <strong>굵게</strong>
 *  - _기울임_ → <em>기울임</em>
 *  - 짝이 안 맞는 잔여 ** 또는 __ → 제거
 */
export function sanitizeContent(content: string): string {
  if (!content) return "";

  let html = content;

  // 1단계: HTML 태그 안의 속성값은 보호 (예: <a href="**something**">)
  // 태그 안의 ** 패턴은 매우 드물지만 안전을 위해 처리
  // 실제로는 본문 텍스트 영역의 ** 패턴만 잡으면 됨

  // 2단계: **굵게** → <strong>굵게</strong>
  // 같은 줄에 짝이 맞는 경우만 변환 (안전성을 위해 줄바꿈 횡단 금지)
  html = html.replace(/\*\*([^\*\n]+?)\*\*/g, "<strong>$1</strong>");

  // 3단계: __굵게__ → <strong>굵게</strong>
  html = html.replace(/__([^_\n]+?)__/g, "<strong>$1</strong>");

  // 4단계: *기울임* → <em>기울임</em>
  // 단일 별표는 잘못 매칭될 수 있으니 앞뒤가 공백/문장부호인 경우만
  html = html.replace(/(?:^|[\s\(])\*([^\*\n]+?)\*(?=[\s\.,;:\)\!\?]|$)/g, (match, text) => {
    // 매칭의 첫 문자(공백/괄호)는 유지하고 별표 부분만 em으로 변환
    const prefix = match.charAt(0) === "*" ? "" : match.charAt(0);
    return `${prefix}<em>${text}</em>`;
  });

  // 5단계: _기울임_ → <em>기울임</em>
  html = html.replace(/(?:^|[\s\(])_([^_\n]+?)_(?=[\s\.,;:\)\!\?]|$)/g, (match, text) => {
    const prefix = match.charAt(0) === "_" ? "" : match.charAt(0);
    return `${prefix}<em>${text}</em>`;
  });

  // 6단계: 짝 안 맞는 잔여 ** 또는 __ 제거 (안전망)
  // 위에서 못 잡힌 패턴이 있다면 단순 제거
  html = html.replace(/\*\*/g, "");
  html = html.replace(/__/g, "");

  return html;
}


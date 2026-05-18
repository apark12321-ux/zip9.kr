/**
 * Video API Client (v6) - 시나리오 스타일 프롬프트 실제 반영
 * 
 * 핵심: scenarioStyleId에 따라 hook_triggers, opinion_seeds, core_facts를
 *       다르게 백엔드에 전달하여 실제 대본 스타일이 달라지게 함
 */

import { getScenarioById, generateScenarioPrompts } from './scenarios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://project-blackbox-production.up.railway.app';

// ============================================================
// Types
// ============================================================
export interface GenerateRealRequest {
  keyword: string;
  tone?: 'formal' | 'friendly' | 'casual' | 'slang';
  duration?: number;
  mode?: 'normal' | 'senior';
  custom_topic?: string;
  category?: string;
  channel_name?: string;
  scenarioStyleId?: string;   // NEW: 시나리오 스타일 ID
}

export interface GenerateRealResponse {
  job_id: string;
  status?: string;
  download_url?: string;
  [key: string]: any;
}

export interface JobStatusResponse {
  job_id?: string;
  status: string;
  progress?: number;
  current_step?: string;
  logs?: string[];
  message?: string;
  error?: string;
  download_url?: string;
  result?: any;
  [key: string]: any;
}

export interface DownloadResponse {
  download_url?: string;
  video_url?: string;
  url?: string;
  [key: string]: any;
}

export interface ApiError {
  status: number;
  message: string;
  body?: any;
}

function stringifyFastApiError(detail: any): string {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => {
      if (typeof item === 'string') return item;
      const loc = Array.isArray(item.loc) ? item.loc.join('.') : (item.loc || '');
      const msg = item.msg || item.message || JSON.stringify(item);
      return loc ? `${loc}: ${msg}` : msg;
    }).join(' | ');
  }
  if (typeof detail === 'object') {
    try { return JSON.stringify(detail); } catch { return String(detail); }
  }
  return String(detail);
}

async function apiCall<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: any,
  timeoutMs: number = 60000
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timer);

    const text = await res.text();
    let parsed: any = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = { raw: text };
    }

    if (!res.ok) {
      let msg = '';
      if (parsed?.detail) msg = stringifyFastApiError(parsed.detail);
      else if (parsed?.message) msg = typeof parsed.message === 'string' ? parsed.message : stringifyFastApiError(parsed.message);
      else msg = `HTTP ${res.status}`;
      throw { status: res.status, message: msg, body: parsed } as ApiError;
    }

    return parsed as T;
  } catch (e: any) {
    clearTimeout(timer);
    if (e?.name === 'AbortError') {
      throw { status: 0, message: '요청 시간 초과', body: null } as ApiError;
    }
    if (e?.status !== undefined) throw e;
    throw { status: 0, message: String(e?.message || '네트워크 오류'), body: null } as ApiError;
  }
}

// ============================================================
// Step 0: 뉴스 검색
// ============================================================
async function searchNewsAndSummarize(keyword: string): Promise<string> {
  const body = { keyword, days_back: 7, max_results: 10 };
  const res = await apiCall<any>('POST', '/api/v1/curation/news/search', body, 30000);
  const articles: any[] = Array.isArray(res?.articles) ? res.articles : [];
  if (articles.length === 0) {
    return `"${keyword}" 관련 최근 뉴스가 없어, 일반 상식 기반으로 제작합니다.`;
  }
  return articles.slice(0, 5).map((a, i) => {
    const title = a.title || '';
    const src = a.source_name || '';
    const desc = a.summary || '';
    const prefix = `${i + 1}. [${src}] ${title}`;
    return desc ? `${prefix}\n   ${String(desc).slice(0, 300)}` : prefix;
  }).join('\n\n');
}

// ============================================================
// Step 1: 대본 생성 (스타일 프롬프트 주입!)
// ============================================================
async function generateScript(
  req: GenerateRealRequest,
  newsSummary: string
): Promise<any> {
  // ⭐ v2: 시나리오 + 키워드로 매번 다른 무한 변형 프롬프트 생성
  const style = getScenarioById(req.scenarioStyleId);
  const prompts = generateScenarioPrompts(style, req.keyword);

  const body = {
    keyword: req.keyword,
    category: req.category || 'economy',
    news_summary: newsSummary,
    // ⭐ 매 호출마다 새로 생성된 프롬프트 (시나리오 톤 유지 + 무한 변형)
    core_facts: prompts.core_facts,
    opinion_seeds: prompts.opinion_seeds,
    hook_triggers: prompts.hook_triggers,
    target_duration_sec: (req.duration || 10) * 60,
  };

  return apiCall<any>('POST', '/api/v1/script/generate', body, 120000);
}

function extractScriptBlocks(scriptRes: any): any[] | null {
  if (!scriptRes) return null;
  if (Array.isArray(scriptRes.blocks) && scriptRes.blocks.length > 0) {
    return scriptRes.blocks;
  }
  return null;
}

// ============================================================
// Step 2: 영상 생성
// ============================================================
async function generateVideoWithScript(
  scriptBlocks: any[],
  req: GenerateRealRequest
): Promise<GenerateRealResponse> {
  const body = {
    keyword: req.keyword,
    category: req.category || 'economy',
    mode: req.mode || 'normal',
    script_blocks: scriptBlocks,
    channel_name: req.channel_name || '',
    watermark_text: '',
    tts_voice_id: '',
  };
  return apiCall<GenerateRealResponse>('POST', '/api/v1/video/generate-real', body, 60000);
}

// ============================================================
// Public: 3-step orchestration
// ============================================================
export async function startVideoGeneration(
  req: GenerateRealRequest,
  onProgress?: (step: string) => void
): Promise<GenerateRealResponse> {
  const style = getScenarioById(req.scenarioStyleId);

  // Step 0
  onProgress?.('📰 관련 뉴스 수집 중... (10~20초)');
  let newsSummary: string;
  try {
    newsSummary = await searchNewsAndSummarize(req.keyword);
  } catch (err: any) {
    console.warn('[video] news search failed, using fallback:', err);
    newsSummary = `"${req.keyword}" 주제에 대한 일반 상식 기반 영상입니다.`;
  }

  // Step 1
  const styleMsg = style ? `✍️ ${style.name} 스타일로 대본 작성 중... (1~2분)` : '✍️ AI 대본 작성 중... (1~2분)';
  onProgress?.(styleMsg);
  const scriptRes = await generateScript(req, newsSummary);

  const scriptBlocks = extractScriptBlocks(scriptRes);
  if (!scriptBlocks) {
    throw {
      status: 500,
      message: `대본 응답에서 blocks를 찾을 수 없습니다.`,
      body: scriptRes,
    } as ApiError;
  }

  // Step 2
  onProgress?.('🎬 영상 생성 요청 중...');
  const videoRes = await generateVideoWithScript(scriptBlocks, req);

  const jobId = videoRes.job_id;
  if (!jobId) {
    throw {
      status: 500,
      message: `job_id를 찾을 수 없음`,
      body: videoRes,
    } as ApiError;
  }

  return { ...videoRes, job_id: jobId };
}

// ============================================================
// Status / Download
// ============================================================
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return apiCall<JobStatusResponse>('GET', `/api/v1/video/status/${encodeURIComponent(jobId)}`, undefined, 15000);
}

export async function getDownloadUrl(jobId: string): Promise<DownloadResponse> {
  return apiCall<DownloadResponse>('GET', `/api/v1/video/download/${encodeURIComponent(jobId)}`, undefined, 15000);
}

export function extractVideoUrl(
  statusRes?: JobStatusResponse | null,
  downloadRes?: DownloadResponse | null,
  startRes?: GenerateRealResponse | null
): string | null {
  const candidates: (string | undefined)[] = [
    statusRes?.download_url,
    statusRes?.result?.download_url,
    statusRes?.result?.video_url,
    (statusRes as any)?.video_url,
    downloadRes?.download_url,
    downloadRes?.video_url,
    downloadRes?.url,
    startRes?.download_url,
    (startRes as any)?.video_url,
  ];
  for (const c of candidates) {
    if (c && typeof c === 'string' && c.length > 0) {
      if (c.startsWith('http')) return c;
      return `${API_BASE}${c.startsWith('/') ? '' : '/'}${c}`;
    }
  }
  return null;
}

export function formatApiError(err: any): string {
  if (!err) return '알 수 없는 오류';
  if (typeof err === 'string') return err;
  if (err.status !== undefined) {
    if (err.status === 0) return `네트워크 오류: ${err.message || ''}`.trim();
    if (err.status === 404) return '요청한 리소스를 찾을 수 없습니다';
    if (err.status === 402) return '크레딧이 부족합니다';
    if (err.status === 422) return `요청 형식이 맞지 않습니다: ${err.message || ''}`;
    if (err.status === 500) return `서버 오류: ${err.message || 'Internal Server Error'}`;
    return `오류 (${err.status}): ${err.message || ''}`;
  }
  if (err.message) return String(err.message);
  try { return JSON.stringify(err); } catch { return String(err); }
}

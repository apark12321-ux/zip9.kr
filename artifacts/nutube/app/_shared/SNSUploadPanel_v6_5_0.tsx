'use client';

// ============================================================
// NuTube v6.5.0 - SNS Platform UI Components
// 각 플랫폼 실제 업로드 페이지를 그대로 재현
// ============================================================

import React, { useState } from 'react';
import type { 
  SNSFormatPackage,
  YouTubeFormat,
  ShortsFormat, 
  InstagramFormat,
  TikTokFormat
} from './snsFormatGenerator_v6_5_0';

// ============================================================
// 메인: 4개 플랫폼 탭 컨테이너
// ============================================================
interface SNSUploadPanelProps {
  formats: SNSFormatPackage;
}

export function SNSUploadPanel({ formats }: SNSUploadPanelProps) {
  const [activeTab, setActiveTab] = useState<'youtube' | 'shorts' | 'instagram' | 'tiktok'>('youtube');
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* 플랫폼 탭 */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <TabButton
          active={activeTab === 'youtube'}
          onClick={() => setActiveTab('youtube')}
          color="red"
          icon="📺"
          label="YouTube"
          subtitle="긴 영상"
        />
        <TabButton
          active={activeTab === 'shorts'}
          onClick={() => setActiveTab('shorts')}
          color="red"
          icon="🩳"
          label="Shorts"
          subtitle="60초"
        />
        <TabButton
          active={activeTab === 'instagram'}
          onClick={() => setActiveTab('instagram')}
          color="pink"
          icon="📸"
          label="Instagram"
          subtitle="Reels"
        />
        <TabButton
          active={activeTab === 'tiktok'}
          onClick={() => setActiveTab('tiktok')}
          color="black"
          icon="🎵"
          label="TikTok"
          subtitle="For You"
        />
      </div>
      
      {/* 플랫폼별 UI */}
      <div className="p-4 sm:p-6">
        {activeTab === 'youtube' && <YouTubeUploadUI data={formats.youtube} />}
        {activeTab === 'shorts' && <ShortsUploadUI data={formats.shorts} />}
        {activeTab === 'instagram' && <InstagramUploadUI data={formats.instagram} />}
        {activeTab === 'tiktok' && <TikTokUploadUI data={formats.tiktok} />}
      </div>
    </div>
  );
}

// ============================================================
// 탭 버튼
// ============================================================
function TabButton({ active, onClick, color, icon, label, subtitle }: {
  active: boolean;
  onClick: () => void;
  color: string;
  icon: string;
  label: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-2 sm:px-4 transition-all border-b-2 ${
        active 
          ? 'border-blue-500 bg-white' 
          : 'border-transparent hover:bg-gray-100'
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`font-bold text-sm ${active ? 'text-gray-900' : 'text-gray-600'}`}>
        {label}
      </div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </button>
  );
}

// ============================================================
// YouTube 업로드 UI (실제 Studio 페이지 재현)
// ============================================================
function YouTubeUploadUI({ data }: { data: YouTubeFormat }) {
  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">▶</div>
        <div>
          <div className="font-bold text-gray-900">YouTube Studio - 세부 정보</div>
          <div className="text-xs text-gray-500">실제 업로드 페이지와 동일한 형식</div>
        </div>
      </div>
      
      {/* 제목 */}
      <FieldBlock 
        label="제목 (필수)"
        sublabel="시청자에게 동영상 콘텐츠를 알릴 수 있는 제목을 추가하세요"
      >
        <div className="border border-gray-300 rounded-lg p-3 bg-white relative">
          <div className="text-gray-900 break-keep">{data.title}</div>
          <div className="absolute right-3 bottom-2 text-xs text-gray-400">
            {data.titleCharCount}/100
          </div>
        </div>
        <CopyButton text={data.title} />
      </FieldBlock>
      
      {/* 설명 */}
      <FieldBlock 
        label="설명"
        sublabel="시청자에게 동영상에 대해 설명해 주세요"
      >
        <div className="border border-gray-300 rounded-lg p-3 bg-white relative max-h-72 overflow-y-auto">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans break-keep">{data.description}</pre>
          <div className="sticky bottom-0 right-0 text-xs text-gray-400 text-right bg-white pt-1">
            {data.descriptionCharCount}/5000
          </div>
        </div>
        <CopyButton text={data.description} />
      </FieldBlock>
      
      {/* 썸네일 */}
      <FieldBlock 
        label="썸네일"
        sublabel="시청자의 관심을 사로잡을 수 있는 이미지를 선택하거나 업로드하세요"
      >
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-blue-50">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">💡</span>
            <div className="text-sm text-gray-700 break-keep">{data.thumbnailGuide}</div>
          </div>
        </div>
      </FieldBlock>
      
      {/* 태그 */}
      <FieldBlock 
        label="태그"
        sublabel="동영상 콘텐츠에 흔히 잘못 쓰이는 단어가 있을 경우 태그가 유용합니다"
      >
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-right">
            {data.tagsCharCount}/500
          </div>
        </div>
        <CopyButton text={data.tags.join(", ")} />
      </FieldBlock>
      
      {/* 카테고리 */}
      <FieldBlock label="카테고리" sublabel="시청자가 더 쉽게 콘텐츠를 찾을 수 있도록 카테고리를 추가하세요">
        <div className="border border-gray-300 rounded-lg p-3 bg-white text-gray-900">
          {data.category}
        </div>
      </FieldBlock>
      
      {/* 챕터 */}
      <FieldBlock label="챕터 (자동 생성)" sublabel="시청자가 원하는 부분으로 바로 이동할 수 있어요">
        <div className="border border-gray-300 rounded-lg p-3 bg-white space-y-1">
          {data.chapters.map((ch, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="font-mono text-blue-600 font-bold">{ch.time}</span>
              <span className="text-gray-700">{ch.label}</span>
            </div>
          ))}
        </div>
      </FieldBlock>
      
      {/* 최종화면 */}
      <FieldBlock label="최종화면 + 카드 추천" sublabel="알고리즘 우호적인 배치">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
          <div className="text-sm text-gray-800 break-keep">
            <span className="font-bold">📍 최종화면:</span> {data.endScreenSuggestion}
          </div>
          <div className="text-sm text-gray-800 break-keep">
            <span className="font-bold">📍 카드:</span> {data.cardSuggestion}
          </div>
        </div>
      </FieldBlock>
      
      {/* 공개 설정 */}
      <FieldBlock label="공개 상태">
        <div className="flex gap-3">
          <RadioOption checked={true} label="공개" sublabel="모든 사용자가 동영상을 볼 수 있습니다" />
        </div>
      </FieldBlock>
    </div>
  );
}

// ============================================================
// Shorts 업로드 UI (모바일 세로 형식)
// ============================================================
function ShortsUploadUI({ data }: { data: ShortsFormat }) {
  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold">🩳</div>
        <div>
          <div className="font-bold text-gray-900">YouTube Shorts 업로드</div>
          <div className="text-xs text-gray-500">60초 이하 세로 영상 (9:16)</div>
        </div>
      </div>
      
      {/* 모바일 미리보기 + 입력 영역 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* 좌측: 모바일 미리보기 */}
        <div className="bg-black rounded-2xl p-3 mx-auto" style={{ maxWidth: '280px', aspectRatio: '9/19' }}>
          <div className="bg-gray-900 rounded-xl h-full flex flex-col justify-end p-4 relative overflow-hidden">
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
              <div className="text-white text-xs font-bold">Shorts</div>
              <div className="text-white text-xs">⋯</div>
            </div>
            <div className="text-white space-y-2">
              <div className="font-bold text-sm break-keep line-clamp-3">{data.title}</div>
              <div className="flex flex-wrap gap-1">
                {data.hashtags.slice(0, 5).map((h, i) => (
                  <span key={i} className="text-blue-300 text-xs">{h}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 우측: 입력 필드 */}
        <div className="space-y-4">
          <FieldBlock label="제목 (#Shorts 필수)">
            <div className="border border-gray-300 rounded-lg p-3 bg-white">
              <div className="text-sm text-gray-900 break-keep">{data.title}</div>
              <div className="text-xs text-gray-400 text-right mt-2">{data.titleCharCount}/100</div>
            </div>
            <CopyButton text={data.title} />
          </FieldBlock>
          
          <FieldBlock label="설명">
            <div className="border border-gray-300 rounded-lg p-3 bg-white">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans break-keep">{data.description}</pre>
            </div>
            <CopyButton text={data.description} />
          </FieldBlock>
        </div>
      </div>
      
      {/* 해시태그 */}
      <FieldBlock label="해시태그 (트렌드 + 니치 조합)">
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <div className="flex flex-wrap gap-2">
            {data.hashtags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <CopyButton text={data.hashtags.join(" ")} />
      </FieldBlock>
      
      {/* 옵션 */}
      <FieldBlock label="추가 설정">
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="text-sm text-gray-700 break-keep">
            <span className="font-bold">썸네일:</span> {data.thumbnailFrame}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-bold">리믹스 허용:</span> {data.remixAllow ? "✅ 허용" : "❌ 차단"} 
            <span className="text-xs text-gray-500 ml-2">(허용 시 도달 범위 ↑)</span>
          </div>
          <div className="text-sm text-gray-700 break-keep">
            <span className="font-bold">사운드:</span> {data.soundCredit}
          </div>
        </div>
      </FieldBlock>
    </div>
  );
}

// ============================================================
// Instagram Reels 업로드 UI
// ============================================================
function InstagramUploadUI({ data }: { data: InstagramFormat }) {
  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">📸</div>
        <div>
          <div className="font-bold text-gray-900">Instagram - 새 릴스</div>
          <div className="text-xs text-gray-500">9:16 세로 영상</div>
        </div>
      </div>
      
      {/* 캡션 */}
      <FieldBlock label="문구 작성" sublabel="첫 125자가 미리보기에 표시됩니다">
        <div className="border border-gray-300 rounded-lg p-3 bg-white max-h-72 overflow-y-auto">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans break-keep">{data.caption}</pre>
          <div className="text-xs text-gray-400 text-right mt-2 sticky bottom-0 bg-white">
            {data.captionCharCount}/2200
          </div>
        </div>
        <CopyButton text={data.caption} />
      </FieldBlock>
      
      {/* 해시태그 */}
      <FieldBlock label={`해시태그 (${data.hashtagsCount}/30)`} sublabel="첫 댓글에 추가하면 캡션이 깔끔합니다">
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <div className="flex flex-wrap gap-1.5">
            {data.hashtags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <CopyButton text={data.hashtags.join(" ")} />
      </FieldBlock>
      
      {/* 커버 */}
      <FieldBlock label="커버 선택" sublabel="피드 그리드에 보여질 이미지">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-pink-600">🎨</span>
            <div className="text-sm text-gray-800 break-keep">{data.coverFrame}</div>
          </div>
        </div>
      </FieldBlock>
      
      {/* 오디오 */}
      <FieldBlock label="오디오 추가" sublabel="트렌드 음원 사용 시 알고리즘 우호적">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-purple-600">🎵</span>
            <div className="text-sm text-gray-800 break-keep">{data.audioName}</div>
          </div>
        </div>
      </FieldBlock>
      
      {/* 추가 옵션 */}
      <FieldBlock label="추가 옵션">
        <div className="space-y-2">
          <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">위치 추가</div>
              <div className="text-xs text-gray-500">{data.location}</div>
            </div>
            <span className="text-pink-600">✓</span>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">피드에도 공유</div>
              <div className="text-xs text-gray-500">메인 피드에 표시 → 도달 범위 확장</div>
            </div>
            <span className={data.shareToFeed ? "text-pink-600" : "text-gray-400"}>
              {data.shareToFeed ? "✓" : "○"}
            </span>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">스토리에도 공유</div>
              <div className="text-xs text-gray-500">초기 24시간 노출 ↑</div>
            </div>
            <span className={data.shareToStory ? "text-pink-600" : "text-gray-400"}>
              {data.shareToStory ? "✓" : "○"}
            </span>
          </div>
        </div>
      </FieldBlock>
    </div>
  );
}

// ============================================================
// TikTok 업로드 UI
// ============================================================
function TikTokUploadUI({ data }: { data: TikTokFormat }) {
  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white font-bold">🎵</div>
        <div>
          <div className="font-bold text-gray-900">TikTok - 동영상 게시</div>
          <div className="text-xs text-gray-500">9:16 세로 / For You 페이지 최적화</div>
        </div>
      </div>
      
      {/* 캡션 */}
      <FieldBlock label="설명" sublabel="2200자 이내. 첫 줄이 가장 중요합니다">
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans break-keep">{data.caption}</pre>
          <div className="text-xs text-gray-400 text-right mt-2">
            {data.captionCharCount}/2200
          </div>
        </div>
        <CopyButton text={data.caption} />
      </FieldBlock>
      
      {/* 해시태그 */}
      <FieldBlock label={`해시태그 (${data.hashtagsCount}개)`} sublabel="#fyp 와 니치 태그 조합이 핵심">
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <div className="flex flex-wrap gap-1.5">
            {data.hashtags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-900 text-white rounded text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <CopyButton text={data.hashtags.join(" ")} />
      </FieldBlock>
      
      {/* 사운드 */}
      <FieldBlock label="사운드 추가" sublabel="For You 페이지 노출의 핵심 요소">
        <div className="bg-black text-white rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-pink-400">🎵</span>
            <div className="text-sm break-keep">{data.soundChoice}</div>
          </div>
        </div>
      </FieldBlock>
      
      {/* 커버 */}
      <FieldBlock label="커버 선택">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-gray-700">🖼️</span>
            <div className="text-sm text-gray-800 break-keep">{data.coverImage}</div>
          </div>
        </div>
      </FieldBlock>
      
      {/* 누가 볼 수 있는지 + 권한 */}
      <FieldBlock label="누가 볼 수 있나요">
        <div className="space-y-2">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-900">{data.whoCanWatch}</div>
            <div className="text-xs text-gray-500">For You 페이지 진입 가능</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <PermissionBox label="댓글" allowed={data.allowComments} />
            <PermissionBox label="듀엣" allowed={data.allowDuet} />
            <PermissionBox label="이어찍기" allowed={data.allowStitch} />
          </div>
        </div>
      </FieldBlock>
      
      {/* 발행 시간 */}
      <FieldBlock label="발행 시간 추천" sublabel="알고리즘이 가장 활성화되는 시간대">
        <div className="bg-gradient-to-r from-pink-50 to-cyan-50 border border-pink-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-pink-600">⏰</span>
            <div className="text-sm text-gray-800 break-keep">{data.scheduledTime}</div>
          </div>
        </div>
      </FieldBlock>
    </div>
  );
}

// ============================================================
// 공통 컴포넌트
// ============================================================
function FieldBlock({ label, sublabel, children }: {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div>
        <div className="font-bold text-gray-900 text-sm">{label}</div>
        {sublabel && <div className="text-xs text-gray-500 mt-0.5 break-keep">{sublabel}</div>}
      </div>
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      className={`text-sm px-3 py-1.5 rounded-md font-medium transition-all ${
        copied 
          ? 'bg-green-100 text-green-700' 
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
      }`}
    >
      {copied ? '✅ 복사됨' : '📋 복사'}
    </button>
  );
}

function RadioOption({ checked, label, sublabel }: { checked: boolean; label: string; sublabel?: string }) {
  return (
    <div className="flex items-start gap-2 border border-gray-200 rounded-lg p-3 flex-1">
      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-0.5" />}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {sublabel && <div className="text-xs text-gray-500 break-keep">{sublabel}</div>}
      </div>
    </div>
  );
}

function PermissionBox({ label, allowed }: { label: string; allowed: boolean }) {
  return (
    <div className={`border rounded-lg p-2 text-center text-xs ${
      allowed 
        ? 'border-green-300 bg-green-50 text-green-700' 
        : 'border-gray-200 bg-gray-50 text-gray-500'
    }`}>
      <div className="font-medium">{label}</div>
      <div className="text-xs mt-0.5">{allowed ? '허용' : '차단'}</div>
    </div>
  );
}

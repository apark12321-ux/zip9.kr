
import { useState, useMemo, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { PostCard } from "./components/PostCard";
import { MOCK_POSTS, CATEGORIES } from "./constants";
import { Post } from "./types";
import { ArrowRight, ChevronRight, Share2, Printer, Bookmark, LayoutDashboard, Settings, ShieldCheck } from "lucide-react";
import { Button } from "./components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { Badge } from "./components/ui/badge";
import { auth, db } from "./lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { calculateReadTime, slugify, stripHtml, sanitizeContent } from "./lib/utils";

type Page = "home" | "about" | "privacy" | "partnership" | "announcement" | "terms" | `category-${string}` | `post-${string}`;

const SITE_URL = "https://zip9.kr";
const SITE_NAME = "하우징허브";
const DEFAULT_TITLE = "하우징허브 - 대한민국 최고의 부동산 & 주거 정보 가이드";
const DEFAULT_DESCRIPTION = "청약 정보, 전월세 계약 팁, 담보대출 가이드 등 실용적인 주거 정보를 제공하는 하우징허브입니다.";

// URL → Page 상태
function pageFromUrl(): Page {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname;
  if (path === "/" || path === "") return "home";
  if (path === "/about") return "about";
  if (path === "/privacy") return "privacy";
  if (path === "/partnership") return "partnership";
  if (path === "/announcement") return "announcement";
  if (path === "/terms") return "terms";
  const catMatch = path.match(/^\/category\/(.+)$/);
  if (catMatch) return `category-${decodeURIComponent(catMatch[1])}` as Page;
  const postMatch = path.match(/^\/post\/(.+)$/);
  if (postMatch) return `post-${decodeURIComponent(postMatch[1])}` as Page;
  return "home";
}

// Page → URL 경로 (게시물은 slug 우선, fallback은 id)
function urlFromPage(page: Page, posts: Post[]): string {
  if (page === "home") return "/";
  if (page === "about") return "/about";
  if (page === "privacy") return "/privacy";
  if (page === "partnership") return "/partnership";
  if (page === "announcement") return "/announcement";
  if (page === "terms") return "/terms";
  if (page.startsWith("category-")) {
    return `/category/${encodeURIComponent(page.replace("category-", ""))}`;
  }
  if (page.startsWith("post-")) {
    const key = page.replace("post-", "");
    // key가 id 형태로 들어왔으면 slug로 변환
    const post = posts.find(p => p.id === key || slugify(p.title) === key);
    if (post) {
      const slug = slugify(post.title) || post.id;
      return `/post/${slug}`;
    }
    return `/post/${encodeURIComponent(key)}`;
  }
  return "/";
}

// 메타태그/canonical/JSON-LD를 head에 반영
function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function setArticleJsonLd(post: Post | null) {
  const id = "article-jsonld";
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!post) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  const slug = slugify(post.title) || post.id;
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": [post.image],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": { "@type": "Person", "name": post.author || "하우징허브 편집팀" },
    "publisher": {
      "@type": "Organization",
      "name": "상상아트",
      "alternateName": SITE_NAME,
      "url": SITE_URL,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon.svg` },
      "taxID": "272-14-01256"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/post/${slug}`
    },
    "articleSection": post.category,
    "inLanguage": "ko-KR"
  };
  el.textContent = JSON.stringify(data);
}

function setBreadcrumbJsonLd(post: Post | null) {
  const id = "breadcrumb-jsonld";
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!post) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  const slug = slugify(post.title) || post.id;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": SITE_URL + "/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": post.category,
        "item": `${SITE_URL}/category/${encodeURIComponent(post.category)}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `${SITE_URL}/post/${slug}`
      }
    ]
  };
  el.textContent = JSON.stringify(data);
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => pageFromUrl());
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  });
  const [realPosts, setRealPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // 브라우저 뒤로/앞으로 가기 처리 (검색어도 함께 복원)
  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(pageFromUrl());
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("q") || "");
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // 검색어 변경 시 URL 동기화 (디바운스 적용 — 타이핑 중에는 history 누적 방지)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const currentQ = params.get("q") || "";
    if (currentQ === searchQuery) return;

    // 빈 검색어로 바뀐 경우는 즉시 (검색 닫기 버튼 즉시 반영)
    if (!searchQuery) {
      params.delete("q");
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
      // replaceState: 닫을 때는 새 히스토리 만들지 않고 현재 항목 대체
      window.history.replaceState({}, "", newUrl);
      return;
    }

    // 타이핑 중에는 500ms 디바운스 후 history 누적
    const timer = setTimeout(() => {
      params.set("q", searchQuery);
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
      // 첫 검색 진입은 pushState, 같은 키워드 수정은 replaceState
      const wasSearching = !!currentQ;
      if (wasSearching) {
        window.history.replaceState({}, "", newUrl);
      } else {
        window.history.pushState({}, "", newUrl);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Post[];
      setRealPosts(posts);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const allPosts = useMemo(() => {
    // Combine mock posts with real posts, avoiding duplicates by ID
    const combined = [...realPosts];
    MOCK_POSTS.forEach(mock => {
      if (!combined.find(p => p.id === mock.id)) {
        combined.push(mock);
      }
    });
    // Sort all posts by date descending
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [realPosts]);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;
    if (currentPage === "home") {
      // Show all
    } else if (currentPage.startsWith("category-")) {
      const category = currentPage.replace("category-", "");
      posts = posts.filter(p => p.category === category);
    }

    if (searchQuery) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return posts;
  }, [currentPage, searchQuery, allPosts]);

  const currentPost = useMemo(() => {
    if (currentPage.startsWith("post-")) {
      const key = currentPage.replace("post-", "");
      // slug 우선 매칭, 없으면 id로 fallback (백워드 호환)
      return (
        allPosts.find(p => slugify(p.title) === key) ||
        allPosts.find(p => p.id === key) ||
        null
      );
    }
    return null;
  }, [currentPage, allPosts]);

  // 게시물을 찾은 경우, URL이 id로 되어 있다면 slug 형태로 정리(replaceState).
  // 검색엔진/공유 시 깔끔한 URL 유지를 위함.
  useEffect(() => {
    if (!currentPost) return;
    const slug = slugify(currentPost.title) || currentPost.id;
    const desired = `/post/${slug}`;
    if (window.location.pathname !== desired) {
      window.history.replaceState({}, "", desired);
    }
  }, [currentPost]);

  // SEO 메타태그/canonical/JSON-LD 동기화
  useEffect(() => {
    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESCRIPTION;
    let canonical = `${SITE_URL}/`;
    let ogType: "website" | "article" = "website";
    let ogImage: string | null = null;

    if (currentPost) {
      const slug = slugify(currentPost.title) || currentPost.id;
      title = `${currentPost.title} | ${SITE_NAME}`;
      description = currentPost.excerpt || stripHtml(sanitizeContent(currentPost.content)).slice(0, 155);
      canonical = `${SITE_URL}/post/${slug}`;
      ogType = "article";
      ogImage = currentPost.image;
    } else if (currentPage === "about") {
      title = `소개 | ${SITE_NAME}`;
      description = `${SITE_NAME}는 실용적이고 정확한 주거 정보를 전해드리는 미디어입니다.`;
      canonical = `${SITE_URL}/about`;
    } else if (currentPage === "privacy") {
      title = `개인정보 처리방침 | ${SITE_NAME}`;
      description = `${SITE_NAME}의 개인정보 수집 및 이용에 관한 안내입니다.`;
      canonical = `${SITE_URL}/privacy`;
    } else if (currentPage === "partnership") {
      title = `제휴 및 비즈니스 문의 | ${SITE_NAME}`;
      description = `${SITE_NAME}와 광고, 콘텐츠 협업, 파트너십 문의를 위한 안내 페이지입니다.`;
      canonical = `${SITE_URL}/partnership`;
    } else if (currentPage === "announcement") {
      title = `공지사항 | ${SITE_NAME}`;
      description = `${SITE_NAME}의 서비스 운영 관련 공지사항을 안내합니다.`;
      canonical = `${SITE_URL}/announcement`;
    } else if (currentPage === "terms") {
      title = `이용약관 | ${SITE_NAME}`;
      description = `${SITE_NAME} 서비스 이용에 관한 약관입니다.`;
      canonical = `${SITE_URL}/terms`;
    } else if (currentPage.startsWith("category-")) {
      const cat = currentPage.replace("category-", "");
      const catDescriptions: Record<string, string> = {
        "청약-분양": "청약 가점 계산, 특별공급 자격, 신혼희망타운, 분양권 양도세, 공공분양 vs 민간분양 등 청약-분양 실무 정보를 정리한 카테고리입니다.",
        "전월세": "전세 사기 예방, 임대차 3법 해설, 보증금 반환 절차, 전월세 신고제, 임차권등기명령 등 임대차 관련 주거 정보를 모았습니다.",
        "이사-인테리어": "이사 견적 비교, 입주청소 노하우, 원룸·오피스텔 셀프 인테리어, 관리비 절감 등 주거 생활 실용 가이드를 제공합니다.",
        "대출-금융": "디딤돌·보금자리·신생아 특례대출 비교, 주택연금 활용법, 전세대출 한도 확대, 양도세 중과 등 주택 금융 정보를 다룹니다.",
      };
      title = `${cat} 카테고리 | ${SITE_NAME}`;
      description = catDescriptions[cat] || `${cat} 관련 주거 정보와 가이드를 모았습니다.`;
      canonical = `${SITE_URL}/category/${encodeURIComponent(cat)}`;
    }

    document.title = title;
    setMeta("description", description);
    setCanonical(canonical);

    // Open Graph
    setMeta("og:type", ogType, "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:locale", "ko_KR", "property");
    if (ogImage) {
      setMeta("og:image", ogImage, "property");
      setMeta("twitter:image", ogImage);
    }

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    // Article JSON-LD (게시물 페이지에만)
    setArticleJsonLd(currentPost);
    setBreadcrumbJsonLd(currentPost);
  }, [currentPage, currentPost]);

  const handleNavigate = (page: string) => {
    const nextPage = page as Page;
    const nextUrl = urlFromPage(nextPage, allPosts);
    if (window.location.pathname !== nextUrl) {
      window.history.pushState({}, "", nextUrl);
    }
    setCurrentPage(nextPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar onSearch={setSearchQuery} onNavigate={handleNavigate} searchQuery={searchQuery} />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentPage === "home" && !searchQuery && (
            <motion.section
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10" />
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="outline" className="mb-4 border-indigo-200 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">
                    부동산 기초 정보 가이드
                  </Badge>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-6 font-display break-keep">
                    나에게 맞는 <br />
                    <span className="text-indigo-600">안전한 주거 생활</span>
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                    청약 제도부터 임대차 계약 시 주의 사항까지, 실생활에 필요한 주거 관련 정보를 정리해 드립니다. 복잡한 용어를 사례 중심으로 풀이합니다.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-8 h-14 text-base font-semibold group shadow-lg shadow-indigo-100"
                      onClick={() => handleNavigate("category-청약-분양")}
                    >
                      최신 청약 정보 보기 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full px-8 h-14 text-base font-semibold border-2"
                      onClick={() => handleNavigate("category-대출-금융")}
                    >
                      전세대출 가이드
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100 border-8 border-white bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=1200" 
                      alt="Modern House" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1554435493-93422e8220c8?auto=format&fit=crop&q=80&w=1200";
                      }}
                    />
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border hidden md:block">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Bookmark className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">실전 가이드</p>
                        <p className="text-xs text-gray-500">신뢰할 수 있는 주거 정보</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {currentPage === "about" && (
            <motion.div 
              key="about-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-20 prose prose-indigo"
            >
              <h1 className="font-display">하우징허브(HousingHub) 소개</h1>
              <p className="lead">하우징허브는 복잡하고 어려운 부동산 및 주거 정보를 누구나 쉽게 이해하고 실생활에 적용할 수 있도록 돕는 디지털 가이드입니다.</p>
              
              <h2>우리의 목표</h2>
              <p>대한민국의 주거 환경은 급격히 변화하고 있으며, 관련 정책과 법률은 날로 복잡해지고 있습니다. 하우징허브는 단순한 시세 나열이 아닌, 사용자가 실제로 집을 구하고, 계약하고, 거주하는 전 과정에서 부딪히는 문제들을 해결할 수 있는 '신뢰할 수 있는 정보'를 제공하는 것을 최우선 가치로 삼습니다.</p>

              <h3>주요 제공 콘텐츠</h3>
              <ul>
                <li><strong>청약-분양:</strong> 최신 청약 가점제 분석, 신규 분양 단지 정보 및 청약 전략 가이드</li>
                <li><strong>전월세:</strong> 안전한 임대차 계약을 위한 권리 분석 방법, 전세 사기 예방 수칙, 임대차 보호법 해설</li>
                <li><strong>대출-금융:</strong> 정부 지원 저금리 대출 상품(버팀목, 디딤돌 등) 정보 및 자격 요건 안내</li>
                <li><strong>이사-인테리어:</strong> 효율적인 이사 준비 체크리스트와 합리적인 홈 스타일링 팁</li>
              </ul>

              <p>하우징허브는 항상 사용자의 관점에서 가장 필요하고 유익한 정보를 전달하기 위해 끊임없이 연구하고 소통하겠습니다.</p>

              <h2>콘텐츠 제작 원칙</h2>
              <p>하우징허브는 단순히 검색 결과를 모아 정리하는 사이트가 아닙니다. 모든 콘텐츠는 다음 네 가지 원칙을 따라 제작·검증됩니다.</p>
              <ul>
                <li><strong>① 1차 자료 우선:</strong> 국토교통부, 한국주택금융공사(HF), 한국부동산원, 주택도시기금, 청약홈 등 정부·공공기관의 공식 발표 자료를 우선 인용합니다.</li>
                <li><strong>② 법령 정확성:</strong> 주택임대차보호법, 부동산 거래신고법, 소득세법 등 관련 법령의 최신 개정 사항을 반영하며, 변동 시 본문을 신속히 업데이트합니다.</li>
                <li><strong>③ 출처 명시:</strong> 본문에 인용된 모든 공공 자료는 원문 링크를 함께 제공해 독자가 직접 확인할 수 있도록 합니다.</li>
                <li><strong>④ 면책 고지:</strong> 세무·법률·금융 등 전문 분야의 정보는 일반 안내 목적임을 명시하고, 중요한 의사결정에는 전문가 상담을 권장합니다.</li>
              </ul>

              <h2>편집 검증 프로세스</h2>
              <p>발행되는 모든 글은 다음 3단계 검토를 거쳐 게재됩니다.</p>
              <ol>
                <li><strong>초안 작성:</strong> 주제별 가이드라인에 따라 1차 자료를 수집하고 본문을 구성합니다.</li>
                <li><strong>팩트 체크:</strong> 본문에 등장하는 수치(금리, 한도, 세율, 시행일 등)와 법령 조문을 공공기관 공식 자료와 대조해 검증합니다.</li>
                <li><strong>편집팀 검토:</strong> 표현의 정확성과 이해 용이성, 면책 고지의 적절성을 종합적으로 점검한 뒤 발행합니다.</li>
              </ol>
              <p>법령이나 정책이 변경되면 해당 글의 본문을 수정하고, 글 하단에 '최종 업데이트' 일자를 갱신합니다. 독자가 부정확하다고 판단되는 부분을 발견한 경우 <a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a>으로 알려주시면 신속히 검토 후 반영합니다.</p>

              <h2>다루는 주제의 범위와 한계</h2>
              <p>하우징허브는 주거 생활에 직접 관련된 정보를 중심으로 다룹니다. 즉 청약-분양, 전월세, 이사-인테리어, 주택 관련 대출과 금융이 주된 영역입니다.</p>
              <p>다음 영역은 본 사이트의 다루는 범위에 포함되지 않으며, 별도의 전문 채널을 통해 정보를 얻으시기를 권합니다.</p>
              <ul>
                <li>부동산 투자 종목 추천, 특정 단지의 향후 가격 예측</li>
                <li>개별 사례에 대한 법률·세무 자문</li>
                <li>금융 상품의 가입 권유 또는 영업 활동</li>
              </ul>
              <p>본 사이트의 모든 정보는 일반적인 안내를 목적으로 하며, 특정 개인의 의사결정에 대한 자문이 아닙니다. 중요한 결정 시에는 반드시 해당 분야의 전문가 및 공공기관 공식 자료를 함께 확인하시기 바랍니다.</p>

              <h2>운영 정보</h2>
              <ul>
                <li><strong>운영 주체:</strong> 상상아트</li>
                <li><strong>사업자등록번호:</strong> 272-14-01256</li>
                <li><strong>통신판매업 신고번호:</strong> 제2023-화성동탄-1098호</li>
                <li><strong>업태/종목:</strong> 정보통신업(미디어콘텐츠창작업, 1인미디어콘텐츠창작자), 광고 대행업, 시각 디자인업, 영상·미디어 제작업</li>
                <li><strong>문의 이메일:</strong> <a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a></li>
                <li><strong>사이트 URL:</strong> <a href="https://zip9.kr" target="_blank" rel="noopener noreferrer">https://zip9.kr</a></li>
              </ul>
              <p>하우징허브는 상상아트가 운영하는 디지털 미디어입니다. 제휴, 콘텐츠 제보, 정정 요청, 그 외 사이트 운영과 관련된 모든 문의는 위 이메일로 보내주시면 영업일 기준 3일 이내 회신드립니다.</p>
            </motion.div>
          )}

          {currentPage === "privacy" && (
            <motion.div 
              key="privacy-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-20 prose prose-indigo"
            >
              <h1 className="font-display">개인정보 처리방침</h1>
              <p>상상아트(이하 '회사')는 「개인정보 보호법」 등 관련 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 본 처리방침을 수립·공개합니다.</p>

              <p className="text-sm text-gray-500">본 개인정보처리방침은 다음과 같은 내용을 담고 있습니다.</p>
              <ol className="text-sm text-gray-600">
                <li>개인정보의 처리 목적</li>
                <li>처리하는 개인정보의 항목 및 수집 방법</li>
                <li>개인정보의 처리 및 보유 기간</li>
                <li>개인정보 처리의 위탁에 관한 사항</li>
                <li>개인정보의 제3자 제공에 관한 사항</li>
                <li>정보주체와 법정대리인의 권리·의무 및 그 행사 방법</li>
                <li>개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부</li>
                <li>광고 게재 및 제3자 광고 서비스</li>
                <li>개인정보의 안전성 확보 조치</li>
                <li>개인정보 보호책임자 및 담당자</li>
                <li>개인정보 열람 청구</li>
                <li>권익 침해 구제 방법</li>
                <li>고지의 의무</li>
              </ol>

              <h2>1. 개인정보의 처리 목적</h2>
              <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
              <ul>
                <li><strong>웹사이트 운영 및 통계 분석:</strong> 방문자 통계 집계, 콘텐츠 인기도 분석, 서비스 개선</li>
                <li><strong>문의 응대:</strong> 이메일로 접수된 문의·정정 요청·제보에 대한 회신</li>
                <li><strong>광고 게재 및 효과 측정:</strong> Google AdSense를 통한 맞춤형 광고 게재 및 광고 성과 측정</li>
                <li><strong>법령상 의무 이행:</strong> 관계 법령에 따른 기록 보존 및 분쟁 대응</li>
              </ul>

              <h2>2. 처리하는 개인정보의 항목 및 수집 방법</h2>
              <p>① 회사는 회원가입 절차 없이 콘텐츠를 제공하므로 식별 가능한 개인정보를 직접 수집하지 않습니다. 다만 다음의 정보가 자동으로 수집되거나, 사용자가 직접 제공하는 경우에 한해 수집됩니다.</p>

              <div className="overflow-x-auto my-6 not-prose">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                      <th className="p-3 text-left font-semibold text-gray-900 border border-gray-200 w-32">구분</th>
                      <th className="p-3 text-left font-semibold text-gray-900 border border-gray-200">수집 항목</th>
                      <th className="p-3 text-left font-semibold text-gray-900 border border-gray-200 w-40">수집 시점</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 align-top text-gray-700 border border-gray-200 font-medium">자동 수집</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">IP 주소, 브라우저 종류 및 버전, OS 정보, 방문 일시, 방문 페이지, 접속 경로(referrer), 쿠키</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">웹사이트 접속 시</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 align-top text-gray-700 border border-gray-200 font-medium">이용자 제공</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">이메일 주소(문의자가 직접 기재한 경우), 문의 내용</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">이메일 문의 시</td>
                    </tr>
                    <tr>
                      <td className="p-3 align-top text-gray-700 border border-gray-200 font-medium">제3자 도구</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">Google Analytics 통계 데이터, Google AdSense 광고 식별자</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">웹사이트 접속 시</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>② 수집 방법: 웹사이트 접속 시 자동 수집, 사용자가 이메일로 직접 발송, Google이 제공하는 분석·광고 도구를 통한 수집</p>

              <h2>3. 개인정보의 처리 및 보유 기간</h2>
              <p>회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
              <ul>
                <li><strong>접속 로그 및 IP 정보:</strong> 「통신비밀보호법」에 따라 3개월간 보관</li>
                <li><strong>이메일 문의 내용:</strong> 회신 완료 후 1년 보관 후 파기 (분쟁 대응 목적)</li>
                <li><strong>쿠키 정보:</strong> 브라우저 설정에 따라 사용자가 임의로 삭제 가능, 미삭제 시 최대 2년</li>
                <li><strong>광고 식별자:</strong> Google AdSense의 정책에 따라 보관 (Google 개인정보처리방침 참조)</li>
              </ul>
              <p>법령에서 정한 별도의 보존 의무가 있는 경우(예: 「전자상거래 등에서의 소비자보호에 관한 법률」 표시·광고 기록 6개월, 계약·청약 철회 기록 5년 등), 회사는 해당 기간 동안 정보를 안전하게 보관한 후 지체 없이 파기합니다.</p>

              <h2>4. 개인정보 처리의 위탁에 관한 사항</h2>
              <p>회사는 원활한 서비스 운영을 위하여 다음과 같이 일부 업무를 외부 전문업체에 위탁하고 있습니다. 위탁 계약 시 「개인정보 보호법」 제26조에 따라 개인정보의 안전한 처리에 관한 사항을 명시하고 있습니다.</p>
              <div className="overflow-x-auto my-6 not-prose">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                      <th className="p-3 text-left font-semibold text-gray-900 border border-gray-200 w-40">수탁자</th>
                      <th className="p-3 text-left font-semibold text-gray-900 border border-gray-200">위탁 업무 내용</th>
                      <th className="p-3 text-left font-semibold text-gray-900 border border-gray-200 w-44">개인정보 보유·이용 기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 align-top text-gray-700 border border-gray-200 font-medium">Vercel Inc.</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">웹사이트 호스팅 및 콘텐츠 전송망(CDN) 운영</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">위탁계약 종료 시까지</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 align-top text-gray-700 border border-gray-200 font-medium">Google LLC</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">웹 분석(Google Analytics), 광고 게재(Google AdSense)</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">Google 정책에 따름</td>
                    </tr>
                    <tr>
                      <td className="p-3 align-top text-gray-700 border border-gray-200 font-medium">Google Firebase</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">데이터베이스 및 인증 서비스</td>
                      <td className="p-3 align-top text-gray-700 border border-gray-200">위탁계약 종료 시까지</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>5. 개인정보의 제3자 제공에 관한 사항</h2>
              <p>① 회사는 정보주체의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만 다음의 경우에 한해 예외적으로 제공할 수 있습니다.</p>
              <ul>
                <li>정보주체로부터 별도의 동의를 받은 경우</li>
                <li>다른 법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</li>
                <li>법원의 재판 업무 수행을 위하여 제공하는 경우</li>
                <li>범죄의 수사와 공소의 제기 및 유지를 위하여 필요한 경우</li>
                <li>명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</li>
              </ul>
              <p>② 본 사이트는 Google AdSense를 통해 광고를 게재하며, Google은 광고 게재를 위해 사용자의 쿠키 정보 등을 활용할 수 있습니다. 자세한 사항은 본 처리방침 제8조 '광고 게재 및 제3자 광고 서비스'를 참고하시기 바랍니다.</p>

              <h2>6. 정보주체와 법정대리인의 권리·의무 및 그 행사 방법</h2>
              <p>① 정보주체는 회사에 대해 언제든지 다음의 권리를 행사할 수 있습니다.</p>
              <ul>
                <li>개인정보 열람 요구</li>
                <li>개인정보 정정·삭제 요구</li>
                <li>개인정보 처리 정지 요구</li>
                <li>동의 철회 요구</li>
              </ul>
              <p>② 위 권리 행사는 회사에 대해 이메일(<a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a>)을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
              <p>③ 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여서도 하실 수 있습니다. 이 경우 위임장을 제출하셔야 합니다.</p>
              <p>④ 만 14세 미만 아동의 개인정보는 수집하지 않습니다.</p>

              <h2>7. 개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부</h2>
              <p>① 회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
              <p>② 쿠키는 웹사이트를 운영하는 데 이용되는 서버가 이용자의 브라우저에 보내는 소량의 정보이며 이용자의 PC 또는 모바일 기기 내에 저장됩니다.</p>
              <ol>
                <li><strong>쿠키의 사용 목적:</strong> 방문자 통계 집계, 콘텐츠 추천 최적화, 광고 게재 최적화, 서비스 개선</li>
                <li><strong>쿠키의 설치·운영 및 거부:</strong> 이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
                  <ul>
                    <li>Chrome: 설정 → 개인정보 보호 및 보안 → 쿠키 및 기타 사이트 데이터</li>
                    <li>Safari: 환경설정 → 개인정보 보호 → 쿠키 및 웹 사이트 데이터</li>
                    <li>Edge: 설정 → 쿠키 및 사이트 권한 → 쿠키 및 사이트 데이터</li>
                  </ul>
                </li>
                <li><strong>쿠키 거부 시 영향:</strong> 쿠키 저장을 거부할 경우 일부 맞춤 서비스 이용에 어려움이 있을 수 있습니다.</li>
              </ol>

              <h2>8. 광고 게재 및 제3자 광고 서비스</h2>
              <p>① 본 사이트는 Google LLC의 광고 서비스인 Google AdSense를 통해 광고를 게재합니다.</p>
              <p>② Google AdSense는 사용자의 이전 사이트 방문 정보를 토대로 사용자의 관심에 맞는 광고를 게재하기 위해 쿠키 및 광고 식별자를 사용합니다. 이 과정에서 수집되는 정보는 Google의 개인정보처리방침에 따라 관리됩니다.</p>
              <p>③ 사용자는 다음 경로를 통해 맞춤 광고를 거부하실 수 있습니다.</p>
              <ul>
                <li><a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google 광고 설정 페이지</a>에서 맞춤 광고 비활성화</li>
                <li><a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google 광고 정책</a> 확인</li>
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google 개인정보처리방침</a> 확인</li>
              </ul>
              <p>④ 본 사이트는 광고 클릭이나 광고를 통한 거래에 대해 직접적인 책임을 지지 않으며, 광고주와의 거래에서 발생한 손해는 해당 광고주에게 문의하시기 바랍니다.</p>

              <h2>9. 개인정보의 안전성 확보 조치</h2>
              <p>회사는 개인정보의 안전성 확보를 위하여 다음과 같은 조치를 취하고 있습니다.</p>
              <ol>
                <li><strong>관리적 조치:</strong> 개인정보 취급 직원의 최소화, 정기적인 자체 점검, 내부 관리 계획 수립·시행</li>
                <li><strong>기술적 조치:</strong> SSL/TLS 암호화 통신(HTTPS) 적용, 접근 권한 관리, 보안 프로그램 설치 및 주기적 갱신</li>
                <li><strong>물리적 조치:</strong> 신뢰할 수 있는 클라우드 서비스(Vercel, Google Cloud)를 통한 데이터 보관, 접근 통제 시스템 운영</li>
              </ol>

              <h2>10. 개인정보 보호책임자 및 담당자</h2>
              <p>회사는 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
              <ul>
                <li><strong>개인정보 보호책임자:</strong> 박예준 (운영 실무 책임자)</li>
                <li><strong>연락처:</strong> <a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a></li>
                <li><strong>접수 시간:</strong> 평일 오전 9시 ~ 오후 6시 (주말·공휴일 제외)</li>
              </ul>
              <p>정보주체는 회사의 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의, 불만 처리, 피해 구제 등에 관한 사항을 위 책임자에게 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리할 것입니다.</p>

              <h2>11. 개인정보 열람 청구</h2>
              <p>정보주체는 「개인정보 보호법」 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람 청구가 신속하게 처리되도록 노력하겠습니다.</p>
              <ul>
                <li><strong>부서명:</strong> 상상아트 고객 응대팀</li>
                <li><strong>이메일:</strong> <a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a></li>
              </ul>

              <h2>12. 권익 침해 구제 방법</h2>
              <p>정보주체는 개인정보 침해로 인한 신고, 상담이 필요한 경우 아래 기관에 도움을 요청하실 수 있습니다.</p>
              <ul>
                <li><strong>개인정보분쟁조정위원회:</strong> (국번 없이) 1833-6972 / <a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer">www.kopico.go.kr</a></li>
                <li><strong>개인정보침해 신고센터:</strong> (국번 없이) 118 / <a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer">privacy.kisa.or.kr</a></li>
                <li><strong>대검찰청 사이버수사과:</strong> (국번 없이) 1301 / <a href="https://www.spo.go.kr" target="_blank" rel="noopener noreferrer">www.spo.go.kr</a></li>
                <li><strong>경찰청 사이버수사국:</strong> (국번 없이) 182 / <a href="https://ecrm.cyber.go.kr" target="_blank" rel="noopener noreferrer">ecrm.cyber.go.kr</a></li>
              </ul>

              <h2>13. 고지의 의무</h2>
              <p>본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제, 정정이 있는 경우 변경 사항의 시행 7일 전부터 공지사항 또는 본 페이지를 통하여 고지할 것입니다.</p>
              <p>다만, 이용자 권리에 중대한 변경이 발생할 때에는 최소 30일 전에 공지합니다.</p>

              <hr />
              <p className="text-sm text-gray-500"><strong>운영 주체:</strong> 상상아트</p>
              <p className="text-sm text-gray-500"><strong>사업자등록번호:</strong> 272-14-01256</p>
              <p className="text-sm text-gray-500"><strong>통신판매업 신고번호:</strong> 제2023-화성동탄-1098호</p>
              <p className="text-sm text-gray-500"><strong>이메일:</strong> <a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a></p>
              <p className="text-sm text-gray-500"><strong>공고일자:</strong> 2026년 4월 28일</p>
              <p className="text-sm text-gray-500"><strong>시행일자:</strong> 2026년 4월 28일</p>
            </motion.div>
          )}

          {currentPage === "terms" && (
            <motion.div
              key="terms-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-20 prose prose-indigo"
            >
              <h1 className="font-display">이용약관</h1>
              <p>본 약관은 하우징허브(이하 "사이트")가 제공하는 콘텐츠 및 부가 서비스(이하 "서비스")의 이용과 관련하여 사이트와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>

              <h2>제1조 (목적)</h2>
              <p>이 약관은 이용자가 사이트에서 제공하는 서비스를 이용함에 있어 필요한 사항을 규정합니다.</p>

              <h2>제2조 (용어의 정의)</h2>
              <ul>
                <li><strong>"사이트"</strong>란 상상아트가 운영하는 하우징허브(https://zip9.kr)를 의미합니다.</li>
                <li><strong>"운영자"</strong>란 본 사이트를 운영하는 상상아트를 의미합니다.</li>
                <li><strong>"이용자"</strong>란 사이트에 접속하여 서비스를 이용하는 모든 자를 말합니다.</li>
                <li><strong>"콘텐츠"</strong>란 사이트가 게재하는 모든 텍스트, 이미지, 데이터, 영상 등을 의미합니다.</li>
              </ul>

              <h2>제3조 (약관의 효력 및 변경)</h2>
              <p>이 약관은 사이트에 게시함으로써 효력이 발생하며, 사이트는 합리적인 사유가 발생할 경우 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다. 변경된 약관은 사이트에 공지함으로써 효력이 발생합니다.</p>

              <h2>제4조 (서비스의 제공 및 변경)</h2>
              <p>사이트는 청약-분양, 전월세, 이사-인테리어, 대출-금융 등 주거 생활과 관련된 정보 콘텐츠를 제공합니다. 사이트는 운영상·기술상 필요한 경우 제공하는 서비스의 내용을 변경할 수 있습니다.</p>

              <h2>제5조 (이용자의 의무)</h2>
              <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
              <ul>
                <li>사이트가 게시한 콘텐츠를 사전 동의 없이 상업적 목적으로 복제·재배포하는 행위</li>
                <li>사이트의 운영을 방해하거나 시스템에 무단으로 접근하는 행위</li>
                <li>타인의 명예를 훼손하거나 권리를 침해하는 행위</li>
                <li>관련 법령 및 본 약관에 위배되는 그 밖의 행위</li>
              </ul>

              <h2>제6조 (콘텐츠의 저작권)</h2>
              <p>사이트가 작성한 모든 콘텐츠의 저작권은 운영자인 상상아트에 귀속됩니다. 이용자는 운영자의 사전 서면 동의 없이 콘텐츠를 영리 목적으로 이용하거나 제3자에게 이용하게 할 수 없습니다. 단, 출처를 명시한 비영리적·개인적 인용은 허용됩니다.</p>

              <h2>제7조 (책임의 제한)</h2>
              <p>사이트가 제공하는 정보는 일반적인 안내를 목적으로 하며, 특정 개인의 의사 결정에 대한 법률·세무·금융 자문이 아닙니다. 이용자가 사이트의 정보를 활용하여 내린 결정으로 인해 발생한 손실에 대해 사이트는 법적 책임을 지지 않으며, 중요한 의사 결정 시에는 반드시 해당 분야의 전문가 및 공공기관의 공식 자료를 함께 확인하실 것을 권장합니다.</p>

              <h2>제8조 (광고)</h2>
              <p>사이트는 서비스 운영을 위해 Google AdSense 등 제3자 광고를 게재할 수 있습니다. 광고의 내용 및 그로 인한 거래에 대한 책임은 해당 광고주에게 있으며, 사이트는 이에 대해 책임지지 않습니다.</p>

              <h2>제9조 (준거법 및 관할)</h2>
              <p>이 약관과 관련된 분쟁은 대한민국 법령에 따르며, 분쟁이 발생할 경우 민사소송법상의 관할 법원을 따릅니다.</p>

              <h2>제10조 (운영자 정보)</h2>
              <ul>
                <li><strong>운영 주체:</strong> 상상아트</li>
                <li><strong>사업자등록번호:</strong> 272-14-01256</li>
                <li><strong>통신판매업 신고번호:</strong> 제2023-화성동탄-1098호</li>
                <li><strong>업태/종목:</strong> 정보통신업(미디어콘텐츠창작업, 1인미디어콘텐츠창작자), 광고 대행업, 시각 디자인업</li>
                <li><strong>이메일:</strong> <a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a></li>
                <li><strong>사이트:</strong> https://zip9.kr</li>
              </ul>

              <p className="text-sm text-gray-500 mt-12">공고일자: 2026년 4월 28일 · 시행일자: 2026년 4월 28일</p>
            </motion.div>
          )}

          {currentPage === "announcement" && (
            <motion.div
              key="announcement-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-20 prose prose-indigo"
            >
              <h1 className="font-display">공지사항</h1>
              <p>하우징허브 운영에 관한 안내 사항을 공지합니다.</p>

              <h2>2026년 5월 18일</h2>
              <h3>운영 주체 정보 명시화 및 개인정보처리방침 개정</h3>
              <p>독자 여러분께 더 투명한 정보를 제공하고자 운영 주체인 상상아트의 사업자 정보(사업자등록번호 272-14-01256)를 사이트 전반에 명시하였습니다. 또한 「개인정보 보호법」 제30조에 따른 개인정보처리방침을 13개 섹션으로 전면 개정하여 공개하였습니다. 새 처리방침은 동일자로 시행됩니다.</p>

              <h2>2026년 5월 12일</h2>
              <h3>토지거래허가구역 실거주 유예 확대 등 신규 정책 안내 강화</h3>
              <p>국토교통부의 토지거래허가구역 실거주 의무 유예 확대 발표에 맞춰 관련 안내 콘텐츠를 신속히 보강하였습니다. 무주택 실수요자가 알아야 할 핵심 변화를 청약-분양 카테고리에서 확인하실 수 있습니다.</p>

              <h2>2026년 4월 28일</h2>
              <h3>하우징허브 정식 오픈</h3>
              <p>대한민국 1인 가구·청년·실수요자를 위한 주거 정보 가이드 사이트 '하우징허브'(zip9.kr)를 정식 오픈하였습니다. 청약-분양, 전월세, 이사-인테리어, 대출-금융 4개 카테고리에 걸쳐 실용적인 정보를 차근차근 쌓아갈 계획입니다.</p>

              <hr />
              <h2>운영 안내</h2>
              <p>본 공지사항은 사이트 운영 정책, 콘텐츠 정책, 법령 준수와 관련된 주요 변경 사항을 안내합니다. 중요 사항이 발생할 때마다 본 페이지를 통해 우선 안내드리며, 개인정보 처리에 관한 변경은 별도로 <button onClick={() => handleNavigate("privacy")} className="text-indigo-600 hover:underline">개인정보처리방침</button>을 통해 고지합니다.</p>
              <p>사이트 운영 관련 의견이나 제보는 언제든 <a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a>으로 보내주세요.</p>
            </motion.div>
          )}

          {currentPage === "partnership" && (
            <motion.div
              key="partnership-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-20 prose prose-indigo"
            >
              <h1 className="font-display">제휴 및 비즈니스 문의</h1>
              <p>하우징허브는 부동산·주거 분야의 양질의 정보 콘텐츠를 제공하는 미디어입니다. 독자 여러분과 업계 파트너 여러분의 다양한 제안을 환영합니다.</p>

              <h2>제휴 가능 영역</h2>
              <ul>
                <li><strong>콘텐츠 협업:</strong> 부동산·금융·주거 관련 전문가의 인사이트 기고, 인터뷰 협업</li>
                <li><strong>광고·홍보:</strong> 부동산 관련 서비스, 금융상품, 주거 서비스의 홍보 협업</li>
                <li><strong>데이터·서비스 협업:</strong> 부동산 시세 정보, 임대차 통계, 청약 정보 등의 데이터 제공·교환</li>
                <li><strong>이벤트·세미나:</strong> 주거 관련 오프라인·온라인 행사 공동 운영</li>
              </ul>

              <h2>제휴 검토 기준</h2>
              <p>하우징허브는 독자에게 정확하고 유용한 정보를 제공한다는 원칙을 최우선으로 합니다. 따라서 다음 기준에 부합하는 제휴만 검토합니다.</p>
              <ul>
                <li>법령을 준수하는 적법한 서비스·상품일 것</li>
                <li>독자의 권익을 침해하지 않을 것</li>
                <li>부풀려진 약속이나 허위·과장 표현이 없을 것</li>
                <li>편집 독립성을 침해하지 않을 것</li>
              </ul>

              <h2>문의 방법</h2>
              <p>제휴를 희망하시는 분은 아래 이메일로 다음 사항을 포함하여 보내주시기 바랍니다.</p>
              <ul>
                <li>회사명·기관명 및 담당자 정보</li>
                <li>제휴 분야와 구체적인 제안 내용</li>
                <li>희망 일정 및 예산 범위(해당 시)</li>
              </ul>
              <p>이메일: <a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a></p>
              <p>영업일 기준 3일 이내에 회신드리며, 제안 내용에 따라 비대면 미팅 또는 추가 자료를 요청드릴 수 있습니다.</p>

              <h2>운영 정보</h2>
              <ul>
                <li>운영 주체: 상상아트</li>
                <li>사업자등록번호: 272-14-01256</li>
                <li>통신판매업 신고번호: 제2023-화성동탄-1098호</li>
                <li>이메일: <a href="mailto:apark12321@gmail.com">apark12321@gmail.com</a></li>
              </ul>
            </motion.div>
          )}

          {currentPost ? (
            <motion.article
              key="post-detail"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-20"
            >
              <div className="mb-12">
                <nav aria-label="breadcrumb" className="mb-6 text-sm text-gray-500">
                  <ol className="flex flex-wrap items-center gap-2">
                    <li>
                      <button onClick={() => handleNavigate("home")} className="hover:text-indigo-600 transition-colors">홈</button>
                    </li>
                    <li aria-hidden="true" className="text-gray-300">›</li>
                    <li>
                      <button onClick={() => handleNavigate(`category-${currentPost.category}`)} className="hover:text-indigo-600 transition-colors">{currentPost.category}</button>
                    </li>
                    <li aria-hidden="true" className="text-gray-300">›</li>
                    <li className="text-gray-700 font-medium truncate max-w-xs" aria-current="page">{currentPost.title}</li>
                  </ol>
                </nav>
                <Button 
                  variant="ghost" 
                  className="mb-8 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  onClick={() => handleNavigate("home")}
                >
                  ← 목록으로 돌아가기
                </Button>
                
                <div className="flex gap-2 mb-6">
                  <Badge className="bg-indigo-600 border-none">{currentPost.category}</Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight mb-6 text-gray-900 border-l-4 border-indigo-600 pl-4 sm:pl-6 break-keep">
                  {currentPost.title}
                </h1>
                <div className="flex items-center justify-between py-6 border-y border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{currentPost.author}</p>
                      <p className="text-sm text-gray-500">
                        {currentPost.date.replace(/-/g, ". ")} · {calculateReadTime(currentPost.content)} 읽기
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      title="공유"
                      aria-label="이 글 공유하기"
                      onClick={async () => {
                        const shareData = {
                          title: currentPost.title,
                          text: currentPost.excerpt || currentPost.title,
                          url: window.location.href,
                        };
                        try {
                          if (typeof navigator !== "undefined" && (navigator as any).share) {
                            await (navigator as any).share(shareData);
                            return;
                          }
                        } catch (err) {
                          // 사용자 취소 등은 무시
                        }
                        try {
                          await navigator.clipboard.writeText(window.location.href);
                          alert("주소를 클립보드에 복사했습니다.");
                        } catch {
                          // 폴백: 마지막 수단으로 prompt
                          window.prompt("이 글 주소를 복사하세요:", window.location.href);
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      title="인쇄"
                      aria-label="이 글 인쇄하기"
                      onClick={() => window.print()}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-inner bg-gray-100">
                <img 
                  src={currentPost.image} 
                  alt={currentPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200";
                  }}
                />
              </div>

              <div 
                className="prose prose-indigo prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: sanitizeContent(currentPost.content) }}
              />

              {currentPost.hashtags && currentPost.hashtags.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2">
                  {currentPost.hashtags.map(tag => (
                    <span key={tag} className="text-sm border border-indigo-100 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 관련 글 섹션 - 같은 카테고리의 다른 글 3개 */}
              {(() => {
                const related = allPosts
                  .filter(p => p.category === currentPost.category && p.id !== currentPost.id)
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3);
                if (related.length === 0) return null;
                return (
                  <aside className="mt-16 pt-12 border-t border-gray-200" aria-label="관련 글">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
                      <span className="text-indigo-600">{currentPost.category}</span> 관련 글 더보기
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {related.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleNavigate(`post-${p.id}`)}
                          className="text-left group bg-white border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all"
                        >
                          <Badge className="bg-indigo-50 text-indigo-700 border-none mb-3">{p.category}</Badge>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                            {p.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{p.excerpt}</p>
                          <p className="text-xs text-gray-400 mt-3">{p.date.replace(/-/g, ". ")} · {calculateReadTime(p.content)} 읽기</p>
                        </button>
                      ))}
                    </div>
                  </aside>
                );
              })()}

            </motion.article>
          ) : (
            (currentPage === "home" || currentPage.startsWith("category-")) && (
              <motion.section
                key="post-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
              >
                <div 
                  className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 shadow-sm p-4 bg-gray-50/50 rounded-2xl"
                >
                  <div className="md:max-w-md">
                  {(() => {
                    const categoryName = currentPage === 'home' ? '' : currentPage.replace('category-', '');
                    const isCategory = currentPage.startsWith('category-');
                    const isSearching = !!searchQuery;
                    const title = isSearching
                      ? `'${searchQuery}' 검색 결과`
                      : (isCategory ? `${categoryName} 카테고리` : '최근 게시물');
                    const desc = isSearching
                      ? `총 ${filteredPosts.length}개의 글이 검색되었습니다.`
                      : (isCategory
                        ? ({
                            "청약-분양": "청약 가점, 특별공급, 분양권 세금, 공공분양과 민간분양 등 청약-분양 전 과정에서 필요한 실무 정보를 정리했습니다.",
                            "전월세": "전세 사기 예방, 임대차 3법, 보증금 반환, 전월세 신고제 등 임차인과 임대인 모두에게 필요한 임대차 실무를 안내합니다.",
                            "이사-인테리어": "이사 견적 비교, 입주청소, 원룸 인테리어, 관리비 절감 등 주거 생활을 편리하게 만드는 실용 가이드입니다.",
                            "대출-금융": "디딤돌·보금자리·신생아 특례 등 정책 대출과 주택연금, 전세대출 한도 확대 전략, 양도세·취득세 등 주택 금융 정보를 다룹니다.",
                          } as Record<string, string>)[categoryName] || '부동산 시장의 주요 변화와 계약 실무 등 확인이 필요한 주거 정보를 정리했습니다.'
                        : '부동산 시장의 주요 변화와 계약 실무 등 확인이 필요한 주거 정보를 정리했습니다.');
                    return (
                      <>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-display break-keep">
                            {title}
                          </h2>
                          {isSearching && (
                            <button
                              type="button"
                              onClick={() => { setSearchQuery(""); handleNavigate("home"); }}
                              className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-50 transition-colors"
                              aria-label="검색 닫기"
                            >
                              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                              검색 닫기
                            </button>
                          )}
                        </div>
                        <p className="text-gray-500 font-medium leading-normal">
                          {desc}
                        </p>
                      </>
                    );
                  })()}
                </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                    <Button 
                      variant={currentPage === "home" ? "default" : "outline"}
                      className="rounded-full whitespace-nowrap"
                      onClick={() => handleNavigate("home")}
                    >
                      전체보기
                    </Button>
                    {CATEGORIES.map(cat => (
                      <Button 
                        key={cat}
                        variant={currentPage === `category-${cat}` ? "default" : "outline"}
                        className="rounded-full whitespace-nowrap"
                        onClick={() => handleNavigate(`category-${cat}`)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, idx) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <PostCard post={post} onClick={(id) => handleNavigate(`post-${id}`)} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-40 text-center bg-gray-50 rounded-3xl border-2 border-dashed">
                    <LayoutDashboard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl font-bold text-gray-400">검색 결과가 없습니다.</p>
                    <Button variant="link" className="mt-2 text-indigo-600" onClick={() => {setSearchQuery(""); handleNavigate("home");}}>모든 글 보기</Button>
                  </div>
                )}
              </motion.section>
            )
          )}
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}


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
import { calculateReadTime, slugify, stripHtml } from "./lib/utils";

type Page = "home" | "about" | "privacy" | `category-${string}` | `post-${string}`;

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
      "name": SITE_NAME,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon.svg` }
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => pageFromUrl());
  const [searchQuery, setSearchQuery] = useState("");
  const [realPosts, setRealPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // 브라우저 뒤로/앞으로 가기 처리
  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(pageFromUrl());
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
      description = currentPost.excerpt || stripHtml(currentPost.content).slice(0, 155);
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
    } else if (currentPage.startsWith("category-")) {
      const cat = currentPage.replace("category-", "");
      title = `${cat} 정보 | ${SITE_NAME}`;
      description = `${cat} 관련 주거 정보와 가이드를 모았습니다.`;
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
      <Navbar onSearch={setSearchQuery} onNavigate={handleNavigate} />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentPage === "home" && !searchQuery && (
            <motion.section
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10" />
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="outline" className="mb-4 border-indigo-200 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">
                    부동산 기초 정보 가이드
                  </Badge>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6 font-display">
                    나에게 맞는 <br />
                    <span className="text-indigo-600">안전한 주거 생활</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                    청약 제도부터 임대차 계약 시 주의 사항까지, 실생활에 필요한 주거 관련 정보를 정리해 드립니다. 복잡한 용어를 사례 중심으로 풀이합니다.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-8 h-14 text-base font-semibold group shadow-lg shadow-indigo-100"
                      onClick={() => handleNavigate("category-청약/분양")}
                    >
                      최신 청약 정보 보기 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full px-8 h-14 text-base font-semibold border-2"
                      onClick={() => handleNavigate("category-대출/금융")}
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
                <li><strong>청약/분양:</strong> 최신 청약 가점제 분석, 신규 분양 단지 정보 및 청약 전략 가이드</li>
                <li><strong>전월세:</strong> 안전한 임대차 계약을 위한 권리 분석 방법, 전세 사기 예방 수칙, 임대차 보호법 해설</li>
                <li><strong>대출/금융:</strong> 정부 지원 저금리 대출 상품(버팀목, 디딤돌 등) 정보 및 자격 요건 안내</li>
                <li><strong>이사/인테리어:</strong> 효율적인 이사 준비 체크리스트와 합리적인 홈 스타일링 팁</li>
              </ul>

              <p>하우징허브는 항상 사용자의 관점에서 가장 필요하고 유익한 정보를 전달하기 위해 끊임없이 연구하고 소통하겠습니다.</p>
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
              <h1 className="font-display">개인정보 처리방침 (Privacy Policy)</h1>
              <p>하우징허브(이하 '본 사이트')는 「개인정보 보호법」 등 관련 법령에 따라 사용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 처리방침을 수립·공개합니다.</p>
              
              <h2>1. 개인정보의 수집 및 이용 목적</h2>
              <p>본 사이트는 별도의 회원가입 없이 콘텐츠를 이용할 수 있습니다. 수집되는 정보는 다음과 같은 목적으로 이용됩니다.</p>
              <ul>
                <li>서비스 이용에 따른 통계 분석 및 서비스 개선</li>
                <li>구글 애드센스(Google AdSense) 등 광고 서비스 제공 및 최적화</li>
              </ul>

              <h2>2. 자동 수집되는 개인정보 및 거부 방법</h2>
              <p>본 사이트는 사용자에게 맞춤형 서비스를 제공하기 위해 '쿠키(cookie)' 등 접속 정보를 자동으로 수집할 수 있습니다. 쿠키는 웹사이트를 운영하는 데 이용되는 서버가 사용자의 브라우저에 보내는 아주 작은 텍스트 파일로 사용자의 컴퓨터 하드디스크에 저장됩니다.</p>
              <ul>
                <li><strong>이용 목적:</strong> 사용자의 접속 빈도, 방문 시간 분석, 관심 분야 파악 및 맞춤형 광고 제공</li>
                <li><strong>거부 방법:</strong> 사용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹 브라우저의 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.</li>
              </ul>

              <h2>3. 제3자 광고 서비스 이용 (Google AdSense)</h2>
              <p>본 사이트는 제3자 광고 업체인 Google이 제공하는 광고 서비스를 이용합니다. Google은 사용자가 본 사이트 또는 다른 웹사이트를 방문한 기록을 바탕으로 사용자에게 최적화된 광고를 게재하기 위해 쿠키를 사용합니다. 사용자는 <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener noreferrer">Google 광고 설정</a>을 방문하여 맞춤형 광고를 해제할 수 있습니다.</p>

              <h2>4. 개인정보의 보호 및 관리</h2>
              <p>본 사이트는 수집된 개인정보를 법령에 따르지 않고는 제3자에게 제공하거나 공개하지 않습니다. 개인정보 보호와 관련한 문의사항은 apark12321@gmail.com으로 연락 주시기 바랍니다.</p>
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
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 text-gray-900 border-l-4 border-indigo-600 pl-6">
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
                    <Button variant="outline" size="icon" className="rounded-full"><Share2 className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" className="rounded-full"><Printer className="w-4 h-4" /></Button>
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
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
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
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 font-display">
                      {currentPage === 'home' ? '최근 게시물' : currentPage.replace('category-', '') + ' 정보'}
                    </h2>
                    <p className="text-gray-500 font-medium leading-normal">
                      부동산 시장의 주요 변화와 계약 실무 등 확인이 필요한 주거 정보를 정리했습니다.
                    </p>
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

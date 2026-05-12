
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
import { calculateReadTime } from "./lib/utils";

type Page = "home" | "about" | "privacy" | `category-${string}` | `post-${string}`;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [realPosts, setRealPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);

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
      const id = currentPage.replace("post-", "");
      return allPosts.find(p => p.id === id);
    }
    return null;
  }, [currentPage, allPosts]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
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

              <div className="mt-20 p-8 bg-indigo-50 rounded-3xl">
                <h4 className="text-xl font-bold mb-4">도움이 되셨나요?</h4>
                <p className="text-gray-600 mb-6 font-medium">더 많은 정보를 원하시면 뉴스레터를 구독하세요.</p>
                <div className="flex gap-2">
                  <input className="flex-1 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-600 shadow-sm" placeholder="이메일을 입력하세요" />
                  <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 font-bold">구독하기</Button>
                </div>
              </div>
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

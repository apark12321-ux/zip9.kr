
import { useState, useMemo, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { PostCard } from "./components/PostCard";
import { MOCK_POSTS, CATEGORIES } from "./constants";
import { Post } from "./types";
import { ArrowRight, ChevronRight, Share2, Printer, Bookmark, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "./components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { Badge } from "./components/ui/badge";
import { auth, db } from "./lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { AdminPanel } from "./components/AdminPanel";

type Page = "home" | "about" | "privacy" | "admin" | `category-${string}` | `post-${string}`;

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
    return combined;
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
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100 border-8 border-white">
                    <img 
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200" 
                      alt="Modern House" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
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
              className="max-w-4xl mx-auto px-4 py-20 prose"
            >
              <h1 className="font-display">하우징허브 소개</h1>
              <p>하우징허브는 복잡하고 어려운 부동산 정보를 누구나 쉽게 이해할 수 있도록 전달하기 위해 시작되었습니다.</p>
              <h2>우리의 비전</h2>
              <p>단순한 시세 정보나 투자 권유가 아닌, 실제로 내가 살 집을 구할 때 필요한 '실전 매뉴얼'을 제공하는 것이 하우징허브의 목표입니다.</p>
              <h3>제공 서비스</h3>
              <ul>
                <li>최신 청약 정책 분석 및 가이드</li>
                <li>전월세 계약 관련 법률 및 체크리스트</li>
                <li>정부 지원 금융 상품 정보 업데이트</li>
                <li>이사 및 인테리어 실전 팁</li>
              </ul>
            </motion.div>
          )}

          {currentPage === "privacy" && (
            <motion.div 
              key="privacy-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto px-4 py-20 prose"
            >
              <h1 className="font-display">개인정보 처리방침</h1>
              <p>본 사이트는 사용자의 개인정보 보호를 위해 최선을 다하고 있습니다.</p>
              <h2>제1조 (개인정보의 수집 항목)</h2>
              <p>본 사이트는 별도의 회원가입 없이 이용 가능하며, 서비스 이용 과정에서 쿠키 정보가 자동으로 생성되어 수집될 수 있습니다.</p>
              <h2>제2조 (개인정보의 이용 목적)</h2>
              <p>수집된 정보는 사이트 이용 통계 분석 및 광고 서비스 제공을 위해서만 사용됩니다.</p>
              <h2>제3조 (쿠키의 사용 및 거부)</h2>
              <p>사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
            </motion.div>
          )}

          {currentPage === "admin" && (
            <AdminPanel 
              user={user} 
              onLogin={() => signInWithPopup(auth, new GoogleAuthProvider())} 
              onPostCreated={() => handleNavigate("home")} 
            />
          )}

          {currentPost ? (
            <motion.article
              key="post-detail"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
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
                
                {/* Ad Slot - Top */}
                <div className="w-full h-32 bg-gray-50 rounded-2xl mb-8 flex items-center justify-center border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm font-medium">광고 영역 (Ads by AdSense)</p>
                </div>

                <div className="flex gap-2 mb-6">
                  <Badge className="bg-indigo-600 border-none">{currentPost.category}</Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 text-gray-900 border-l-4 border-indigo-600 pl-6">
                  {currentPost.title}
                </h1>
                <div className="flex items-center justify-between py-6 border-y border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Badge className="bg-gray-400 border-none w-10 h-10 rounded-full p-0 flex items-center justify-center">
                        {currentPost.author[0]}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{currentPost.author}</p>
                      <p className="text-sm text-gray-500">{currentPost.date} · {currentPost.readTime} 읽기</p>
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
                />
              </div>

              <div 
                className="prose prose-indigo prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
              />

              {/* Ad Slot - Middle */}
              <div className="my-12 w-full h-64 bg-gray-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-medium">중간 광고 영역 (In-feed Ads)</p>
              </div>
              
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
          )}
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

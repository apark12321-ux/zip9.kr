
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Loader2, Plus, RefreshCw, Send, CheckCircle2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { generateBlogPost } from "../services/gemini";
import { CATEGORIES } from "../constants";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { motion } from "motion/react";

import { User } from "firebase/auth";
import { LogIn, Rocket } from "lucide-react";

interface AdminPanelProps {
  user: User | null;
  onLogin: () => void;
  onPostCreated: () => void;
}

export function AdminPanel({ user, onLogin, onPostCreated }: AdminPanelProps) {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("청약/분양");
  const [status, setStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!user) {
      setStatus("먼저 로그인해 주세요.");
      return;
    }
    setLoading(true);
    setStatus("AI가 1,500자 이상의 최적화된 콘텐츠를 생성 중입니다...");
    
    try {
      const generatedPost = await generateBlogPost(topic, category);
      
      setStatus("Firestore에 저장 중입니다...");
      
      await addDoc(collection(db, "posts"), {
        title: generatedPost.title,
        excerpt: generatedPost.summary,
        // Adding hashtags to content
        content: `
          ${generatedPost.content}
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #6366f1; font-weight: 600;">
              ${generatedPost.hashtags.map((tag: string) => `#${tag}`).join(" ")}
            </p>
          </div>
        `,
        category: category,
        author: "AI 에디터",
        date: new Date().toISOString().split('T')[0],
        image: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&sig=${Date.now()}`,
        readTime: generatedPost.readTime || "5분"
      });

      setStatus("성공적으로 발행되었습니다!");
      setTimeout(() => {
        onPostCreated();
      }, 1500);
    } catch (error) {
      console.error("Generate error:", error);
      setStatus("생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      {!user ? (
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <LogIn className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4 font-display">AI 에디터 액세스</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            최적화된 블로그 포스트를 발행하려면 로그인이 필요합니다.
          </p>
          <Button 
            size="lg" 
            className="rounded-full px-10 h-14 bg-indigo-600 hover:bg-indigo-700 font-bold"
            onClick={onLogin}
          >
            Google로 로그인하기
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display">새 포스팅 발행 (AI 에디터)</h2>
            <p className="text-gray-500">1,500자 이상의 애드센스 최적화 콘텐츠를 자동으로 생성합니다.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">포스팅 주제</label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 2026년 청약 제도 완벽 가이드"
              className="w-full px-6 py-4 rounded-2xl border-gray-200 focus:border-indigo-600 focus:ring-indigo-600 shadow-sm text-lg"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">카테고리 선택</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    category === cat 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-105" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  disabled={loading}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button 
              size="lg" 
              className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-xl shadow-indigo-100 group transition-all"
              onClick={handleGenerate}
              disabled={loading || !topic}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-3 w-6 h-6 animate-spin" />
                  콘텐츠 생성 중...
                </>
              ) : (
                <>
                  <Send className="mr-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  최적화된 포스팅 발행하기
                </>
              )}
            </Button>
          </div>

          {status && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium ${
                status.includes("오류") ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-700"
              }`}
            >
              {status.includes("성공") ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
              {status}
            </motion.div>
          )}
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
            AI 생성 지침 (애드센스 최적화)
          </h4>
          <ul className="text-sm text-gray-500 space-y-2 font-medium">
            <li>• 실전 팁 및 체크리스트가 포함된 1,500자 이상의 풍부한 분량 (공백 제외)</li>
            <li>• 가독성을 높이는 H2, H3 헤더 구조화 및 짧은 단락 구성</li>
            <li>• 자연스러운 키워드 배치 및 포스팅 마지막 해시태그 삽입</li>
            <li>• AdSense 광고 배치를 위한 효과적인 레이아웃 구조 활용</li>
          </ul>
        </div>

        <div className="mt-6 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
          <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Blog Studio 연동 정보
          </h4>
          <div className="space-y-4 text-sm">
            <div className="bg-white p-3 rounded-xl border border-indigo-100">
              <p className="text-xs text-indigo-400 font-bold uppercase mb-1">API Endpoint</p>
              <code className="text-indigo-700 break-all">{window.location.origin}/api/posts</code>
            </div>
            <p className="text-gray-500 leading-relaxed">
              외부 서비스(Blog Studio 등)에서 위 엔드포인트로 포스팅을 직접 발행할 수 있도록 설정되었습니다. 
              API 키가 설정된 경우 헤더에 <code className="bg-indigo-100 px-1 rounded text-indigo-700">x-api-key</code>를 포함하세요.
            </p>
          </div>
        </div>
      </div>
    )}
    </motion.div>
  );
}

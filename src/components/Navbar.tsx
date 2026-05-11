
import { useState, useEffect } from "react";
import { Search, Menu, X, Landmark, Home, FileText, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  onSearch: (query: string) => void;
  onNavigate: (page: string) => void;
}

export function Navbar({ onSearch, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate("home")}
            id="site-logo"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Home className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">
              하우징허브
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate("category-청약/분양")} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">청약/분양</button>
            <button onClick={() => onNavigate("category-전월세")} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">전월세</button>
            <button onClick={() => onNavigate("category-이사/인테리어")} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">이사/인테리어</button>
            <button onClick={() => onNavigate("category-대출/금융")} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">대출/금융</button>
            <button onClick={() => onNavigate("admin")} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5" />
              AI 에디터
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600" />
              <Input 
                className="pl-9 bg-gray-100 border-none focus-visible:ring-1 focus-visible:ring-indigo-600 w-40 md:w-64" 
                placeholder="검색어를 입력하세요..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b absolute top-full left-0 right-0 shadow-lg"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <button onClick={() => { onNavigate("category-청약/분양"); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-left">청약/분양</button>
              <button onClick={() => { onNavigate("category-전월세"); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-left">전월세</button>
              <button onClick={() => { onNavigate("category-이사/인테리어"); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-left">이사/인테리어</button>
              <button onClick={() => { onNavigate("category-대출/금융"); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-left">대출/금융</button>
              <button onClick={() => { onNavigate("admin"); setIsMobileMenuOpen(false); }} className="text-lg font-bold text-indigo-600 text-left flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5" />
                AI 에디터 (포스팅 발행)
              </button>
              <div className="pt-4 border-t">
                <Input 
                  className="bg-gray-100" 
                  placeholder="검색..."
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

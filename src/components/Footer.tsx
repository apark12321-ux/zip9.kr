
import { Home, Mail, Phone, MapPin, Globe } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t pt-16 pb-8 mt-20" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate("home")}>
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <Home className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900 font-display">
                하우징허브
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              대한민국 최고의 주거 정보 가이드. 
              복잡한 부동산의 모든 것을 쉽고 정확하게 
              전해드리는 것이 우리의 목표입니다.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-6">주요 카테고리</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate("category-청약/분양")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">청약/분양 가이드</button></li>
              <li><button onClick={() => onNavigate("category-전월세")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">전월세 계약 팁</button></li>
              <li><button onClick={() => onNavigate("category-이사/인테리어")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">이사/인테리어</button></li>
              <li><button onClick={() => onNavigate("category-대출/금융")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">주거 대출/금융</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">사이트 정보</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate("about")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">회사 소개</button></li>
              <li><button onClick={() => onNavigate("privacy")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">이용 약관</button></li>
              <li><button onClick={() => onNavigate("privacy")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">개인정보 처리방침</button></li>
              <li><button className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">광고 문의</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">고객 지원</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <Mail className="w-4 h-4" /> contact@zip9.kr
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <Globe className="w-4 h-4" /> www.zip9.kr
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <MapPin className="w-4 h-4" /> 서울특별시 강남구 테헤란로
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {currentYear} HousingHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-400 cursor-pointer hover:text-indigo-600 font-medium" onClick={() => onNavigate("privacy")}>개인정보 처리방침</span>
            <span className="text-xs text-gray-400 cursor-pointer hover:text-indigo-600 font-medium" onClick={() => onNavigate("privacy")}>이용약관</span>
            <span className="text-xs text-gray-400 cursor-pointer hover:text-indigo-600 font-medium">쿠키 정책</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


import { Home, Mail, Phone, MapPin, Globe } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t pt-16 pb-12 mt-20" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="col-span-1 md:col-span-5">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate("home")}>
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <Home className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 font-display">
                하우징허브 (HousingHub)
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">
              하우징허브는 복잡하고 어려운 부동산 정보를 누구나 쉽게 이해할 수 있도록 정리해 드리는 디지털 주거 가이드입니다. 
              최신 청약 정책, 전월세 계약 노하우, 정부 대출 상품 정보를 가장 정확하고 빠르게 전달하는 것을 목표로 합니다.
              회원가입 없이 모든 정보는 무료로 제공됩니다.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> apark12321@gmail.com</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> 서울특별시 강남구 테헤란로</span>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">주요 카테고리</h4>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate("category-청약/분양")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">청약/분양 가이드</button></li>
              <li><button onClick={() => onNavigate("category-전월세")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">전월세 계약 팁</button></li>
              <li><button onClick={() => onNavigate("category-이사/인테리어")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">이사/인테리어</button></li>
              <li><button onClick={() => onNavigate("category-대출/금융")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">주거 대출/금융</button></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">서비스 정보</h4>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate("about")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">하우징허브 소개</button></li>
              <li><button onClick={() => onNavigate("privacy")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">이용 약관</button></li>
              <li><button onClick={() => onNavigate("privacy")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">개인정보 처리방침</button></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h4 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">면책 고지</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
              본 사이트에서 제공하는 모든 정보는 일반적인 정보 제공만을 목적으로 하며, 법적인 권고나 자문을 대신할 수 없습니다. 
              정확한 정보 전달을 위해 노력하고 있으나, 실제 계약이나 청약 신청 전에는 반드시 관련 법규 및 공식 기관(청약홈, 주택도시기금 등)의 공지사항을 재확인하시기 바랍니다. 
              본 사이트의 정보를 신뢰하여 발생한 결과에 대해 운영진은 어떠한 책임도 지지 않습니다.
            </p>
          </div>
        </div>
        
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] text-gray-400 font-medium mb-1 capitalize">
                하우징허브 | 운영: 알고파트너스 | 대표메일: apark12321@gmail.com
              </p>
              <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                &copy; {currentYear} HousingHub. Built for smart housing life. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-[11px] text-gray-500 cursor-pointer hover:text-indigo-600 font-semibold" onClick={() => onNavigate("privacy")}>Privacy Policy</span>
              <span className="text-[11px] text-gray-500 cursor-pointer hover:text-indigo-600 font-semibold" onClick={() => onNavigate("privacy")}>Terms of Service</span>
              <span className="text-[11px] text-gray-500 cursor-pointer hover:text-indigo-600 font-semibold">Cookie Settings</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

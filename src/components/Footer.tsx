
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
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-200">
                <Home className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-gray-900 font-display leading-none">
                  하우징허브
                </span>
                <span className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase mt-0.5">Housing Hub</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 font-normal">
              하우징허브는 복잡한 대한민국 부동산 정책과 금융 정보를 누구나 쉽게 이해할 수 있도록 돕는 디지털 가이드입니다. 
              올바른 정보가 주거 안정을 만든다는 믿음으로, 검증된 데이터 기반의 콘텐츠를 제작합니다.
            </p>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                <span>인천광역시 서구 청라커낼로 270, 커낼힐스빌</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gray-300 shrink-0" />
                <a href="mailto:apark12321@gmail.com" className="hover:text-indigo-600 transition-colors">apark12321@gmail.com</a>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-sm text-gray-900 mb-6 relative inline-block">
              지식 저장소
              <span className="absolute -bottom-1 left-0 w-4 h-0.5 bg-indigo-600 rounded-full"></span>
            </h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate("category-청약/분양")} className="text-sm text-gray-500 hover:text-indigo-600 transition-all hover:pl-1">청약·분양 전략</button></li>
              <li><button onClick={() => onNavigate("category-전월세")} className="text-sm text-gray-500 hover:text-indigo-600 transition-all hover:pl-1">전월세 계약 노하우</button></li>
              <li><button onClick={() => onNavigate("category-이사/인테리어")} className="text-sm text-gray-500 hover:text-indigo-600 transition-all hover:pl-1">이사·인테리어 가이드</button></li>
              <li><button onClick={() => onNavigate("category-대출/금융")} className="text-sm text-gray-500 hover:text-indigo-600 transition-all hover:pl-1">금융·대출 솔루션</button></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-sm text-gray-900 mb-6 relative inline-block">
              고객지원
              <span className="absolute -bottom-1 left-0 w-4 h-0.5 bg-indigo-600 rounded-full"></span>
            </h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate("about")} className="text-sm text-gray-500 hover:text-indigo-600 transition-all hover:pl-1">하우징허브 소개</button></li>
              <li><button onClick={() => onNavigate("announcement")} className="text-sm text-gray-500 hover:text-indigo-600 transition-all hover:pl-1">공지사항</button></li>
              <li><button onClick={() => onNavigate("partnership")} className="text-sm text-gray-500 hover:text-indigo-600 transition-all hover:pl-1">제휴 및 비즈니스 문의</button></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                면책 공고 (Legal Disclaimer)
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                하우징허브의 모든 콘텐츠는 정보 전달을 목적으로 하며, 실제 의사 결정 시에는 반드시 해당 분야 전문가와의 상담 또는 공공기관의 공식 자료를 확인하시기 바랍니다. 
                정보의 오류로 인한 이용자의 손실에 대해 당사는 법적 책임을 지지 않습니다.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 mb-2">
                <span className="text-[11px] text-gray-400">운영: 알고파트너스 / 대표: 박예준</span>
                <span className="text-[11px] text-gray-400">대표: 박성준 (편집책임자)</span>
                <span className="text-[11px] text-gray-400">이메일: apark12321@gmail.com</span>
                <span className="text-[11px] text-gray-400">개인 블로그/정보 서비스 (사업자 등록 준비 중)</span>
              </div>
              <p className="text-[10px] text-gray-400 tracking-tight">
                &copy; {currentYear} HousingHub. Smart Housing Life Guide. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[11px] text-gray-500 cursor-pointer hover:text-indigo-700 transition-colors font-bold border-b border-indigo-200" onClick={() => onNavigate("privacy")}>개인정보처리방침</span>
              <span className="text-[11px] text-gray-500 cursor-pointer hover:text-indigo-700 transition-colors font-medium border-b border-transparent hover:border-indigo-200" onClick={() => onNavigate("terms")}>이용약관</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

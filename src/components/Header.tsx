import React from 'react';
import { Sparkles, History, ShoppingBag, CreditCard, User, UploadCloud, Home, Stethoscope, LogOut } from 'lucide-react';
import { User as UserType, UsageInfo } from '../types';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserType | null;
  usage: UsageInfo | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  usage,
  onOpenAuth
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fbfaf7]/95 backdrop-blur-md border-b border-[#e7e5df]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between">
        {/* Brand matching DuongNhan.Web */}
        <div 
          onClick={() => onSelectTab('home')}
          className="dn-brand cursor-pointer select-none group"
        >
          <span className="dn-brand-mark group-hover:scale-105 transition-transform">✚</span>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xl text-slate-900 tracking-tight">Dưỡng Nhan</span>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-[#fff0ec] text-[#f07c68] px-1.5 py-0.5 rounded-full border border-[#f07c68]/20">AI</span>
          </div>
        </div>

        {/* Navigation Tabs matching DuongNhan.Web - Clean typography without icon clutter */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'text-slate-900 font-bold bg-[#f4f3ef]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#f4f3ef]/60'
            }`}
          >
            Trang chủ
          </button>
          
          <button
            onClick={() => onSelectTab('upload')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'upload'
                ? 'text-[#f07c68] font-bold bg-[#fff0ec]'
                : 'text-slate-600 hover:text-[#f07c68] hover:bg-[#f4f3ef]/60'
            }`}
          >
            AI Scan Da
          </button>

          {/* Dermatologist page temporarily commented out per request
          <button
            onClick={() => onSelectTab('doctors')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'doctors'
                ? 'text-[#238b83] font-bold bg-[#e9f7f5]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#f4f3ef]/60'
            }`}
          >
            Bác sĩ
          </button>
          */}

          <button
            onClick={() => onSelectTab('products')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'products'
                ? 'text-slate-900 font-bold bg-[#f4f3ef]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#f4f3ef]/60'
            }`}
          >
            <span>Sản phẩm</span>
            <span className="bg-[#ee4d2d] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              Shopee Mall
            </span>
          </button>

          <button
            onClick={() => onSelectTab('pricing')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'pricing'
                ? 'text-slate-900 font-bold bg-[#f4f3ef]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#f4f3ef]/60'
            }`}
          >
            Bảng giá
          </button>

          {/* Skin scan history section hidden for logged-out state per request */}
          {user && !user.isGuest && user.email !== 'guest@duongnhan.ai' && (
            <button
              onClick={() => onSelectTab('history')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'history'
                  ? 'text-slate-900 font-bold bg-[#f4f3ef]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#f4f3ef]/60'
              }`}
            >
              Lịch sử
            </button>
          )}
        </nav>

        {/* Auth / Profile Actions matching DuongNhan.Web buttons */}
        <div className="flex items-center gap-2.5">
          {usage && (
            <div 
              onClick={() => onSelectTab('pricing')}
              title="Lượt quét AI trong tháng"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#f4f3ef] border border-[#e7e5df] hover:border-slate-300 cursor-pointer rounded-full text-xs text-slate-700 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#238b83] animate-pulse"></div>
              <span>Lượt quét: <strong className="text-slate-900">{usage.scansUsedThisMonth}/{usage.scansLimit}</strong></span>
            </div>
          )}

          {user && !user.isGuest && user.email !== 'guest@duongnhan.ai' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectTab('profile')}
                className="btn-dn-dark px-4 py-2 rounded-full text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#f07c68] text-white flex items-center justify-center text-[10px] font-black">
                  {user.displayName ? user.displayName.slice(0, 1) : 'U'}
                </div>
                <span className="truncate max-w-[110px]">{user.displayName}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-dn-outline px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn-dn-coral px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs cursor-pointer"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav bar matching DuongNhan.Web mobile nav */}
      <div className="md:hidden flex items-center justify-between border-t border-[#e7e5df] py-2 px-3 bg-[#fbfaf7] overflow-x-auto text-xs gap-1">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg shrink-0 ${currentTab === 'home' ? 'text-[#f07c68] font-bold' : 'text-slate-600'}`}
        >
          <Home className="w-4 h-4" />
          <span>Trang chủ</span>
        </button>
        <button
          onClick={() => onSelectTab('upload')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg shrink-0 ${currentTab === 'upload' ? 'text-[#f07c68] font-bold' : 'text-slate-600'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Scan</span>
        </button>
        {/* Doctors mobile tab temporarily commented out per request
        <button
          onClick={() => onSelectTab('doctors')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg shrink-0 ${currentTab === 'doctors' ? 'text-[#238b83] font-bold' : 'text-slate-600'}`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Bác sĩ</span>
        </button>
        */}
        <button
          onClick={() => onSelectTab('products')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg shrink-0 ${currentTab === 'products' ? 'text-[#ee4d2d] font-bold' : 'text-slate-600'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Sản phẩm</span>
        </button>
        <button
          onClick={() => onSelectTab('pricing')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg shrink-0 ${currentTab === 'pricing' ? 'text-[#f07c68] font-bold' : 'text-slate-600'}`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Bảng giá</span>
        </button>
      </div>
    </header>
  );
};

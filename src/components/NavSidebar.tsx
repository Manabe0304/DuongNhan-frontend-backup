import React from 'react';
import { User, UsageInfo } from '../types';
import { 
  Home, 
  Sparkles, 
  Stethoscope, 
  ShoppingBag, 
  ClipboardList, 
  History, 
  CreditCard, 
  UserCheck, 
  LogOut, 
  ChevronRight,
  Zap,
  X
} from 'lucide-react';

interface NavSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User;
  usage: UsageInfo | null;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const NavSidebar: React.FC<NavSidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  usage,
  onLogout,
  isOpenMobile = false,
  onCloseMobile
}) => {
  // Clean single-icon menu items without emoji clutter
  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'upload', label: 'AI Scan Da', icon: Sparkles, highlight: true },
    // { id: 'doctors', label: 'Bác sĩ da liễu', icon: Stethoscope }, /* Temporarily commented out per request */
    { id: 'products', label: 'Sản phẩm & Shopee', icon: ShoppingBag, badge: 'Mall' },
    { id: 'recommendations', label: 'Phác đồ điều trị', icon: ClipboardList },
    { id: 'history', label: 'Lịch sử phân tích', icon: History },
    { id: 'pricing', label: 'Bảng giá gói', icon: CreditCard },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: UserCheck },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const isPro = user.planCode === 'plan_pro' || user.planCode === 'plan_vip';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-[#14171f]/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* 
        Fixed Sidebar:
        Stays permanently anchored on the left viewport while page scrolls
      */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#14171f] text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Brand Header */}
        <div className="h-[70px] px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div 
            onClick={() => handleItemClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <span className="dn-brand-mark group-hover:scale-105 transition-transform">✚</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">Dưỡng Nhan</span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#f07c68]/20 text-[#f07c68] px-1.5 py-0.2 rounded-full border border-[#f07c68]/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400">Skin Intelligence</p>
            </div>
          </div>

          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Mini Profile Card (Logged-in state) */}
        <div className="p-3.5 mx-3 my-3 bg-[#1c202a] border border-slate-800/80 rounded-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#f07c68] to-[#238b83] flex items-center justify-center text-white font-black text-xs uppercase shadow-xs shrink-0">
              {user.displayName ? user.displayName.slice(0, 2) : 'DN'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate max-w-[110px]">
                  {user.displayName}
                </h4>
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                  isPro ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isPro ? 'Pro' : 'Free'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Quota bar */}
          {usage && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px]">
              <div className="flex justify-between items-center text-slate-400 mb-1 text-[10px]">
                <span>Lượt scan AI:</span>
                <span className="font-bold text-slate-200">
                  {usage.scansUsedThisMonth}/{usage.scansLimit}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#238b83] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (usage.scansUsedThisMonth / usage.scansLimit) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu (Reduced icons, clean typography) */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1.5">
            Danh mục
          </div>

          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer text-left
                  ${isActive
                    ? 'bg-[#f07c68] text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#ee4d2d] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f07c68]"></span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 opacity-90" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3.5 border-t border-slate-800 space-y-2 shrink-0">
          {!isPro && (
            <button
              onClick={() => handleItemClick('pricing')}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-500/25 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Nâng cấp gói Pro</span>
            </button>
          )}

          <div className="flex items-center justify-between pt-0.5">
            <button
              onClick={() => handleItemClick('profile')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Cài đặt</span>
            </button>

            <button
              onClick={onLogout}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

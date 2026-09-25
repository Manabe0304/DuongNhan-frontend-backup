import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NavSidebar } from './components/NavSidebar';
import { HomeView } from './components/HomeView';
import { UploadSection } from './components/UploadSection';
import { DiagnosisView } from './components/DiagnosisView';
import { RecommendationsView } from './components/RecommendationsView';
import { HistoryView } from './components/HistoryView';
import { ProductsView } from './components/ProductsView';
import { DoctorsView } from './components/DoctorsView';
import { PricingView } from './components/PricingView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { User, UsageInfo, Diagnosis } from './types';
import { Menu, Sparkles, User as UserIcon, LogOut } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUsage, setCurrentUsage] = useState<UsageInfo | null>(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState<Diagnosis | null>(null);
  const [activeDiagnosisIdForRecs, setActiveDiagnosisIdForRecs] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Fetch initial user and usage info
  const refreshUserAndUsage = async () => {
    try {
      const [userRes, usageRes] = await Promise.all([
        fetch('/api/users/me'),
        fetch('/api/subscriptions/usage')
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData);
      }
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setCurrentUsage(usageData);
      }
    } catch (err) {
      console.error('Failed to load user session data:', err);
    }
  };

  useEffect(() => {
    refreshUserAndUsage();
  }, []);

  const handleDiagnosisComplete = (diagnosis: Diagnosis) => {
    setActiveDiagnosis(diagnosis);
    setActiveDiagnosisIdForRecs(diagnosis.id);
    setCurrentTab('diagnosis');
    refreshUserAndUsage();
  };

  const handleViewRecommendations = (diagnosisId: string) => {
    setActiveDiagnosisIdForRecs(diagnosisId);
    setCurrentTab('recommendations');
  };

  const handleSelectHistoryDiagnosis = (diagnosis: Diagnosis) => {
    setActiveDiagnosis(diagnosis);
    setActiveDiagnosisIdForRecs(diagnosis.id);
    setCurrentTab('diagnosis');
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await refreshUserAndUsage();
      setCurrentTab('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Determine logged-in vs logged-out state
  const isAuthenticated = Boolean(
    currentUser && 
    !currentUser.isGuest && 
    currentUser.email !== 'guest@duongnhan.ai'
  );

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'home': return 'Trang chủ';
      case 'upload': return 'AI Scan Da';
      case 'diagnosis': return 'Kết quả phân tích da';
      case 'recommendations': return 'Phác đồ điều trị';
      // case 'doctors': return 'Bác sĩ da liễu'; /* Temporarily removed per request */
      case 'products': return 'Sản phẩm & Shopee Mall';
      case 'pricing': return 'Bảng giá gói quét';
      case 'history': return 'Lịch sử phân tích';
      case 'profile': return 'Hồ sơ cá nhân & Cài đặt';
      default: return 'Dưỡng Nhan AI';
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900 flex flex-col font-sans">
      {/* 
        LOGGED-IN STATE:
        Features the persistent sidebar from the Drive file (NavMenu.razor)
        plus user profile editing section.
      */}
      {isAuthenticated && currentUser ? (
        <div className="min-h-screen flex flex-row">
          {/* Drive Sidebar */}
          <NavSidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            user={currentUser}
            usage={currentUsage}
            onLogout={handleLogout}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Dashboard Content Area (offset by fixed 72-width sidebar on desktop) */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
            {/* Topbar in Authenticated Layout */}
            <header className="sticky top-0 z-30 bg-[#fbfaf7]/95 backdrop-blur-md border-b border-[#e7e5df] h-[65px] px-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-[#f4f3ef] transition-colors"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Dưỡng Nhan /</span>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {getPageTitle(currentTab)}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {currentUsage && (
                  <div 
                    onClick={() => setCurrentTab('pricing')}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f4f3ef] border border-[#e7e5df] rounded-full text-xs text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#238b83] animate-pulse"></span>
                    <span>Lượt quét: <strong className="text-slate-900">{currentUsage.scansUsedThisMonth}/{currentUsage.scansLimit}</strong></span>
                  </div>
                )}

                <button
                  onClick={() => {
                    setCurrentTab('upload');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-dn-coral px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Scan da mới</span>
                </button>

                {/* Profile Pill Trigger */}
                <button
                  onClick={() => {
                    setCurrentTab('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    currentTab === 'profile'
                      ? 'bg-[#14171f] text-white border-[#14171f]'
                      : 'bg-white border-[#e7e5df] text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#f07c68] text-white flex items-center justify-center text-[10px] font-black uppercase">
                    {currentUser.displayName ? currentUser.displayName.slice(0, 1) : 'U'}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[90px] hidden sm:inline">
                    {currentUser.displayName}
                  </span>
                </button>
              </div>
            </header>

            {/* Active Page View */}
            <main className="flex-1">
              {currentTab === 'home' && (
                <HomeView
                  onStartScan={() => setCurrentTab('upload')}
                  onViewHistory={() => setCurrentTab('history')}
                  onViewProducts={() => setCurrentTab('products')}
                  recentDiagnosis={activeDiagnosis}
                  isLoggedIn={true}
                />
              )}

              {currentTab === 'upload' && (
                <UploadSection onDiagnosisComplete={handleDiagnosisComplete} />
              )}

              {currentTab === 'diagnosis' && activeDiagnosis && (
                <DiagnosisView
                  diagnosis={activeDiagnosis}
                  onViewRecommendations={handleViewRecommendations}
                  onNewScan={() => setCurrentTab('upload')}
                />
              )}

              {currentTab === 'recommendations' && (
                <RecommendationsView
                  diagnosisId={activeDiagnosisIdForRecs}
                  onBackToDiagnosis={() => {
                    if (activeDiagnosis) setCurrentTab('diagnosis');
                    else setCurrentTab('upload');
                  }}
                  onNavigateToProducts={() => setCurrentTab('products')}
                />
              )}

              {currentTab === 'history' && (
                <HistoryView
                  onSelectDiagnosis={handleSelectHistoryDiagnosis}
                  onNewScan={() => setCurrentTab('upload')}
                />
              )}

              {currentTab === 'products' && <ProductsView />}

              {/* Dermatologist page temporarily commented out per request
              {currentTab === 'doctors' && (
                <DoctorsView onStartScan={() => setCurrentTab('upload')} />
              )}
              */}

              {currentTab === 'pricing' && (
                <PricingView
                  user={currentUser}
                  usage={currentUsage}
                  onPlanUpgraded={refreshUserAndUsage}
                />
              )}

              {/* User Profile Editing Section */}
              {currentTab === 'profile' && (
                <ProfileView
                  user={currentUser}
                  usage={currentUsage}
                  onUpdateUser={(updated) => {
                    setCurrentUser(updated);
                  }}
                  onUpgradePlan={() => setCurrentTab('pricing')}
                  onStartScan={() => setCurrentTab('upload')}
                />
              )}
            </main>

            <Footer onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </div>
        </div>
      ) : (
        /* 
          LOGGED-OUT STATE:
          Full-width public presentation layout with top navbar Header (no sidebar)
        */
        <div className="min-h-screen flex flex-col">
          <Header
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            user={currentUser}
            usage={currentUsage}
            onOpenAuth={handleOpenAuth}
          />

          <main className="flex-1">
            {currentTab === 'home' && (
              <HomeView
                onStartScan={() => setCurrentTab('upload')}
                onViewHistory={() => handleOpenAuth('login')}
                onViewProducts={() => setCurrentTab('products')}
                recentDiagnosis={null}
                isLoggedIn={false}
              />
            )}

            {currentTab === 'upload' && (
              <UploadSection onDiagnosisComplete={handleDiagnosisComplete} />
            )}

            {currentTab === 'diagnosis' && activeDiagnosis && (
              <DiagnosisView
                diagnosis={activeDiagnosis}
                onViewRecommendations={handleViewRecommendations}
                onNewScan={() => setCurrentTab('upload')}
              />
            )}

            {currentTab === 'recommendations' && (
              <RecommendationsView
                diagnosisId={activeDiagnosisIdForRecs}
                onBackToDiagnosis={() => {
                  if (activeDiagnosis) setCurrentTab('diagnosis');
                  else setCurrentTab('upload');
                }}
                onNavigateToProducts={() => setCurrentTab('products')}
              />
            )}

            {/* Skin scan history section hidden for logged-out state per request */}
            {currentTab === 'history' && (
              <div className="max-w-md mx-auto px-4 py-24 text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#fff0ec] text-[#f07c68] flex items-center justify-center mx-auto mb-4 font-black text-xl">
                  🔒
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Đăng nhập để xem lịch sử quét</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  Lịch sử phân tích hình ảnh và phác đồ điều trị được bảo mật riêng cho từng tài khoản thành viên Dưỡng Nhan.
                </p>
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="btn-dn-coral px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                >
                  Đăng nhập tài khoản
                </button>
              </div>
            )}

            {currentTab === 'products' && <ProductsView />}

            {/* Dermatologist page temporarily commented out per request
            {currentTab === 'doctors' && (
              <DoctorsView onStartScan={() => setCurrentTab('upload')} />
            )}
            */}

            {currentTab === 'pricing' && (
              <PricingView
                user={currentUser}
                usage={currentUsage}
                onPlanUpgraded={refreshUserAndUsage}
              />
            )}
          </main>

          <Footer onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        </div>
      )}

      {/* Authentication Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          refreshUserAndUsage();
          // Upon successful registration or login, switch directly into the dashboard!
          setCurrentTab('profile');
        }}
        onLogoutSuccess={() => {
          refreshUserAndUsage();
          setCurrentTab('home');
        }}
        onNavigateToProfile={() => {
          setCurrentTab('profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;

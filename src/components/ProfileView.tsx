import React, { useState, useEffect } from 'react';
import { User, UsageInfo } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  CreditCard, 
  Calendar,
  Save,
  KeyRound
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  usage: UsageInfo | null;
  onUpdateUser: (updatedUser: User) => void;
  onUpgradePlan: () => void;
  onStartScan: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  usage,
  onUpdateUser,
  onUpgradePlan,
  onStartScan
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'password'>('profile');

  // Profile Form state
  const [displayName, setDisplayName] = useState<string>(user.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber || '');
  const [skinType, setSkinType] = useState<string>(user.skinType || 'Da hỗn hợp thiên dầu');
  const [skinConcerns, setSkinConcerns] = useState<string[]>(user.skinConcerns || ['Mụn trứng cá', 'Lỗ chân lông to']);
  const [bio, setBio] = useState<string>(user.bio || '');

  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [savingPassword, setSavingPassword] = useState<boolean>(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(user.displayName || '');
    setPhoneNumber(user.phoneNumber || '');
    if (user.skinType) setSkinType(user.skinType);
    if (user.skinConcerns) setSkinConcerns(user.skinConcerns);
    if (user.bio) setBio(user.bio);
  }, [user]);

  const allConcerns = [
    'Mụn trứng cá',
    'Lỗ chân lông to',
    'Thâm sau mụn (PIH)',
    'Sạm nám (Melasma)',
    'Ửng đỏ & Giãn mao mạch',
    'Da khô rát bong tróc',
    'Lão hóa & Nếp nhăn'
  ];

  const toggleConcern = (concern: string) => {
    if (skinConcerns.includes(concern)) {
      setSkinConcerns(skinConcerns.filter((c) => c !== concern));
    } else {
      setSkinConcerns([...skinConcerns, concern]);
    }
  };

  // Submit Profile Form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          phoneNumber,
          skinType,
          skinConcerns,
          bio
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Cập nhật hồ sơ thất bại.');
      }

      onUpdateUser(data);
      setProfileSuccessMsg('Hồ sơ cá nhân và thông tin da liễu đã được lưu thành công!');
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Có lỗi xảy ra khi lưu.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Submit Password Form
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg(null);
    setPasswordErrorMsg(null);

    if (newPassword.length < 6) {
      setPasswordErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đổi mật khẩu thất bại.');
      }

      setPasswordSuccessMsg('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(null), 4000);
    } catch (err: any) {
      setPasswordErrorMsg(err.message || 'Có lỗi xảy ra.');
    } finally {
      setSavingPassword(false);
    }
  };

  const isPro = user.planCode === 'plan_pro' || user.planCode === 'plan_vip';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Heading matching DuongNhan.Web */}
      <div className="mb-8">
        <span className="dn-kicker">Tài khoản & Hồ sơ da</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">
          Hồ sơ cá nhân &amp; Cài đặt
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Quản lý thông tin cá nhân, cập nhật loại da để hệ thống AI đề xuất phác đồ chính xác hơn và bảo mật tài khoản.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: User Overview Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#e7e5df] rounded-3xl p-6 shadow-xs text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-linear-to-tr from-[#f07c68] to-[#238b83] text-white flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-sm">
              {displayName ? displayName.slice(0, 2).toUpperCase() : 'DN'}
            </div>

            <h3 className="font-extrabold text-lg text-slate-900 truncate">
              {displayName || 'Người dùng Dưỡng Nhan'}
            </h3>
            <p className="text-xs text-slate-500 truncate mb-3">
              {user.email}
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fff0ec] text-[#f07c68] border border-[#f07c68]/20 mb-5">
              <span>{isPro ? '★ Gói Pro Cao Cấp' : 'Gói Miễn Phí (Free)'}</span>
            </div>

            {/* Quick Stats */}
            <div className="border-t border-[#e7e5df] pt-4 grid grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-[#f4f3ef] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Lượt scan đã dùng</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {usage ? `${usage.scansUsedThisMonth} / ${usage.scansLimit}` : '0 / 5'}
                </span>
              </div>
              <div className="p-3 bg-[#f4f3ef] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Loại da khai báo</span>
                <span className="text-xs font-bold text-[#238b83] mt-0.5 block truncate">
                  {skinType}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={onStartScan}
                className="w-full py-2.5 rounded-xl btn-dn-coral text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan da với AI ngay</span>
              </button>
              {!isPro && (
                <button
                  onClick={onUpgradePlan}
                  className="w-full py-2.5 rounded-xl btn-dn-outline text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-600" />
                  <span>Nâng cấp gói quét</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-[#eff9f7] border border-[#238b83]/30 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed">
            <div className="font-bold text-[#238b83] flex items-center gap-1.5 mb-1">
              <Shield className="w-4 h-4" />
              Bảo mật y tế &amp; Dữ liệu
            </div>
            Hình ảnh quét và thông tin da liễu của bạn được mã hóa an toàn và chỉ sử dụng cho mục đích phân tích lâm sàng.
          </div>
        </div>

        {/* Right Side: Tab Content (Profile Form / Change Password) */}
        <div className="lg:col-span-8 bg-white border border-[#e7e5df] rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Sub-tabs header */}
          <div className="flex items-center gap-3 border-b border-[#e7e5df] pb-4 mb-6">
            <button
              onClick={() => setActiveSubTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'profile'
                  ? 'btn-dn-dark text-white shadow-xs'
                  : 'text-slate-600 hover:bg-[#f4f3ef]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Thông tin cá nhân</span>
            </button>
            <button
              onClick={() => setActiveSubTab('password')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'password'
                  ? 'btn-dn-dark text-white shadow-xs'
                  : 'text-slate-600 hover:bg-[#f4f3ef]'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Đổi mật khẩu</span>
            </button>
          </div>

          {/* Tab 1: Profile Editing (Matches ProfileForm.razor) */}
          {activeSubTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {profileSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}
              {profileErrorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-transparent rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#238b83] transition-all"
                />
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed select-none"
                />
                <small className="text-[11px] text-slate-500 mt-1 block">
                  Email không thể thay đổi sau khi đăng ký tài khoản.
                </small>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+84 90 123 4567"
                  className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-transparent rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#238b83] transition-all"
                />
              </div>

              {/* Skin Type */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Loại da chính của bạn
                </label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-transparent rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#238b83] transition-all"
                >
                  <option value="Da dầu mụn">Da dầu mụn (Oily &amp; Acne-prone)</option>
                  <option value="Da hỗn hợp thiên dầu">Da hỗn hợp thiên dầu (Combination Oily)</option>
                  <option value="Da hỗn hợp thiên khô">Da hỗn hợp thiên khô (Combination Dry)</option>
                  <option value="Da khô">Da khô &amp; mất nước (Dry &amp; Dehydrated)</option>
                  <option value="Da nhạy cảm kích ứng">Da nhạy cảm kích ứng (Sensitive)</option>
                  <option value="Da thường khỏe mạnh">Da thường khỏe mạnh (Normal)</option>
                </select>
              </div>

              {/* Skin Concerns Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Vấn đề da bạn đang quan tâm nhất
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {allConcerns.map((concern) => {
                    const isSelected = skinConcerns.includes(concern);
                    return (
                      <button
                        type="button"
                        key={concern}
                        onClick={() => toggleConcern(concern)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#238b83] text-white shadow-xs'
                            : 'bg-[#f4f3ef] text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {concern}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio / Skin Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Ghi chú hoặc tiểu sử chăm sóc da
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ví dụ: Từng dùng kem trộn hoặc kích ứng với cồn/hương liệu..."
                  className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-transparent rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#238b83] transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-[#e7e5df]">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-dn-coral px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Change Password (Matches ChangePassword.razor) */}
          {activeSubTab === 'password' && (
            <form onSubmit={handleSavePassword} className="space-y-5 max-w-md">
              {passwordSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}
              {passwordErrorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-transparent rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#238b83] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-transparent rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#238b83] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-transparent rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#238b83] transition-all"
                />
              </div>

              <div className="pt-3 border-t border-[#e7e5df]">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="btn-dn-coral px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{savingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

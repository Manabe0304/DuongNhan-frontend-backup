import React, { useState, useEffect } from 'react';
import { Plan, User as UserType, UsageInfo } from '../types';
import { CreditCard, Check, Sparkles, Shield, Zap } from 'lucide-react';

interface PricingViewProps {
  user: UserType | null;
  usage: UsageInfo | null;
  onPlanUpgraded: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  user,
  usage,
  onPlanUpgraded
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [upgradingCode, setUpgradingCode] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/plans');
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
        }
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (planCode: string) => {
    setUpgradingCode(planCode);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planCode })
      });
      if (res.ok) {
        setSuccessMsg(`Đã cập nhật thành công sang gói dịch vụ mới!`);
        onPlanUpgraded();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpgradingCode(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const currentPlanCode = user?.planCode || 'plan_free';

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-3 border border-rose-200">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Bảng Giá Gói Dịch Vụ</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Lựa Chọn Gói Chăm Sóc Da Phù Hợp
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Theo dõi sát sao tiến trình phục hồi của làn da với hệ thống chẩn đoán thị giác máy tính và hỗ trợ liên tục từ các chuyên gia da liễu.
        </p>

        {/* Current status alert */}
        {usage && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs text-slate-700">
            <span>Gói hiện tại của bạn: <strong className="text-slate-900">{usage.planName}</strong></span>
            <span>•</span>
            <span>Đã dùng <strong>{usage.scansUsedThisMonth}/{usage.scansLimit}</strong> lượt quét trong tháng</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl animate-fade-in">
            {successMsg}
          </div>
        )}
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-slate-600">Đang tải bảng giá...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isCurrent = plan.code === currentPlanCode;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.code}
                className={`relative bg-white rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all ${
                  isPopular
                    ? 'border-2 border-rose-500 shadow-md ring-4 ring-rose-500/10'
                    : 'border border-slate-200 hover:border-slate-300'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full shadow-xs">
                    Được khuyên dùng
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Đang dùng
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-2 min-h-[36px] leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-xs text-slate-500 font-medium"> / tháng</span>
                    )}
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3 pt-6 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Quyền lợi bao gồm:
                    </div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan button */}
                <div className="mt-8 pt-4">
                  <button
                    disabled={isCurrent || upgradingCode === plan.code}
                    onClick={() => handleSelectPlan(plan.code)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : isPopular
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {upgradingCode === plan.code ? (
                      'Đang kích hoạt...'
                    ) : isCurrent ? (
                      'Gói đang kích hoạt'
                    ) : (
                      'Chọn gói này'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trust & Guarantee */}
      <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-slate-800 font-semibold text-sm mb-1">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Cam kết bảo mật thông tin hình ảnh người dùng</span>
        </div>
        <p className="text-xs text-slate-500">
          Hình ảnh chẩn đoán của bạn được xử lý bảo mật, mã hóa tuân thủ chuẩn HIPAA & GDPR và chỉ dùng cho mục đích hỗ trợ đánh giá chăm sóc cá nhân hóa.
        </p>
      </div>
    </div>
  );
};

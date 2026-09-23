import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartPulse, CheckCircle2, Stethoscope, ShoppingBag, ExternalLink } from 'lucide-react';
import { Diagnosis } from '../types';

interface HomeViewProps {
  onStartScan: () => void;
  onViewHistory: () => void;
  onViewProducts: () => void;
  onViewDoctors: () => void;
  recentDiagnosis: Diagnosis | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartScan,
  onViewHistory,
  onViewProducts,
  onViewDoctors,
  recentDiagnosis
}) => {
  return (
    <div className="bg-[#fbfaf7]">
      {/* Hero Section matching DuongNhan.Web */}
      <section className="dn-hero">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7">
              <span className="dn-kicker">AI Skin Intelligence</span>
              <h1 className="dn-display text-slate-900 mt-2 mb-4">
                Hiểu làn da của bạn.<br />
                <span className="text-[#f07c68]">Chăm sóc đúng cách.</span>
              </h1>
              <p className="dn-lead max-w-xl text-slate-600">
                Phân tích da bằng AI, theo dõi tiến triển và kết nối trực tiếp với bác sĩ da liễu — tất cả trong một nền tảng.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3.5 mt-8">
                <button
                  onClick={onStartScan}
                  className="btn-dn-coral px-6 py-3 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 shadow-xs hover:shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Phân tích da miễn phí</span>
                </button>
                <button
                  onClick={onViewDoctors}
                  className="btn-dn-outline px-6 py-3 rounded-full font-bold text-sm sm:text-base cursor-pointer hover:bg-white"
                >
                  Tìm bác sĩ
                </button>
              </div>

              {/* Trust checklist */}
              <div className="flex flex-wrap gap-5 mt-7 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Không cần thẻ thanh toán
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Kết quả trong vài giây
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Theo dõi lịch sử
                </span>
              </div>
            </div>

            {/* Right Score Card */}
            <div className="lg:col-span-5">
              <div className="dn-score-card">
                <div className="dn-score-orb">
                  <div className="dn-score-ring">
                    <span className="text-3xl sm:text-4xl font-black text-white">92</span>
                    <small className="text-[11px] font-semibold text-slate-400">Skin Score</small>
                  </div>
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#238b83]/20 text-emerald-400 border border-emerald-500/20">
                    AI Analysis
                  </span>
                  <h3 className="text-lg font-bold text-white mt-3 mb-1.5 leading-snug">
                    Phân tích theo dữ liệu
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Theo dõi thay đổi của làn da sau từng lần scan và nhận gợi ý chăm sóc phù hợp cùng sản phẩm Shopee Mall chính hãng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Diagnosis Quick Banner (if user has active scan) */}
      {recentDiagnosis && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <div className="bg-white border border-[#e7e5df] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={recentDiagnosis.imageUrl}
                alt="Recent scan"
                className="w-14 h-14 rounded-xl object-cover border border-[#e7e5df] shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold text-[#f07c68] uppercase tracking-wider">
                  Kết quả phân tích da gần nhất
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {recentDiagnosis.primaryCondition} • Điểm da: <span className="text-emerald-600 font-extrabold">{recentDiagnosis.skinHealthScore}/100</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Phân loại: {recentDiagnosis.skinType} • Độ tin cậy AI: {Math.round(recentDiagnosis.confidence * 100)}%
                </p>
              </div>
            </div>

            <button
              onClick={onViewHistory}
              className="btn-dn-dark px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer self-stretch sm:self-auto text-center"
            >
              Xem chi tiết báo cáo →
            </button>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="dn-kicker">Tất cả trong một</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-3">
              Chăm sóc da dựa trên dữ liệu
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Không đoán mò. Dưỡng Nhan kết nối phân tích AI, sản phẩm chính hãng Shopee Mall và chuyên gia da liễu thành một quy trình khoa học đơn giản.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: AI Skin Scan */}
            <div className="dn-feature-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff0ec] text-[#f07c68] flex items-center justify-center font-black text-xl mb-4">
                  ✦
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">AI Skin Scan</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Upload hoặc chụp ảnh da bằng camera để nhận phân tích tức thì về mụn, sắc tố thâm nám, lỗ chân lông và hàng rào bảo vệ.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e7e5df]">
                <button
                  onClick={onStartScan}
                  className="text-xs font-bold text-[#f07c68] hover:text-[#df6956] flex items-center gap-1 cursor-pointer"
                >
                  <span>Bắt đầu scan ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Routine & Shopee Affiliate */}
            <div className="dn-feature-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#e9f7f5] text-[#238b83] flex items-center justify-center font-black text-xl mb-4">
                  ⌁
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Routine & Shopee Mall</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Nhận phác đồ 5 bước cá nhân hóa kèm liên kết trực tiếp mua dược mỹ phẩm chính hãng trên Shopee Mall với mã giảm giá độc quyền.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e7e5df]">
                <button
                  onClick={onViewProducts}
                  className="text-xs font-bold text-[#238b83] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Khám phá sản phẩm Shopee</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Doctors */}
            <div className="dn-feature-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#edf0f3] text-[#14171f] flex items-center justify-center font-black text-xl mb-4">
                  ＋
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Bác sĩ da liễu</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Kết nối trực tiếp với các bác sĩ chuyên khoa da liễu tại TP.HCM, Hà Nội và Đà Nẵng để tư vấn Online hoặc đặt lịch tại phòng khám.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e7e5df]">
                <button
                  onClick={onViewDoctors}
                  className="text-xs font-bold text-slate-900 hover:text-[#f07c68] flex items-center gap-1 cursor-pointer"
                >
                  <span>Tìm bác sĩ chuyên khoa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Process Section */}
      <section className="py-20 bg-[#f4f3ef] border-y border-[#e7e5df]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Steps text */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="dn-kicker">Quy trình</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                  Từ một bức ảnh đến kế hoạch chăm sóc.
                </h2>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start">
                  <span className="font-black text-[#f07c68] text-lg">01</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Upload ảnh</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Ảnh rõ nét, đủ ánh sáng tự nhiên giúp mô hình AI phân tích chính xác từng milimet tế bào da.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="font-black text-[#f07c68] text-lg">02</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">AI phân tích</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Hệ thống tự động đánh giá tình trạng mụn, bã nhờn, lỗ chân lông, hàng rào ẩm và sắc tố nám.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="font-black text-[#f07c68] text-lg">03</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Hành động</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Nhận phác đồ điều trị cá nhân hóa, bấm mua sản phẩm trực tiếp trên Shopee Mall hoặc đặt lịch khám bác sĩ.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Preview Card matching DuongNhan.Web */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-[#e7e5df] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#e7e5df] mb-4">
                  <span className="text-xs font-semibold text-slate-500">Latest analysis preview</span>
                  <b className="text-base font-black text-emerald-600">92% Health</b>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#f4f3ef] h-2.5 rounded-full overflow-hidden mb-6">
                  <div className="bg-emerald-500 h-full rounded-full w-[92%] transition-all"></div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#f4f3ef] rounded-2xl p-3.5 text-center">
                    <small className="text-[10px] uppercase font-bold text-slate-500 block">Acne</small>
                    <strong className="text-sm font-extrabold text-slate-900 mt-1 block">Low</strong>
                  </div>
                  <div className="bg-[#f4f3ef] rounded-2xl p-3.5 text-center">
                    <small className="text-[10px] uppercase font-bold text-slate-500 block">Hydration</small>
                    <strong className="text-sm font-extrabold text-emerald-600 mt-1 block">Good</strong>
                  </div>
                  <div className="bg-[#f4f3ef] rounded-2xl p-3.5 text-center">
                    <small className="text-[10px] uppercase font-bold text-slate-500 block">Barrier</small>
                    <strong className="text-sm font-extrabold text-emerald-600 mt-1 block">Healthy</strong>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e7e5df] flex items-center justify-between text-xs text-slate-500">
                  <span>Mô hình lâm sàng: Dưỡng Nhan Vision v2</span>
                  <span className="text-[#238b83] font-semibold">Độ chính xác cao</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark CTA Section matching DuongNhan.Web */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="dn-dark-cta flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="dn-kicker">Bắt đầu hôm nay</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-2 tracking-tight">
                Đừng đoán về làn da.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
                Hãy bắt đầu bằng một lần phân tích da miễn phí với AI để có được lộ trình phục hồi và chu trình skincare chuẩn y khoa.
              </p>
            </div>

            <button
              onClick={onStartScan}
              className="btn-dn-coral px-8 py-3.5 rounded-full font-bold text-sm shadow-md cursor-pointer whitespace-nowrap shrink-0"
            >
              Tạo tài khoản & Scan ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

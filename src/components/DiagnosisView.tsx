import React from 'react';
import { Diagnosis } from '../types';
import { Sparkles, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck, Activity, Layers, HeartPulse } from 'lucide-react';

interface DiagnosisViewProps {
  diagnosis: Diagnosis;
  onViewRecommendations: (diagnosisId: string) => void;
  onNewScan: () => void;
}

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({
  diagnosis,
  onViewRecommendations,
  onNewScan
}) => {
  const getSeverityBadge = (severity: 'Mild' | 'Moderate' | 'Severe') => {
    switch (severity) {
      case 'Mild':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Nhẹ (Mild)
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Trung bình (Moderate)
          </span>
        );
      case 'Severe':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Nghiêm trọng (Severe)
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Báo cáo chẩn đoán AI
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kết Quả Phân Tích Làn Da
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thời gian phân tích: {new Date(diagnosis.diagnosedAt).toLocaleString('vi-VN')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onNewScan}
            className="flex-1 sm:flex-none px-4 py-2 border border-[#e7e5df] hover:bg-[#f4f3ef] text-slate-700 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Quét lại ảnh mới
          </button>
          <button
            onClick={() => onViewRecommendations(diagnosis.id)}
            className="flex-1 sm:flex-none px-5 py-2 btn-dn-coral text-white rounded-full text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Xem gợi ý mỹ phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Analysis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Image & Health Score */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-100">
              <img
                src={diagnosis.imageUrl}
                alt="Ảnh da đã phân tích"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[11px] rounded-md font-medium">
                Ảnh phân tích
              </div>
            </div>

            {/* Health Score Meter */}
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500 font-medium">Chỉ số sức khỏe làn da (Skin Health Score)</span>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold text-2xl ${getScoreColor(diagnosis.skinHealthScore)}`}>
                  {diagnosis.skinHealthScore}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-800">
                    {diagnosis.skinHealthScore >= 80 ? 'Da tương đối khỏe mạnh' : diagnosis.skinHealthScore >= 65 ? 'Cần cải thiện hàng rào ẩm' : 'Cần phục hồi chuyên sâu'}
                  </div>
                  <div className="text-slate-500 text-[11px]">Thang điểm 100</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skin Type & Characteristics */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              Đặc tính phân loại
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Loại da:</span>
                <span className="font-semibold text-slate-900">{diagnosis.skinType}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Độ tin cậy AI:</span>
                <span className="font-semibold text-indigo-600">{(diagnosis.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mức độ ưu tiên:</span>
                {getSeverityBadge(diagnosis.severity)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Clinical Evaluation */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <HeartPulse className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {diagnosis.primaryCondition}
                  </h2>
                  <span className="text-xs text-slate-500">Vấn đề da liễu chủ đạo được phát hiện</span>
                </div>
              </div>
              <div>{getSeverityBadge(diagnosis.severity)}</div>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {diagnosis.summary}
            </p>
          </div>

          {/* Detailed Condition Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              Chi tiết các tình trạng da phát hiện ({diagnosis.conditions.length})
            </h3>

            <div className="space-y-4">
              {diagnosis.conditions.map((condition) => (
                <div
                  key={condition.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-rose-200 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                        {condition.rank}
                      </span>
                      <span className="font-semibold text-sm text-slate-900">
                        {condition.conditionName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-indigo-600">
                        {(condition.confidence * 100).toFixed(0)}% khớp
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-indigo-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${condition.confidence * 100}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-normal">
                    {condition.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Treatment Plan (Phác đồ điều trị từng bước) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Phác Đồ Điều Trị Từng Bước (Treatment Plan)</h3>
                  <p className="text-xs text-slate-500">Quy trình chăm sóc khoa học cá nhân hóa cho {diagnosis.primaryCondition}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-full border border-emerald-200">
                Chu trình chuẩn Y khoa
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bước 1: Làm sạch da dịu nhẹ (Gentle Cleanser)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Rửa mặt với sữa rửa mặt pH 5.5 giúp loại bỏ dầu thừa và tạp chất mà không làm tổn thương hàng rào bảo vệ màng ẩm.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bước 2: Tẩy da chết & Kháng viêm (BHA / Salicylic Acid 2%)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Thấm sâu vào lỗ chân lông hòa tan bã nhờn, làm thông thoáng tuyến dầu và kháng khuẩn mụn trứng cá (sử dụng 2-3 lần/tuần).</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bước 3: Tinh chất điều trị & Phục hồi (Niacinamide 10% + Zinc)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Giảm tiết bã nhờn, mờ thâm sau mụn và thu nhỏ diện tích lỗ chân lông rõ rệt sau 4 tuần.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bước 4: Cấp ẩm & Khóa ẩm (Ceramide Gel Cream)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Tái tạo màng lipid bảo vệ da, ngăn hiện tượng mất nước qua biểu bì (TEWL) giúp da luôn mềm mịn, không tiết dầu bù.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bước 5: Bảo vệ ban ngày (Chống nắng phổ rộng SPF 50+)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Bôi đủ 2mg/cm² trước khi ra ngoài để bảo vệ da khỏi tia UVA/UVB và ánh sáng xanh, ngăn thâm sẹo và lão hóa sớm.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner to Product Recommendations */}
          <div className="p-6 rounded-3xl bg-[#14171f] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-slate-800">
            <div>
              <span className="dn-kicker">Phác đồ & Dược mỹ phẩm</span>
              <h3 className="font-extrabold text-base text-white mt-1">Xem Phác Đồ Skincare Được Cá Nhân Hóa</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
                Hệ thống đề xuất 5 bước chu trình dưỡng da với các sản phẩm lành tính phù hợp nhất cho tình trạng {diagnosis.primaryCondition}, tích hợp mua trực tiếp Shopee Mall.
              </p>
            </div>
            <button
              onClick={() => onViewRecommendations(diagnosis.id)}
              className="px-6 py-3 btn-dn-coral text-white font-bold text-xs sm:text-sm rounded-full shrink-0 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Xem phác đồ ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Diagnosis } from '../types';
import { History, Calendar, Sparkles, ArrowRight, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';

interface HistoryViewProps {
  onSelectDiagnosis: (diagnosis: Diagnosis) => void;
  onNewScan: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onSelectDiagnosis,
  onNewScan
}) => {
  const [history, setHistory] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        let res = await fetch('/api/skin/history');
        const contentType = res.headers.get('content-type') || '';
        
        if (!res.ok || !contentType.includes('application/json')) {
          // Attempt fallback route
          res = await fetch('/api/history');
        }

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setHistory(data);
          }
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            Nhật ký chăm sóc da
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Lịch Sử Các Lần Phân Tích Da
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi tiến trình hồi phục và sự cải thiện của các chỉ số da qua các chu kỳ quét
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Thực hiện lần quét mới</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-slate-600">Đang tải lịch sử...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Chưa có dữ liệu chẩn đoán nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            Bạn chưa thực hiện quét da lần nào. Hãy chụp hoặc tải ảnh để nhận kết quả phân tích đầu tiên.
          </p>
          <button
            onClick={onNewScan}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Quét da ngay bây giờ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((diag) => (
            <div
              key={diag.id}
              onClick={() => onSelectDiagnosis(diag)}
              className="bg-white border border-slate-200 hover:border-rose-300 rounded-2xl p-5 shadow-xs hover:shadow-sm cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={diag.imageUrl}
                  alt={diag.primaryCondition}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(diag.diagnosedAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      {diag.skinType}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 truncate">
                    {diag.primaryCondition}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {diag.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Điểm da</div>
                  <div className={`text-base font-extrabold px-2.5 py-0.5 rounded-lg border ${getScoreColor(diag.skinHealthScore)}`}>
                    {diag.skinHealthScore}/100
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-rose-50 group-hover:text-rose-600 flex items-center justify-center text-slate-400 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ProductRecommendation } from '../types';
import { Sparkles, Check, Info, ArrowLeft, ShoppingCart, CheckCircle, ExternalLink } from 'lucide-react';

interface RecommendationsViewProps {
  diagnosisId: string | null;
  onBackToDiagnosis: () => void;
  onNavigateToProducts: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  diagnosisId,
  onBackToDiagnosis,
  onNavigateToProducts
}) => {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = diagnosisId
          ? `/api/products/recommend?diagnosisId=${encodeURIComponent(diagnosisId)}`
          : '/api/products/recommend';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Không thể tải phác đồ gợi ý');
        const data: ProductRecommendation[] = await res.json();
        setRecommendations(data);
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải gợi ý');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [diagnosisId]);

  const toggleAddToCart = (productId: string) => {
    setAddedItems((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Bước 1: Làm Sạch Dịu Nhẹ (Cleanser)';
      case 2:
        return 'Bước 2: Tẩy Da Chết & Đặc Trị Mụn (Treatment & Exfoliant)';
      case 3:
        return 'Bước 3: Tinh Chất Phục Hồi Sâu (Serum & Essence)';
      case 4:
        return 'Bước 4: Khóa Ẩm & Tái Tạo Hàng Rào (Moisturizer)';
      case 5:
        return 'Bước 5: Bảo Vệ Quang Phổ Rộng (Sunscreen)';
      default:
        return 'Sản Phẩm Bổ Trợ Chăm Sóc';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToDiagnosis}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại kết quả chẩn đoán</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Phác Đồ & Chu Trình Chăm Sóc Đề Xuất
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Được thuật toán AI tính toán tỉ lệ tương thích dựa trên các tình trạng da của bạn
          </p>
        </div>

        <button
          onClick={onNavigateToProducts}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium rounded-xl transition-colors shrink-0"
        >
          Xem toàn bộ catalog sản phẩm
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-slate-600">Đang khởi tạo chu trình phác đồ tối ưu...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center text-rose-700 text-sm">
          {error}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Chưa tìm thấy gợi ý tương thích.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Routine Routine Steps */}
          {Array.from(new Set(recommendations.map((r) => r.stepOrder)))
            .sort((a, b) => a - b)
            .map((step) => {
              const stepRecs = recommendations.filter((r) => r.stepOrder === step);
              return (
                <div key={step} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {step}
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      {getStepTitle(step)}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stepRecs.map((rec) => {
                      const isAdded = addedItems.has(rec.product.id);
                      return (
                        <div
                          key={rec.id}
                          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Product Header & Match badge */}
                            <div className="flex items-start gap-4">
                              <img
                                src={rec.product.imageUrl}
                                alt={rec.product.name}
                                className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                                    {rec.product.brand}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    {rec.matchPercentage}% Khớp
                                  </span>
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 leading-snug mt-1 truncate">
                                  {rec.product.name}
                                </h3>
                                <div className="text-sm font-extrabold text-slate-900 mt-1">
                                  {formatPrice(rec.product.price)}
                                </div>
                              </div>
                            </div>

                            {/* Reason for match */}
                            <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-700">
                              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                              <p className="leading-relaxed">
                                <strong className="font-semibold text-slate-900">Lý do gợi ý: </strong>
                                {rec.reason}
                              </p>
                            </div>

                            {/* Usage instructions */}
                            <p className="text-xs text-slate-500 mt-2.5 line-clamp-2">
                              <strong className="text-slate-700 font-medium">Cách dùng: </strong>
                              {rec.product.usageInstructions}
                            </p>
                          </div>

                          {/* Card Action */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md self-start sm:self-auto">
                              {rec.product.category}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {/* Direct Shopee Affiliate Link */}
                              <a
                                href={rec.product.shopeeAffiliateUrl || rec.product.shopeeUrl || `https://shopee.vn/search?keyword=${encodeURIComponent(rec.product.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl text-xs font-bold btn-shopee flex items-center gap-1.5 shadow-2xs no-underline text-white cursor-pointer"
                              >
                                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                  <path d="M19.5 7h-2.22C16.82 4.14 14.65 2 12 2S7.18 4.14 6.72 7H4.5C3.67 7 3 7.67 3 8.5l1.5 12c.07.56.54.98 1.1.98h12.8c.56 0 1.03-.42 1.1-.98L21 8.5c0-.83-.67-1.5-1.5-1.5zM12 4c1.55 0 2.87 1.3 3.2 3H8.8C9.13 5.3 10.45 4 12 4zm6.6 15.5H5.4L4.15 9h15.7l-1.25 10.5z" />
                                </svg>
                                <span>Mua trên Shopee</span>
                                <ExternalLink className="w-3 h-3 opacity-80" />
                              </a>

                              <button
                                onClick={() => toggleAddToCart(rec.product.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isAdded
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Đã lưu</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                    <span>Lưu phác đồ</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

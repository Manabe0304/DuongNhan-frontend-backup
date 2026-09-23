import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Search, ShoppingBag, ExternalLink, Star, Copy, Check, ShieldCheck, Truck, Sparkles, Filter } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyShopeeMall, setOnlyShopeeMall] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Cleanser', label: 'Sữa rửa mặt' },
    { id: 'Treatment', label: 'Đặc trị / Tẩy da chết' },
    { id: 'Serum', label: 'Serum & Tinh chất' },
    { id: 'Moisturizer', label: 'Kem dưỡng ẩm' },
    { id: 'Sunscreen', label: 'Chống nắng' }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'Treatment' && (p.category === 'Exfoliant' || p.category === 'Treatment')) ||
      (selectedCategory === 'Serum' && (p.category === 'Essence' || p.category === 'Serum'));

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMall = !onlyShopeeMall || p.isShopeeMall;

    return matchesCat && matchesSearch && matchesMall;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
    return 0;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCopyAffiliate = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const link = product.shopeeAffiliateUrl || product.shopeeUrl || `https://shopee.vn/search?keyword=${encodeURIComponent(product.name)}`;
    navigator.clipboard.writeText(link);
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Heading matching DuongNhan.Web */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="dn-kicker">Dermacare & Shopee Mall Affiliate</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">
            Sản phẩm & Gợi ý chăm sóc da
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Dược mỹ phẩm y khoa được chọn lọc theo chuẩn lâm sàng, tích hợp trực tiếp link Affiliate mua sắm trên Shopee Mall chính hãng với ưu đãi đặc quyền.
          </p>
        </div>

        {/* Shopee Mall Guarantee Badge */}
        <div className="bg-[#fff0ec] border border-[#f07c68]/30 rounded-2xl p-3.5 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#ee4d2d] flex items-center justify-center text-white font-black text-sm shadow-xs">
            Mall
          </div>
          <div className="text-xs">
            <div className="font-bold text-[#ee4d2d]">Shopee Mall Chính Hãng</div>
            <div className="text-slate-600 text-[11px]">Đảm bảo 100% • Freeship Xtra • Trả hàng 15 ngày</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e7e5df] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm, thương hiệu (CeraVe, La Roche-Posay, Paula's Choice...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f4f3ef] border border-transparent rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#238b83] transition-all"
            />
          </div>

          {/* Sort & Toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyShopeeMall}
                onChange={(e) => setOnlyShopeeMall(e.target.checked)}
                className="rounded border-slate-300 text-[#ee4d2d] focus:ring-[#ee4d2d] w-4 h-4 accent-[#ee4d2d]"
              />
              <span className="flex items-center gap-1">
                <span className="bg-[#ee4d2d] text-white font-black text-[9px] px-1 py-0.5 rounded">Mall</span>
                Chỉ hiện Shopee Mall
              </span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#f4f3ef] border border-transparent rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-[#238b83]"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 pt-3.5 border-t border-[#e7e5df]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'btn-dn-dark text-white shadow-xs'
                  : 'bg-white border border-[#e7e5df] text-slate-600 hover:bg-[#f4f3ef]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-[#f07c68]/20 border-t-[#f07c68] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-slate-600">Đang tải danh mục dược mỹ phẩm Shopee...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="bg-white border border-dashed border-[#e7e5df] rounded-2xl p-12 text-center text-slate-500">
          Không tìm thấy sản phẩm nào phù hợp với bộ lọc tìm kiếm.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => {
            const affiliateLink =
              product.shopeeAffiliateUrl ||
              product.shopeeUrl ||
              `https://shopee.vn/search?keyword=${encodeURIComponent(product.name)}`;

            return (
              <div
                key={product.id}
                className="dn-product-card flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-4/3 bg-[#f2f1ed] overflow-hidden group">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Shopee Mall Badge */}
                    {product.isShopeeMall && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#ee4d2d] text-white shadow-sm flex items-center gap-1">
                        <span>Mall</span>
                      </span>
                    )}

                    {/* Discount Badge */}
                    {product.discountBadge && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-400 text-slate-900 shadow-sm">
                        {product.discountBadge}
                      </span>
                    )}

                    {/* Category overlay */}
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 backdrop-blur-xs text-slate-700 shadow-2xs">
                      {product.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    {/* Brand & Store */}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-extrabold text-[#f07c68] uppercase tracking-wider text-[11px]">
                        {product.brand}
                      </span>
                      {product.shopeeShopName && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {product.shopeeShopName}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 min-h-[40px]">
                      {product.name}
                    </h3>

                    {/* Rating & Sold count */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating || 4.9}</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 text-[11px]">
                        {product.reviewsCount ? `${product.reviewsCount} đánh giá` : 'Chính hãng'}
                      </span>
                      {product.soldCount && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-medium text-emerald-600">
                            Đã bán {product.soldCount}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Price and Original Price */}
                    <div className="flex items-baseline gap-2 mt-2.5">
                      <span className="text-lg font-black text-slate-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Target Conditions Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {product.targetConditions.split(',').map((cond, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#f4f3ef] text-slate-600 rounded text-[10px] font-medium"
                        >
                          #{cond.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Shopee Affiliate Action Footer */}
                <div className="p-4 sm:p-5 pt-0 mt-auto">
                  <div className="pt-3 border-t border-[#e7e5df] flex items-center gap-2">
                    {/* Primary Direct Shopee Affiliate Button */}
                    <a
                      href={affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold btn-shopee flex items-center justify-center gap-2 shadow-sm text-white no-underline transition-all cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 fill-current shrink-0"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M19.5 7h-2.22C16.82 4.14 14.65 2 12 2S7.18 4.14 6.72 7H4.5C3.67 7 3 7.67 3 8.5l1.5 12c.07.56.54.98 1.1.98h12.8c.56 0 1.03-.42 1.1-.98L21 8.5c0-.83-.67-1.5-1.5-1.5zM12 4c1.55 0 2.87 1.3 3.2 3H8.8C9.13 5.3 10.45 4 12 4zm6.6 15.5H5.4L4.15 9h15.7l-1.25 10.5z" />
                        <path d="M12 11c-1.38 0-2.5 1.12-2.5 2.5 0 .93.51 1.74 1.27 2.16-.36.43-.77.94-1.27 1.34-.15.12-.2.31-.13.48.07.17.24.28.43.28h4.4c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-2.92c.38-.34.73-.77 1.05-1.15.75-.41 1.27-1.22 1.27-2.11C14.5 12.12 13.38 11 12 11zm0 4c-.83 0-1.5-.67-1.5-1.5S11.17 12 12 12s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                      </svg>
                      <span>Mua trên Shopee</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    {/* Copy Link Button */}
                    <button
                      onClick={(e) => handleCopyAffiliate(e, product)}
                      title="Sao chép link Shopee Affiliate"
                      className="p-2.5 rounded-xl border border-[#e7e5df] hover:bg-[#f4f3ef] text-slate-600 transition-colors cursor-pointer"
                    >
                      {copiedId === product.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Toast for copy */}
                  {copiedId === product.id && (
                    <div className="mt-1 text-center text-[10px] font-semibold text-emerald-600 animate-fade-in">
                      ✓ Đã sao chép link Shopee Affiliate!
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-2">
                    <span className="flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Chính hãng 100%
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Truck className="w-3 h-3 text-blue-500" /> Freeship Xtra
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

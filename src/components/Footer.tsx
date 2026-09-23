import React from 'react';

interface FooterProps {
  onSelectTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#14171f] text-white border-t border-slate-800 mt-20 pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand, Description & Socials */}
          <div className="md:col-span-5 space-y-4">
            <div className="dn-brand text-white flex items-center gap-2.5">
              <span className="dn-brand-mark">✚</span>
              <span className="font-extrabold text-xl tracking-tight text-white">Dưỡng Nhan</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Nền tảng AI phân tích da và kết nối bác sĩ da liễu, giúp bạn hiểu làn da một cách khoa học và lựa chọn mỹ phẩm Shopee Mall chính hãng an tâm.
            </p>

            {/* Social Icons: Facebook, TikTok, YouTube */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Kênh truyền thông &amp; Cộng đồng
              </span>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Dưỡng Nhan AI"
                  className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1877f2] hover:border-[#1877f2] transition-all transform hover:-translate-y-0.5 shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok Dưỡng Nhan AI"
                  className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-black hover:border-slate-500 transition-all transform hover:-translate-y-0.5 shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.86 3.48 2.69 1.5-.05 2.81-1.09 3.23-2.52.12-.44.17-.91.17-1.37.03-5.26.01-10.51.02-15.77z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Dưỡng Nhan AI"
                  className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#ff0000] hover:border-[#ff0000] transition-all transform hover:-translate-y-0.5 shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
              Sản phẩm
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab && onSelectTab('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab && onSelectTab('upload')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Scan Da
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab && onSelectTab('doctors')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bác sĩ chuyên khoa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab && onSelectTab('products')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Sản phẩm</span>
                  <span className="bg-[#ee4d2d] text-white text-[9px] font-black px-1 rounded">Mall</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab && onSelectTab('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bảng giá gói
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
              Hỗ trợ
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Bảo mật y tế
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#shopee-policy" className="hover:text-white transition-colors">
                  Chính sách Affiliate
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
              Liên hệ
            </h5>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>Email: <span className="text-white font-medium">hello@duongnhan.ai</span></p>
              <p>Hotline y khoa: <span className="text-white font-medium">1900 8866</span></p>
              <p>Văn phòng: <span className="text-slate-300">268 Lý Thường Kiệt, TP. Hồ Chí Minh &amp; Hà Nội</span></p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 Duong Nhan AI Platform. Bảo lưu mọi quyền.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Đối tác Shopee Mall Certified</span>
            <span>•</span>
            <span>AI Vision Diagnostic v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

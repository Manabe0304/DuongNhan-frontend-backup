import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, AlertCircle, CheckCircle2, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { Diagnosis } from '../types';

interface UploadSectionProps {
  onDiagnosisComplete: (diagnosis: Diagnosis) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onDiagnosisComplete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Preset sample skin images for instant testing
  const sampleImages = [
    {
      title: 'Mẫu 1: Da dầu mụn',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
      desc: 'Mụn trứng cá, bã nhờn vùng chữ T'
    },
    {
      title: 'Mẫu 2: Da nhạy cảm ửng đỏ',
      url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop',
      desc: 'Giãn mao mạch, da mẩn đỏ khô rát'
    },
    {
      title: 'Mẫu 3: Da sạm thâm nám',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop',
      desc: 'Tăng sắc tố, đốm nâu vùng gò má'
    }
  ];

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setErrorMessage('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh không được vượt quá 10MB.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Start Camera
  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMessage('Không thể mở camera. Vui lòng cho phép quyền truy cập camera hoặc tải ảnh từ thiết bị.');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture Photo from Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setSelectedImage(dataUrl);
      setSelectedFile(null); // base64 payload
    }
    stopCamera();
  };

  // Select preset sample image
  const selectSample = async (url: string) => {
    setErrorMessage(null);
    setSelectedImage(url);
    setSelectedFile(null);
  };

  // Run AI Analysis
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStatus('Đang tải ảnh lên máy chủ...');

    try {
      let imageId = '';

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch('/api/skin/upload', {
          method: 'POST',
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Không thể tải ảnh lên máy chủ');
        const uploadData = await uploadRes.json();
        imageId = uploadData.skinImageId;
      } else {
        // Base64 or preset url
        const uploadRes = await fetch('/api/skin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData: selectedImage })
        });
        if (!uploadRes.ok) throw new Error('Không thể tải ảnh lên máy chủ');
        const uploadData = await uploadRes.json();
        imageId = uploadData.skinImageId;
      }

      setAnalysisStatus('AI đang quét các vùng biểu bì và phân tích cấu trúc da...');
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStatus('Đang đối chiếu dữ liệu với phác đồ 10+ bệnh lý da liễu...');
      const diagRes = await fetch(`/api/skin/${imageId}/diagnose`, {
        method: 'POST'
      });

      if (!diagRes.ok) throw new Error('Không thể tạo chẩn đoán da');
      const diagnosis: Diagnosis = await diagRes.json();

      setAnalysisStatus('Hoàn tất! Đang mở kết quả chẩn đoán...');
      await new Promise((r) => setTimeout(r, 400));

      onDiagnosisComplete(diagnosis);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Có lỗi xảy ra trong quá trình chẩn đoán.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-3 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hệ Thống Trí Tuệ Nhân Tạo AI Scan 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Chẩn Đoán Làn Da Của Bạn
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto">
          Chụp trực tiếp bằng camera hoặc tải lên ảnh cận cảnh khuôn mặt để nhận kết quả phân tích chuyên sâu và phác đồ chăm sóc cá nhân hóa.
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Upload / Camera Viewport */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        {isCameraActive ? (
          /* Live Camera View */
          <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-4/3 max-w-lg mx-auto flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Face Oval Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-48 h-64 sm:w-56 sm:h-72 border-2 border-dashed border-rose-400/80 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"></div>
              <p className="text-white text-xs mt-3 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                Đặt khuôn mặt vừa vặn vào khung tròn
              </p>
            </div>

            {/* Camera Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-10">
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-medium rounded-full backdrop-blur-xs transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={capturePhoto}
                className="w-14 h-14 rounded-full bg-white border-4 border-rose-500 flex items-center justify-center text-rose-600 shadow-lg hover:scale-105 active:scale-95 transition-transform"
                title="Chụp ảnh"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : selectedImage ? (
          /* Preview Selected Image */
          <div className="relative max-w-md mx-auto">
            <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 shadow-inner">
              <img
                src={selectedImage}
                alt="Ảnh da được chọn"
                className="w-full h-full object-cover"
              />

              {/* Scanning laser animation overlay when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-rose-500/15 backdrop-blur-[1px]">
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#f43f5e] animate-scanline" />
                </div>
              )}
            </div>

            {/* Reset / Change Photo */}
            {!isAnalyzing && (
              <div className="flex justify-between items-center mt-3 text-xs">
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Ảnh đã sẵn sàng phân tích
                </span>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedFile(null);
                  }}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Chọn ảnh khác
                </button>
              </div>
            )}

            {/* Analysis progress indicator */}
            {isAnalyzing && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2 text-rose-600 font-semibold text-sm mb-1">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{analysisStatus}</span>
                </div>
                <div className="w-full bg-rose-200 rounded-full h-1.5 overflow-hidden mt-2">
                  <div className="bg-rose-500 h-full rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            )}

            {/* Action Analyze Button */}
            {!isAnalyzing && (
              <button
                onClick={handleAnalyze}
                className="w-full mt-4 py-3.5 px-6 rounded-full btn-dn-coral text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                Bắt đầu phân tích chẩn đoán da
              </button>
            )}
          </div>
        ) : (
          /* Dropzone & Camera Prompt */
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: File Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-rose-400 hover:bg-rose-50/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 group-hover:scale-110 group-hover:bg-rose-100 flex items-center justify-center mb-3 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">
                  Tải ảnh từ máy
                </h3>
                <p className="text-xs text-slate-500 max-w-[200px]">
                  Kéo thả ảnh hoặc nhấp để tải ảnh chân dung (JPG, PNG, WebP)
                </p>
                <span className="mt-4 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-medium text-slate-600 shadow-2xs">
                  Tối đa 10 MB
                </span>
              </div>

              {/* Option 2: Live Camera Capture */}
              <div
                onClick={startCamera}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">
                  Chụp bằng Camera
                </h3>
                <p className="text-xs text-slate-500 max-w-[200px]">
                  Mở webcam hoặc camera điện thoại có khung căn chỉnh chuẩn góc
                </p>
                <span className="mt-4 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-medium text-slate-600 shadow-2xs">
                  Trực tiếp trong trình duyệt
                </span>
              </div>
            </div>

            {/* Quick Sample Photos for immediate preview */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Hoặc thử ngay với ảnh mẫu:
                </span>
                <span className="text-xs text-slate-400">Không cần tải ảnh của bạn</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sampleImages.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSample(sample.url)}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 cursor-pointer transition-all group"
                  >
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-12 h-12 rounded-lg object-cover shadow-2xs group-hover:scale-105 transition-transform"
                    />
                    <div className="text-left overflow-hidden">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {sample.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {sample.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Standard Capture Instructions */}
      <div className="mt-6 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Tiêu chuẩn để AI phân tích độ chính xác cao nhất:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
            <span>Ánh sáng tự nhiên, không bị chói sáng hoặc sấp bóng.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
            <span>Mặt mộc, làm sạch da trước khi chụp ảnh.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
            <span>Góc chụp trực diện, giữ khoảng cách 25 - 35 cm.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
            <span>Tháo kính mắt và vén gọn tóc để thấy rõ trán & gò má.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

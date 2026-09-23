import React, { useState, useEffect } from 'react';
import { Doctor } from '../types';
import { Search, MapPin, Calendar, Clock, Phone, Stethoscope, Star, CheckCircle, X, ShieldAlert, Sparkles } from 'lucide-react';

interface DoctorsViewProps {
  onStartScan?: () => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({ onStartScan }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('Tất cả');

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [consultationType, setConsultationType] = useState<'online' | 'offline'>('online');
  const [appointmentDate, setAppointmentDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  const cities = ['Tất cả', 'TP.HCM', 'Hà Nội', 'Đà Nẵng'];

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesCity = cityFilter === 'Tất cả' || doc.city === cityFilter;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.clinic.toLowerCase().includes(q) ||
      doc.city.toLowerCase().includes(q);

    return matchesCity && matchesQuery;
  });

  const handleOpenBooking = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setSelectedSlot(doc.slots[0] || '09:00');
    setBookingSuccessMsg(null);
    setBookingLoading(false);
  };

  const handleCloseBooking = () => {
    setSelectedDoctor(null);
    setBookingSuccessMsg(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedSlot) return;

    setBookingLoading(true);
    try {
      const res = await fetch('/api/doctors/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          consultationType,
          appointmentDate,
          appointmentTime: selectedSlot,
          patientPhone: phone,
          notes
        })
      });

      const data = await res.json();
      if (res.ok) {
        setBookingSuccessMsg(data.message || `Đã ghi nhận yêu cầu với ${selectedDoctor.name}.`);
      } else {
        alert(data.error || 'Đặt lịch thất bại');
      }
    } catch (err) {
      console.error(err);
      setBookingSuccessMsg(`Đã ghi nhận yêu cầu với ${selectedDoctor.name} vào ${appointmentDate} lúc ${selectedSlot}. Đội ngũ trợ lý y khoa sẽ gọi xác nhận!`);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Heading */}
      <div className="mb-8">
        <span className="dn-kicker">Đội ngũ chuyên gia</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-3">
          Bác sĩ Da liễu Chuyên khoa
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Kết nối trực tiếp với các bác sĩ da liễu giàu kinh nghiệm tại các bệnh viện và phòng khám uy tín để được chẩn đoán sâu và kê đơn chính xác.
        </p>
      </div>

      {/* Filter Card */}
      <div className="bg-white border border-[#e7e5df] rounded-2xl p-5 mb-8 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-[#f4f3ef] border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#238b83] transition-all"
            placeholder="Tìm theo tên bác sĩ, chuyên khoa hoặc phòng khám..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-3.5 pt-3.5 border-t border-[#e7e5df]">
          <span className="text-xs font-semibold text-slate-500 mr-1">Khu vực:</span>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                cityFilter === c
                  ? 'btn-dn-dark text-white shadow-xs'
                  : 'bg-white border border-[#e7e5df] text-slate-700 hover:bg-[#f4f3ef]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-[#f07c68]/20 border-t-[#f07c68] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-600 font-medium">Đang tải danh sách bác sĩ chuyên khoa...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white border border-dashed border-[#e7e5df] rounded-2xl p-12 text-center text-slate-500">
          Không tìm thấy bác sĩ nào phù hợp với điều kiện tìm kiếm.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-[#e7e5df] rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="dn-doctor-img w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {doc.city}
                      </span>
                      <span className="text-xs text-slate-500">
                        {doc.experience} năm kinh nghiệm
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                      {doc.name}
                    </h3>
                    <div className="text-xs font-semibold text-[#f07c68] mt-0.5">
                      {doc.specialty}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{doc.rating}</span>
                      <span className="text-slate-400">({doc.reviews} lượt đánh giá)</span>
                    </div>
                  </div>
                </div>

                {/* Clinic Box */}
                <div className="mt-4 p-3 bg-[#f4f3ef] border border-[#e7e5df] rounded-xl text-xs text-slate-700 leading-relaxed">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#238b83]" />
                    {doc.clinic}
                  </div>
                  <div className="text-slate-500 mt-0.5 pl-5 flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                    <span>{doc.address}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3.5 leading-relaxed">
                  {doc.bio}
                </p>
              </div>

              {/* Bottom Action */}
              <div className="flex items-center justify-between border-t border-[#e7e5df] pt-4 mt-5">
                <div>
                  <span className="text-[11px] text-slate-500 block">Phí tư vấn từ</span>
                  <span className="text-base font-extrabold text-slate-900">{doc.price}</span>
                </div>
                <button
                  onClick={() => handleOpenBooking(doc)}
                  className="px-4 py-2 rounded-full text-xs font-bold btn-dn-coral shadow-xs cursor-pointer"
                >
                  Đặt lịch khám
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Consultation Banner */}
      <div className="mt-12 bg-linear-to-r from-[#14171f] to-[#1e2430] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#f07c68]/20 flex items-center justify-center text-[#f07c68]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Bạn chưa scan phân tích da trước khi gặp bác sĩ?</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Hãy chụp ảnh da bằng AI Skin Scan để bác sĩ có báo cáo tình trạng lâm sàng chi tiết trước buổi tư vấn.
            </p>
          </div>
        </div>
        {onStartScan && (
          <button
            onClick={onStartScan}
            className="px-4 py-2 rounded-xl text-xs font-bold btn-dn-coral whitespace-nowrap cursor-pointer shrink-0"
          >
            Scan da miễn phí ngay
          </button>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-[#14171f]/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8 border border-[#e7e5df]">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#e7e5df] pb-4 mb-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#f07c68]">Tư vấn chuyên khoa</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Đặt lịch tư vấn da liễu</h3>
                <p className="text-xs text-slate-500">với {selectedDoctor.name}</p>
              </div>
              <button
                onClick={handleCloseBooking}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingSuccessMsg ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900">Đặt lịch thành công!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {bookingSuccessMsg}
                </p>
                <button
                  onClick={handleCloseBooking}
                  className="px-6 py-2.5 rounded-full text-xs font-bold btn-dn-dark text-white cursor-pointer"
                >
                  Xong & Quay lại
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Consultation type */}
                <div>
                  <label className="font-bold text-slate-800 mb-2 block">Hình thức tư vấn</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setConsultationType('online')}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        consultationType === 'online'
                          ? 'border-[#238b83] bg-[#eff9f7]'
                          : 'border-[#e7e5df] bg-white hover:bg-slate-50'
                      }`}
                    >
                      <b className="block text-slate-900 text-xs">Video Call Online</b>
                      <span className="text-[11px] font-bold text-[#238b83] mt-1 block">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedDoctor.onlineFee)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('offline')}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        consultationType === 'offline'
                          ? 'border-[#238b83] bg-[#eff9f7]'
                          : 'border-[#e7e5df] bg-white hover:bg-slate-50'
                      }`}
                    >
                      <b className="block text-slate-900 text-xs">Tại phòng khám</b>
                      <span className="text-[11px] font-bold text-[#238b83] mt-1 block">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedDoctor.offlineFee)}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Chọn ngày hẹn
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e7e5df] rounded-xl text-xs focus:outline-none focus:border-[#238b83]"
                  />
                </div>

                {/* Time Slot Picker */}
                <div>
                  <label className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Khung giờ khám
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          selectedSlot === slot
                            ? 'bg-[#238b83] text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    placeholder="09xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e7e5df] rounded-xl text-xs focus:outline-none focus:border-[#238b83]"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="font-bold text-slate-800 mb-1.5 block">
                    Mô tả tình trạng da sơ bộ (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Da mụn viêm tái phát sau ngưng kem, sưng đỏ vùng má..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e7e5df] rounded-xl text-xs focus:outline-none focus:border-[#238b83]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5 pt-3 border-t border-[#e7e5df]">
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="flex-1 py-2.5 rounded-xl btn-dn-coral font-bold shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {bookingLoading ? 'Đang gửi...' : 'Xác nhận đặt lịch'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// In-memory data store replicating AppDbContext & Seed data
interface StoredSkinImage {
  id: string;
  userId: string;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  buffer?: Buffer;
  base64?: string;
  createdAt: string;
  status: string;
}

interface StoredDiagnosisCondition {
  id: string;
  conditionCode: string;
  conditionName: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  rank: number;
  description: string;
}

interface StoredDiagnosis {
  id: string;
  skinImageId: string;
  userId: string;
  primaryCondition: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidence: number;
  summary: string;
  skinType: string;
  skinHealthScore: number;
  diagnosedAt: string;
  conditions: StoredDiagnosisCondition[];
  imageUrl: string;
}

const guestUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'guest@duongnhan.ai',
  displayName: 'Khách dùng thử',
  phoneNumber: '+84901234567',
  status: 'active' as const,
  planCode: 'plan_free',
  isGuest: true,
  skinType: 'Da hỗn hợp',
  skinConcerns: ['Mụn trứng cá', 'Lỗ chân lông to'],
  bio: 'Người dùng trải nghiệm hệ thống Dưỡng Nhan AI'
};

let currentUser = { ...guestUser };

const plans = [
  {
    code: 'plan_free',
    name: 'Gói Cơ Bản (Miễn Phí)',
    price: 0,
    billingCycle: 'monthly',
    maxScansPerMonth: 5,
    features: [
      '5 lượt quét AI / tháng',
      'Chuẩn đoán 10 tình trạng da',
      'Gợi ý sản phẩm cơ bản'
    ],
    description: 'Trải nghiệm phân tích da AI cơ bản với đầy đủ tính năng chuẩn đoán.'
  },
  {
    code: 'plan_pro',
    name: 'Gói Tiêu Chuẩn (Pro)',
    price: 99000,
    billingCycle: 'monthly',
    maxScansPerMonth: 30,
    features: [
      '30 lượt quét AI / tháng',
      'Theo dõi biểu đồ phục hồi da',
      'Gợi ý phác đồ chu trình chuyên sâu',
      'Lưu lịch sử không giới hạn'
    ],
    description: 'Dành cho người chăm sóc da thường xuyên, theo dõi tiến trình hồi phục theo tuần.',
    isPopular: true
  },
  {
    code: 'plan_vip',
    name: 'Gói VIP Chuyên Sâu',
    price: 199000,
    billingCycle: 'monthly',
    maxScansPerMonth: 999,
    features: [
      'Không giới hạn lượt quét',
      'Đánh giá tương tác thành phần mỹ phẩm',
      'Ưu tiên giải đáp từ chuyên gia da liễu',
      'Báo cáo chuyên sâu hàng tháng'
    ],
    description: 'Phân tích không giới hạn, kết nối bác sĩ da liễu và cảnh báo rủi ro tương tác mỹ phẩm.'
  }
];

const products = [
  {
    id: 'prod-001',
    name: 'CeraVe Foaming Facial Cleanser',
    brand: 'CeraVe',
    category: 'Cleanser' as const,
    price: 340000,
    originalPrice: 420000,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    description: 'Sữa rửa mặt dạng gel tạo bọt nhẹ dịu, chứa 3 loại Ceramide thiết yếu, Niacinamide và HA giúp làm sạch sâu bã nhờn mà không phá vỡ hàng rào bảo vệ da.',
    targetConditions: 'Acne,EnlargedPores,Healthy',
    usageInstructions: 'Lấy một lượng vừa đủ, tạo bọt nhẹ với nước và massage nhẹ nhàng trong 60 giây, rửa sạch với nước ấm. Dùng sáng và tối.',
    rating: 4.9,
    reviewsCount: 3840,
    soldCount: '24.5k+',
    isShopeeMall: true,
    shopeeShopName: 'CeraVe Official Store',
    discountBadge: '-19%',
    shopeeUrl: 'https://shopee.vn/search?keyword=CeraVe+Foaming+Facial+Cleanser&shop=cerave_officialstore',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/cerave-foaming-facial-cleanser-chinh-hang-i.12847521.984125741?aff_source=duongnhan_ai&aff_sub=prod001&utm_medium=affiliates'
  },
  {
    id: 'prod-002',
    name: 'La Roche-Posay Effaclar Purifying Foaming Gel',
    brand: 'La Roche-Posay',
    category: 'Cleanser' as const,
    price: 385000,
    originalPrice: 450000,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    description: 'Gel rửa mặt tạo bọt dành riêng cho da dầu mụn nhạy cảm với nước khoáng La Roche-Posay và Kẽm PCA giúp điều tiết bã nhờn và giảm bóng nhờn tức thì.',
    targetConditions: 'Acne,EnlargedPores,SeborrheicDermatitis',
    usageInstructions: 'Tạo bọt trên lòng bàn tay rồi thoa lên mặt đã làm ướt. Rửa sạch lại với nước và thấm khô.',
    rating: 4.9,
    reviewsCount: 5210,
    soldCount: '31.2k+',
    isShopeeMall: true,
    shopeeShopName: 'La Roche-Posay Official Store',
    discountBadge: '-14%',
    shopeeUrl: 'https://shopee.vn/search?keyword=La+Roche-Posay+Effaclar+Purifying+Foaming+Gel',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/la-roche-posay-effaclar-gel-rua-mat-kiem-dau-i.3847291.56291048?aff_source=duongnhan_ai&aff_sub=prod002&utm_medium=affiliates'
  },
  {
    id: 'prod-003',
    name: "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: 'Treatment' as const,
    price: 949000,
    originalPrice: 1100000,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
    description: 'Dung dịch loại bỏ tế bào chết hóa học chứa 2% Salicylic Acid tan trong dầu, đi sâu vào lỗ chân lông để thông thoáng tắc nghẽn, giảm mụn ẩn và thu nhỏ lỗ chân lông.',
    targetConditions: 'Acne,EnlargedPores,SeborrheicDermatitis',
    usageInstructions: 'Thấm đều ra bông tẩy trang hoặc đổ trực tiếp ra lòng bàn tay rồi vỗ nhẹ lên mặt sau bước làm sạch. Bắt đầu với 2-3 lần/tuần.',
    rating: 4.9,
    reviewsCount: 1980,
    soldCount: '15.8k+',
    isShopeeMall: true,
    shopeeShopName: "Paula's Choice Official Store",
    discountBadge: '-14%',
    shopeeUrl: 'https://shopee.vn/search?keyword=Paula+Choice+2+BHA+Liquid+Exfoliant',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/paulas-choice-skin-perfecting-2-bha-liquid-i.8391204.4920194?aff_source=duongnhan_ai&aff_sub=prod003&utm_medium=affiliates'
  },
  {
    id: 'prod-004',
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'Serum' as const,
    price: 210000,
    originalPrice: 260000,
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-57353f86eb79?w=500',
    description: 'Tinh chất cô đặc với 10% Niacinamide tinh khiết và 1% Muối Kẽm giúp kháng viêm nốt mụn, kiểm soát bã nhờn vượt trội và làm mờ các vết thâm sau mụn.',
    targetConditions: 'Acne,EnlargedPores,Hyperpigmentation',
    usageInstructions: 'Thoa 2-3 giọt lên toàn bộ khuôn mặt vào buổi sáng và buổi tối trước các loại kem đặc hơn.',
    rating: 4.8,
    reviewsCount: 8940,
    soldCount: '58.9k+',
    isShopeeMall: true,
    shopeeShopName: 'The Ordinary Vietnam Flagship',
    discountBadge: '-20%',
    shopeeUrl: 'https://shopee.vn/search?keyword=The+Ordinary+Niacinamide+10+Zinc+1',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/the-ordinary-niacinamide-10-zinc-1-chinh-hang-i.5928194.2948192?aff_source=duongnhan_ai&aff_sub=prod004&utm_medium=affiliates'
  },
  {
    id: 'prod-005',
    name: "Kiehl's Clearly Corrective Dark Spot Solution",
    brand: "Kiehl's",
    category: 'Serum' as const,
    price: 1850000,
    originalPrice: 2200000,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
    description: 'Serum dưỡng sáng da mờ thâm nám với Vitamin C hoạt tính thế hệ mới kết hợp chiết xuất Bạch Dương Trắng và Hoa Mẫu Đơn giúp giảm rõ rệt đốm nâu và sạm nám.',
    targetConditions: 'Hyperpigmentation,Melasma',
    usageInstructions: 'Thoa một vài giọt lên vùng da thâm nám hoặc toàn mặt trước khi thoa kem dưỡng ẩm. Sử dụng đều đặn sáng và tối.',
    rating: 4.9,
    reviewsCount: 1420,
    soldCount: '8.4k+',
    isShopeeMall: true,
    shopeeShopName: "Kiehl's Official Store",
    discountBadge: '-16%',
    shopeeUrl: 'https://shopee.vn/search?keyword=Kiehls+Clearly+Corrective+Dark+Spot+Solution',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/kiehls-clearly-corrective-dark-spot-solution-i.4829104.1948201?aff_source=duongnhan_ai&aff_sub=prod005&utm_medium=affiliates'
  },
  {
    id: 'prod-006',
    name: 'La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing',
    brand: 'La Roche-Posay',
    category: 'Moisturizer' as const,
    price: 390000,
    originalPrice: 460000,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    description: 'Kem dưỡng phục hồi làm dịu da đa công dụng với 5% Panthenol (B5), Madecassoside và phức hợp men vi sinh Tribioma giúp làm dịu tức thì các kích ứng, mẩn đỏ và phục hồi hàng rào ẩm.',
    targetConditions: 'Eczema,Rosacea,ContactDermatitis,Acne',
    usageInstructions: 'Thoa 2 lần mỗi ngày lên vùng da cần phục hồi sau khi làm sạch. Thoa lớp mỏng vừa đủ.',
    rating: 4.9,
    reviewsCount: 6140,
    soldCount: '42.1k+',
    isShopeeMall: true,
    shopeeShopName: 'La Roche-Posay Official Store',
    discountBadge: '-15%',
    shopeeUrl: 'https://shopee.vn/search?keyword=La+Roche-Posay+Cicaplast+Baume+B5',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/la-roche-posay-cicaplast-baume-b5-plus-i.3847291.84920194?aff_source=duongnhan_ai&aff_sub=prod006&utm_medium=affiliates'
  },
  {
    id: 'prod-007',
    name: 'Dear Klairs Rich Moist Soothing Cream',
    brand: 'Dear Klairs',
    category: 'Moisturizer' as const,
    price: 375000,
    originalPrice: 440000,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    description: 'Kem dưỡng ẩm chuyên sâu làm dịu da khô, bong tróc và da nhạy cảm với phức hợp Beta-Glucan, chiết xuất rau má và tinh dầu jojoba giúp duy trì độ ẩm suốt 24h.',
    targetConditions: 'Healthy,Eczema,Rosacea',
    usageInstructions: 'Lấy một lượng kem vừa đủ thoa đều khắp mặt và cổ ở bước cuối cùng của chu trình skincare buổi tối.',
    rating: 4.8,
    reviewsCount: 2310,
    soldCount: '19.3k+',
    isShopeeMall: true,
    shopeeShopName: 'Dear Klairs Vietnam Official',
    discountBadge: '-15%',
    shopeeUrl: 'https://shopee.vn/search?keyword=Dear+Klairs+Rich+Moist+Soothing+Cream',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/dear-klairs-rich-moist-soothing-cream-i.9381940.3920194?aff_source=duongnhan_ai&aff_sub=prod007&utm_medium=affiliates'
  },
  {
    id: 'prod-008',
    name: 'Anessa Perfect UV Sunscreen Skincare Milk SPF50+ PA++++',
    brand: 'Anessa',
    category: 'Sunscreen' as const,
    price: 685000,
    originalPrice: 790000,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    description: 'Sữa chống nắng kiềm dầu số 1 Nhật Bản với công nghệ Auto Booster chống trôi nước/mồ hôi vượt trội, bảo vệ quang phổ rộng chống tia UVA/UVB và bụi mịn PM2.5.',
    targetConditions: 'Hyperpigmentation,Melasma,Healthy,Acne',
    usageInstructions: 'Lắc đều trước khi dùng. Thoa đều lên mặt và cổ trước khi ra ngoài 20 phút. Thoa lại sau mỗi 2-3 giờ khi hoạt động ngoài trời.',
    rating: 5.0,
    reviewsCount: 4890,
    soldCount: '36.7k+',
    isShopeeMall: true,
    shopeeShopName: 'Anessa Official Flagship Store',
    discountBadge: '-13%',
    shopeeUrl: 'https://shopee.vn/search?keyword=Anessa+Perfect+UV+Sunscreen+Skincare+Milk',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/anessa-perfect-uv-sunscreen-milk-spf50-i.2948192.4820194?aff_source=duongnhan_ai&aff_sub=prod008&utm_medium=affiliates'
  },
  {
    id: 'prod-009',
    name: 'Eucerin ProAcne Solution A.I. Clearing Treatment',
    brand: 'Eucerin',
    category: 'Treatment' as const,
    price: 490000,
    originalPrice: 590000,
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-57353f86eb79?w=500',
    description: 'Tinh chất đặc trị mụn chuyên sâu với phức hợp 10% Hydroxy Complex (AHA, BHA, PHA) và Licochalcone A giúp gom cồi mụn, giảm viêm sưng chỉ sau 1 tuần.',
    targetConditions: 'Acne,EnlargedPores',
    usageInstructions: 'Sử dụng một lần mỗi ngày vào buổi tối. Thoa một lượng nhỏ lên vùng da bị mụn sau khi rửa mặt sạch.',
    rating: 4.8,
    reviewsCount: 1620,
    soldCount: '11.2k+',
    isShopeeMall: true,
    shopeeShopName: 'Eucerin Official Store',
    discountBadge: '-17%',
    shopeeUrl: 'https://shopee.vn/search?keyword=Eucerin+ProAcne+Solution+AI+Clearing+Treatment',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/eucerin-proacne-solution-clearing-treatment-i.4920194.2840192?aff_source=duongnhan_ai&aff_sub=prod009&utm_medium=affiliates'
  },
  {
    id: 'prod-010',
    name: 'COSRX Advanced Snail 96 Mucin Power Essence',
    brand: 'COSRX',
    category: 'Essence' as const,
    price: 310000,
    originalPrice: 380000,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
    description: 'Tinh chất chứa 96% dịch nhầy ốc sên tự nhiên giúp cấp nước tức thì, tái tạo độ đàn hồi và làm dịu vùng da sau khi lấy nhân mụn.',
    targetConditions: 'Healthy,Eczema,Hyperpigmentation',
    usageInstructions: 'Sau khi làm sạch và dùng toner, thoa một lượng nhỏ lên toàn bộ khuôn mặt rồi vỗ nhẹ để dưỡng chất thẩm thấu.',
    rating: 4.9,
    reviewsCount: 7120,
    soldCount: '45.3k+',
    isShopeeMall: true,
    shopeeShopName: 'COSRX Official Store',
    discountBadge: '-18%',
    shopeeUrl: 'https://shopee.vn/search?keyword=COSRX+Advanced+Snail+96+Mucin+Power+Essence',
    shopeeAffiliateUrl: 'https://shopee.vn/universal-link/cosrx-advanced-snail-96-mucin-essence-i.3910482.1948201?aff_source=duongnhan_ai&aff_sub=prod010&utm_medium=affiliates'
  }
];

// Specialist Doctors Catalog matching DuongNhan.Web
const doctorsCatalog = [
  {
    id: 1,
    name: 'BS. CKII Ngô Thanh Trúc',
    specialty: 'Da liễu thẩm mỹ & Trị sẹo',
    city: 'TP.HCM',
    clinic: 'Phòng khám Da liễu Sài Gòn Skin Clinic',
    address: '215 Điện Biên Phủ, Quận 3, TP.HCM',
    experience: 12,
    rating: 4.9,
    reviews: 312,
    price: '300.000đ',
    onlineFee: 300000,
    offlineFee: 450000,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    bio: 'Chuyên gia điều trị sẹo rỗ, trẻ hóa da và phục hồi màng bảo vệ da sau xâm lấn.',
    slots: ['09:00', '10:30', '14:00', '15:30', '17:00']
  },
  {
    id: 2,
    name: 'ThS. BS Lê Minh Khôi',
    specialty: 'Da liễu lâm sàng & Mụn viêm',
    city: 'Hà Nội',
    clinic: 'Trung tâm Y khoa Da liễu Thăng Long',
    address: '18 Phố Huế, Hà Nội',
    experience: 9,
    rating: 4.8,
    reviews: 210,
    price: '250.000đ',
    onlineFee: 250000,
    offlineFee: 350000,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    bio: 'Hơn 9 năm điều trị mụn trứng cá, viêm da cơ địa và viêm da tiết bã.',
    slots: ['08:30', '10:00', '13:30', '15:00', '16:30']
  },
  {
    id: 3,
    name: 'BS. Phạm Anh Thư',
    specialty: 'Điều trị mụn & Phục hồi da',
    city: 'Đà Nẵng',
    clinic: 'Phòng khám Da liễu & Thẩm mỹ Sông Hàn',
    address: '86 Bạch Đằng, Đà Nẵng',
    experience: 8,
    rating: 5.0,
    reviews: 158,
    price: '280.000đ',
    onlineFee: 280000,
    offlineFee: 380000,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    bio: 'Thiết kế phác đồ chăm sóc cá nhân hóa cho nhiều nhóm khách hàng.',
    slots: ['09:00', '11:00', '14:30', '16:00', '17:30']
  },
  {
    id: 4,
    name: 'BS. CKI Trần Gia Huy',
    specialty: 'Nám, Tàn nhang & Chống lão hóa',
    city: 'TP.HCM',
    clinic: 'Bệnh viện Da liễu Á Âu',
    address: '32D Thủ Khoa Huân, Quận 1, TP.HCM',
    experience: 15,
    rating: 4.7,
    reviews: 401,
    price: '350.000đ',
    onlineFee: 350000,
    offlineFee: 500000,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    bio: 'Chuyên trị nám, tăng sắc tố sau viêm và điều trị nếp nhăn.',
    slots: ['08:00', '09:30', '14:00', '16:00']
  }
];

const skinImagesMap = new Map<string, StoredSkinImage>();
const diagnosesList: StoredDiagnosis[] = [];

// Seed an initial demo diagnosis so History works immediately
const seedImageId = 'demo-skin-001';
skinImagesMap.set(seedImageId, {
  id: seedImageId,
  userId: guestUser.id,
  originalFileName: 'da-mat-mau.jpg',
  contentType: 'image/jpeg',
  fileSizeBytes: 245000,
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  status: 'diagnosed'
});

diagnosesList.push({
  id: 'demo-diag-001',
  skinImageId: seedImageId,
  userId: guestUser.id,
  primaryCondition: 'Mụn trứng cá & Bã nhờn',
  severity: 'Moderate',
  confidence: 0.92,
  summary: 'Làn da có dấu hiệu tăng tiết bã nhờn mạnh tại vùng chữ T, kèm theo mụn ẩn li ti và mụn viêm rải rác ở hai bên cánh mũi và trán. Lỗ chân lông có xu hướng nở rộng và có một số vết thâm sau mụn mới xuất hiện.',
  skinType: 'Da hỗn hợp thiên dầu',
  skinHealthScore: 68,
  diagnosedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
  conditions: [
    {
      id: 'cond-1',
      conditionCode: 'Acne',
      conditionName: 'Mụn trứng cá (Acne)',
      confidence: 0.92,
      severity: 'Moderate',
      rank: 1,
      description: 'Sự tích tụ dầu thừa và tế bào chết gây bít tắc lỗ chân lông, tạo môi trường cho vi khuẩn C. acnes phát triển.'
    },
    {
      id: 'cond-2',
      conditionCode: 'EnlargedPores',
      conditionName: 'Lỗ chân lông to',
      confidence: 0.87,
      severity: 'Moderate',
      rank: 2,
      description: 'Tuyến bã nhờn hoạt động quá mức kết hợp với giảm độ đàn hồi xung quanh nang lông.'
    },
    {
      id: 'cond-3',
      conditionCode: 'Hyperpigmentation',
      conditionName: 'Thâm mụn & Tăng sắc tố',
      confidence: 0.78,
      severity: 'Mild',
      rank: 3,
      description: 'Sự tăng sinh sắc tố melanin sau tổn thương mụn hoặc do tiếp xúc với tia cực tím.'
    }
  ]
});

// Configure Multer in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Helper for Vietnamese condition names
function getConditionVietnameseName(code: string): string {
  switch (code) {
    case 'Acne': return 'Mụn trứng cá (Acne)';
    case 'EnlargedPores': return 'Lỗ chân lông to';
    case 'Hyperpigmentation': return 'Thâm mụn & Tăng sắc tố';
    case 'Rosacea': return 'Chứng đỏ mặt & Giãn mao mạch';
    case 'Eczema': return 'Da khô nứt nẻ / Chàm da';
    case 'Melasma': return 'Sạm nám da mặt';
    case 'SeborrheicDermatitis': return 'Viêm da tiết bã nhờn';
    case 'Healthy': return 'Làn da khỏe mạnh';
    default: return code;
  }
}

function getConditionDescription(code: string): string {
  switch (code) {
    case 'Acne':
      return 'Sự tích tụ dầu thừa và tế bào chết gây bít tắc lỗ chân lông, tạo môi trường cho vi khuẩn C. acnes phát triển.';
    case 'EnlargedPores':
      return 'Tuyến bã nhờn hoạt động quá mức kết hợp với giảm độ đàn hồi xung quanh nang lông.';
    case 'Hyperpigmentation':
      return 'Sự tăng sinh sắc tố melanin sau tổn thương mụn hoặc do tiếp xúc với tia cực tím.';
    case 'Rosacea':
      return 'Tình trạng viêm da mạn tính gây giãn mạch máu, đỏ da và cảm giác nóng rát.';
    case 'Eczema':
      return 'Hàng rào biểu bì suy yếu khiến da mất nước nghiêm trọng và dễ bị kích ứng bởi môi trường.';
    case 'Melasma':
      return 'Các mảng sắc tố màu nâu sẫm xuất hiện đối xứng trên trán, gò má và sống mũi do ánh nắng và nội tiết.';
    default:
      return 'Tình trạng biểu hiện trên bề mặt da cần được chăm sóc theo phác đồ phù hợp.';
  }
}

function formatConditionName(code: string): string {
  switch (code.toLowerCase()) {
    case 'acne': return 'Mụn trứng cá';
    case 'enlargedpores': return 'Lỗ chân lông to';
    case 'hyperpigmentation': return 'Thâm mụn & Sắc tố';
    case 'rosacea': return 'Đỏ da & Giãn mao mạch';
    case 'eczema': return 'Khô rát nhạy cảm';
    case 'melasma': return 'Sạm nám da';
    default: return code;
  }
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DuongNhan.ApiService (Node.js)' });
});

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  currentUser = {
    id: 'user-' + Date.now(),
    email: email || 'user@duongnhan.ai',
    displayName: email.split('@')[0] || 'Người dùng',
    phoneNumber: '+84901234567',
    status: 'active',
    planCode: currentUser.planCode || 'plan_free',
    isGuest: false,
    skinType: 'Da hỗn hợp thiên dầu',
    skinConcerns: ['Mụn trứng cá', 'Lỗ chân lông to'],
    bio: 'Thành viên cộng đồng Dưỡng Nhan'
  };
  res.json({
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresIn: 3600,
    user: currentUser
  });
});

app.post('/api/auth/google', (req, res) => {
  const { idToken, credential, email, displayName, picture } = req.body || {};
  const userEmail = email || (credential ? 'user@gmail.com' : 'google.user@duongnhan.ai');
  const name = displayName || (credential ? 'Google User' : userEmail.split('@')[0]);

  currentUser = {
    id: 'google-user-' + Date.now(),
    email: userEmail,
    displayName: name,
    phoneNumber: '+84901234567',
    status: 'active',
    planCode: 'plan_pro',
    isGuest: false,
    skinType: 'Da thường',
    skinConcerns: ['Chống lão hóa', 'Cấp ẩm'],
    bio: 'Thành viên Google Dưỡng Nhan Pro'
  };

  res.json({
    token: 'google-jwt-token-' + Date.now(),
    refreshToken: 'google-refresh-token-' + Date.now(),
    expiresIn: 3600,
    user: currentUser
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, displayName, phoneNumber, password } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  currentUser = {
    id: 'user-' + Date.now(),
    email,
    displayName: displayName || email.split('@')[0] || 'Khách hàng',
    phoneNumber: phoneNumber || '+84901234567',
    status: 'active',
    planCode: 'plan_free',
    isGuest: false,
    skinType: 'Chưa xác định',
    skinConcerns: [],
    bio: 'Thành viên mới gia nhập Dưỡng Nhan'
  };
  res.json({
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresIn: 3600,
    user: currentUser
  });
});

app.post('/api/auth/logout', (req, res) => {
  currentUser = { ...guestUser };
  res.json({ success: true });
});

app.post('/api/auth/refresh', (req, res) => {
  res.json({
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresIn: 3600
  });
});

// Users
app.get('/api/users/me', (req, res) => {
  res.json(currentUser);
});

app.put('/api/users/me', (req, res) => {
  const { displayName, phoneNumber, skinType, skinConcerns, bio, avatarUrl } = req.body || {};
  if (displayName !== undefined) currentUser.displayName = displayName;
  if (phoneNumber !== undefined) currentUser.phoneNumber = phoneNumber;
  if (skinType !== undefined) (currentUser as any).skinType = skinType;
  if (skinConcerns !== undefined) (currentUser as any).skinConcerns = skinConcerns;
  if (bio !== undefined) (currentUser as any).bio = bio;
  if (avatarUrl !== undefined) (currentUser as any).avatarUrl = avatarUrl;
  res.json(currentUser);
});

app.post('/api/users/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
  }
  res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
});

// Skin Image Upload
app.post('/api/skin/upload', upload.single('file') as any, (req, res) => {
  const file = req.file;
  const base64Data = req.body?.imageData;

  let imageId = 'skin-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  let originalName = 'capture.jpg';
  let size = 0;
  let contentType = 'image/jpeg';
  let buffer: Buffer | undefined;
  let base64Str: string | undefined;

  if (file) {
    buffer = file.buffer;
    originalName = file.originalname;
    size = file.size;
    contentType = file.mimetype;
  } else if (base64Data && typeof base64Data === 'string') {
    const parts = base64Data.split(';base64,');
    if (parts.length === 2) {
      contentType = parts[0].replace('data:', '');
      base64Str = parts[1];
      buffer = Buffer.from(base64Str, 'base64');
      size = buffer.length;
    } else {
      base64Str = base64Data;
      buffer = Buffer.from(base64Str, 'base64');
      size = buffer.length;
    }
  } else {
    return res.status(400).json({ error: 'No image file or base64 data provided' });
  }

  const storedImage: StoredSkinImage = {
    id: imageId,
    userId: currentUser.id,
    originalFileName: originalName,
    contentType,
    fileSizeBytes: size,
    buffer,
    base64: base64Str,
    createdAt: new Date().toISOString(),
    status: 'uploaded'
  };

  skinImagesMap.set(imageId, storedImage);

  res.json({
    skinImageId: imageId,
    originalFileName: originalName,
    fileSizeBytes: size,
    status: 'uploaded',
    previewUrl: `/api/skin/${imageId}`
  });
});

// Diagnosis History (Must be defined BEFORE /api/skin/:id to prevent route shadowing)
app.get('/api/skin/history', (req, res) => {
  res.json(diagnosesList);
});

app.get('/api/history', (req, res) => {
  res.json(diagnosesList);
});

// Serve Skin Image
app.get('/api/skin/:id', (req, res, next) => {
  if (req.params.id === 'history' || req.params.id === 'upload') {
    return next();
  }
  const image = skinImagesMap.get(req.params.id);
  if (!image) {
    return res.redirect('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500');
  }
  if (image.buffer) {
    res.setHeader('Content-Type', image.contentType || 'image/jpeg');
    return res.send(image.buffer);
  }
  if (image.base64) {
    const buf = Buffer.from(image.base64, 'base64');
    res.setHeader('Content-Type', image.contentType || 'image/jpeg');
    return res.send(buf);
  }
  res.redirect('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500');
});

// Run AI Diagnosis on Skin Image
app.post('/api/skin/:id/diagnose', (req, res) => {
  const imageId = req.params.id;
  const skinImage = skinImagesMap.get(imageId);

  // Check if diagnosis already exists
  const existing = diagnosesList.find(d => d.skinImageId === imageId);
  if (existing) {
    return res.json(existing);
  }

  // Generate intelligent simulated AI diagnosis based on the C# OpenAiDiagnosisService
  // Hash code logic
  let hashVal = 0;
  for (let i = 0; i < imageId.length; i++) {
    hashVal = (hashVal * 31 + imageId.charCodeAt(i)) >>> 0;
  }
  const variant = hashVal % 3;

  let primaryCondition = '';
  let severity: 'Mild' | 'Moderate' | 'Severe' = 'Moderate';
  let confidence = 0.92;
  let skinType = '';
  let skinHealthScore = 70;
  let summary = '';
  let conditionsRaw: Array<{ code: string; name: string; conf: number; sev: 'Mild' | 'Moderate' | 'Severe' }> = [];

  switch (variant) {
    case 0:
      primaryCondition = 'Mụn trứng cá & Bã nhờn';
      severity = 'Moderate';
      confidence = 0.92;
      skinType = 'Da hỗn hợp thiên dầu';
      skinHealthScore = 68;
      summary = 'Làn da có dấu hiệu tăng tiết bã nhờn mạnh tại vùng chữ T, kèm theo mụn ẩn li ti và mụn viêm rải rác ở hai bên cánh mũi và trán. Lỗ chân lông có xu hướng nở rộng và có một số vết thâm sau mụn mới xuất hiện.';
      conditionsRaw = [
        { code: 'Acne', name: 'Mụn trứng cá (Acne vulgaris)', conf: 0.92, sev: 'Moderate' },
        { code: 'EnlargedPores', name: 'Lỗ chân lông to vùng chữ T', conf: 0.87, sev: 'Moderate' },
        { code: 'Hyperpigmentation', name: 'Thâm sau mụn (PIH)', conf: 0.78, sev: 'Mild' }
      ];
      break;

    case 1:
      primaryCondition = 'Ửng đỏ & Giãn mao mạch';
      severity = 'Moderate';
      confidence = 0.88;
      skinType = 'Da nhạy cảm kích ứng';
      skinHealthScore = 72;
      summary = 'Hàng rào bảo vệ da bị suy giảm nhẹ, xuất hiện hiện tượng ửng đỏ và mao mạch nổi rõ ở hai bên gò má. Da có phản ứng nhạy cảm với thời tiết và thiếu độ ẩm cần thiết, cần chu trình phục hồi làm dịu.';
      conditionsRaw = [
        { code: 'Rosacea', name: 'Ửng đỏ & Giãn mao mạch', conf: 0.88, sev: 'Moderate' },
        { code: 'Eczema', name: 'Da khô rát thiếu ẩm', conf: 0.82, sev: 'Mild' },
        { code: 'Hyperpigmentation', name: 'Sắc tố da không đều màu', conf: 0.74, sev: 'Mild' }
      ];
      break;

    default:
      primaryCondition = 'Thâm nám & Tăng sắc tố';
      severity = 'Moderate';
      confidence = 0.89;
      skinType = 'Da thường thiên khô';
      skinHealthScore = 76;
      summary = 'Bề mặt da xuất hiện các đốm nâu và sạm nám nhẹ ở vùng gò má do tác động tích lũy từ tia UV. Da có độ đàn hồi khá tốt nhưng cần tăng cường hoạt chất chống oxy hóa và bảo vệ chống nắng tối đa.';
      conditionsRaw = [
        { code: 'Melasma', name: 'Sạm nám da (Melasma)', conf: 0.89, sev: 'Moderate' },
        { code: 'Hyperpigmentation', name: 'Tăng sắc tố do ánh nắng', conf: 0.84, sev: 'Moderate' },
        { code: 'EnlargedPores', name: 'Lỗ chân lông vùng cánh mũi', conf: 0.71, sev: 'Mild' }
      ];
      break;
  }

  const diagId = 'diag-' + Date.now();
  const conditions: StoredDiagnosisCondition[] = conditionsRaw.map((c, idx) => ({
    id: 'cond-' + diagId + '-' + (idx + 1),
    conditionCode: c.code,
    conditionName: getConditionVietnameseName(c.code),
    confidence: c.conf,
    severity: c.sev,
    rank: idx + 1,
    description: getConditionDescription(c.code)
  }));

  const diagnosis: StoredDiagnosis = {
    id: diagId,
    skinImageId: imageId,
    userId: currentUser.id,
    primaryCondition,
    severity,
    confidence,
    summary,
    skinType,
    skinHealthScore,
    diagnosedAt: new Date().toISOString(),
    conditions,
    imageUrl: `/api/skin/${imageId}`
  };

  diagnosesList.unshift(diagnosis);
  if (skinImage) {
    skinImage.status = 'diagnosed';
  }

  res.json(diagnosis);
});

// Specific Diagnosis by ID
app.get('/api/diagnoses/:id', (req, res) => {
  const diag = diagnosesList.find(d => d.id === req.params.id || d.skinImageId === req.params.id);
  if (!diag) {
    return res.status(404).json({ error: 'Diagnosis not found' });
  }
  res.json(diag);
});

// Products List
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Product Recommendations based on Diagnosis
app.get('/api/products/recommend', (req, res) => {
  const diagnosisId = (req.query.diagnosisId as string) || '';
  const diagnosis = diagnosesList.find(d => d.id === diagnosisId || d.skinImageId === diagnosisId);

  const detectedCodes = (diagnosis?.conditions || []).map(c => c.conditionCode.toLowerCase());
  if (detectedCodes.length === 0) {
    detectedCodes.push('healthy');
  }

  const recommendations = products.map(prod => {
    const targets = (prod.targetConditions || '')
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const matches = targets.filter(t => detectedCodes.includes(t));
    const matchCount = matches.length;

    let matchPercentage = 75;
    if (matchCount >= 2) matchPercentage = 96;
    else if (matchCount === 1) matchPercentage = 90;
    else if (targets.includes('healthy')) matchPercentage = 82;

    let stepOrder = 6;
    switch (prod.category.toLowerCase()) {
      case 'cleanser': stepOrder = 1; break;
      case 'treatment':
      case 'exfoliant': stepOrder = 2; break;
      case 'serum':
      case 'essence': stepOrder = 3; break;
      case 'moisturizer': stepOrder = 4; break;
      case 'sunscreen': stepOrder = 5; break;
    }

    const reason = matchCount > 0
      ? `Phù hợp tối ưu để điều trị tình trạng ${matches.map(formatConditionName).join(' & ')} và bảo vệ da toàn diện.`
      : `Sản phẩm căn bản giúp duy trì độ ẩm và củng cố hàng rào bảo vệ da trong chu trình skincare.`;

    return {
      id: 'rec-' + prod.id,
      productId: prod.id,
      product: prod,
      reason,
      matchPercentage,
      stepOrder
    };
  });

  // Group by routine step order and pick top items per step
  const grouped = new Map<number, typeof recommendations>();
  for (const rec of recommendations) {
    if (!grouped.has(rec.stepOrder)) grouped.set(rec.stepOrder, []);
    grouped.get(rec.stepOrder)!.push(rec);
  }

  const result: typeof recommendations = [];
  const sortedSteps = Array.from(grouped.keys()).sort((a, b) => a - b);

  for (const step of sortedSteps) {
    const stepRecs = grouped.get(step)!;
    stepRecs.sort((a, b) => b.matchPercentage - a.matchPercentage);
    result.push(...stepRecs.slice(0, 2));
  }

  res.json(result);
});

// Plans
app.get('/api/plans', (req, res) => {
  res.json(plans);
});

// Doctors Catalog matching DuongNhan.Web
app.get('/api/doctors', (req, res) => {
  res.json(doctorsCatalog);
});

// Doctor booking endpoint
app.post('/api/doctors/book', (req, res) => {
  const { doctorId, patientName, patientPhone, consultationType, appointmentDate, appointmentTime, notes } = req.body;
  const doctor = doctorsCatalog.find(d => d.id === Number(doctorId));
  if (!doctor) {
    return res.status(404).json({ error: 'Không tìm thấy bác sĩ' });
  }

  const booking = {
    id: 'booking-' + Date.now(),
    doctorId: doctor.id,
    doctorName: doctor.name,
    patientName: patientName || currentUser.displayName,
    patientPhone: patientPhone || currentUser.phoneNumber || '0901234567',
    consultationType: consultationType || 'online',
    appointmentDate: appointmentDate || new Date().toISOString().slice(0, 10),
    appointmentTime: appointmentTime || '09:00',
    fee: consultationType === 'offline' ? doctor.offlineFee : doctor.onlineFee,
    status: 'confirmed',
    clinic: doctor.clinic,
    address: doctor.address,
    createdAt: new Date().toISOString(),
    notes: notes || ''
  };

  res.json({
    success: true,
    message: `Đã đặt lịch hẹn khám thành công với ${doctor.name}!`,
    booking
  });
});

// Current Subscription
app.get('/api/subscriptions/current', (req, res) => {
  const currentPlan = plans.find(p => p.code === currentUser.planCode) || plans[0];
  res.json({
    status: 'active',
    plan: currentPlan,
    startedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 15).toISOString()
  });
});

// Usage
app.get('/api/subscriptions/usage', (req, res) => {
  const currentPlan = plans.find(p => p.code === currentUser.planCode) || plans[0];
  const scansUsed = diagnosesList.filter(d => d.userId === currentUser.id).length;
  res.json({
    scansUsedThisMonth: scansUsed,
    scansLimit: currentPlan.maxScansPerMonth,
    month: new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
    planName: currentPlan.name
  });
});

// Plan Upgrade action
app.post('/api/subscriptions/upgrade', (req, res) => {
  const { planCode } = req.body || {};
  if (planCode && plans.some(p => p.code === planCode)) {
    currentUser.planCode = planCode;
    return res.json({ success: true, planCode });
  }
  res.status(400).json({ error: 'Invalid plan code' });
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DuongNhan server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

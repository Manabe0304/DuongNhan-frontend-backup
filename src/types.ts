export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  status: 'active' | 'inactive';
  planCode: string;
  avatarUrl?: string;
  isGuest?: boolean;
  skinType?: string;
  skinConcerns?: string[];
  bio?: string;
  createdAt?: string;
}

export interface SkinCondition {
  id: string;
  conditionCode: string;
  conditionName: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  rank: number;
  description: string;
}

export interface Diagnosis {
  id: string;
  skinImageId: string;
  primaryCondition: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidence: number;
  summary: string;
  skinType: string;
  skinHealthScore: number;
  diagnosedAt: string;
  conditions: SkinCondition[];
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Cleanser' | 'Treatment' | 'Exfoliant' | 'Serum' | 'Essence' | 'Moisturizer' | 'Sunscreen';
  price: number;
  originalPrice?: number;
  imageUrl: string;
  description: string;
  targetConditions: string;
  usageInstructions: string;
  rating?: number;
  reviewsCount?: number;
  soldCount?: string;
  isShopeeMall?: boolean;
  shopeeShopName?: string;
  discountBadge?: string;
  shopeeUrl?: string;
  shopeeAffiliateUrl?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  city: string;
  clinic: string;
  address: string;
  experience: number;
  rating: number;
  reviews: number;
  price: string;
  onlineFee: number;
  offlineFee: number;
  image: string;
  bio: string;
  slots: string[];
}

export interface DoctorBooking {
  id: string;
  doctorId: number;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  consultationType: 'online' | 'offline';
  appointmentDate: string;
  appointmentTime: string;
  fee: number;
  status: 'confirmed';
  clinic: string;
  address: string;
  createdAt: string;
  notes?: string;
}

export interface ProductRecommendation {
  id: string;
  productId: string;
  product: Product;
  reason: string;
  matchPercentage: number;
  stepOrder: number;
}

export interface Plan {
  code: string;
  name: string;
  price: number;
  billingCycle: string;
  maxScansPerMonth: number;
  features: string[];
  description: string;
  isPopular?: boolean;
}

export interface UsageInfo {
  scansUsedThisMonth: number;
  scansLimit: number;
  month: string;
  planName: string;
}

export interface UploadSkinResponse {
  skinImageId: string;
  originalFileName: string;
  fileSizeBytes: number;
  status: string;
  previewUrl: string;
}

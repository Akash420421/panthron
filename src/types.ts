export type Category = string;

export interface HeroSlide {
  id: string;
  image: string;
  productId: string;
  alt: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  tags: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentDetails {
  method: 'credit_card' | 'paypal' | 'apple_pay' | 'cash_on_delivery';
  cardNumberLast4?: string;
  cardBrand?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  status: OrderStatus;
  couponCode?: string;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  addresses: ShippingAddress[];
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: Category;
  brands: string[];
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

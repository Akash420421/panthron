import { createClient, InsForgeClient } from '@insforge/sdk';

const baseUrl = (import.meta as any).env?.VITE_INSFORGE_BASE_URL || 'https://v6434crk.ap-southeast.insforge.app';
const anonKey = (import.meta as any).env?.VITE_INSFORGE_ANON_KEY;

export const insforge: InsForgeClient = createClient({
  baseUrl,
  anonKey,
  db: { schema: 'public' },
});

export function mapRowToProduct(row: any): Product {
  const safeNumber = (v: any, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    id: row.product_id ?? ('prod-' + Math.random().toString(36).slice(2, 10)),
    name: row.name ?? '',
    brand: row.brand ?? '',
    category: (row.category ?? 'All') as any,
    price: safeNumber(row.price),
    originalPrice: row.original_price != null ? safeNumber(row.original_price) : undefined,
    rating: safeNumber(row.rating ?? 5, 5),
    reviewCount: safeNumber(row.review_count ?? 0),
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description ?? '',
    features: Array.isArray(row.features) ? row.features : [],
    specs: row.specs && typeof row.specs === 'object' ? row.specs : {},
    stock: safeNumber(row.stock ?? 0),
    isFeatured: row.is_featured ?? false,
    isNew: row.is_new ?? false,
    isTrending: row.is_trending ?? false,
    tags: Array.isArray(row.tags) ? row.tags : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
  };
}

export function mapProductToRow(p: Omit<Product, 'id'> & { id?: string }): any {
  const row: any = {
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    original_price: p.originalPrice ?? null,
    rating: p.rating ?? 0,
    review_count: p.reviewCount ?? 0,
    images: p.images,
    description: p.description ?? null,
    features: p.features,
    specs: p.specs,
    stock: p.stock,
    is_featured: p.isFeatured ?? false,
    is_new: p.isNew ?? false,
    is_trending: p.isTrending ?? false,
    tags: p.tags,
    reviews: p.reviews ?? [],
  };
  if (p.id) row.product_id = p.id;
  return row;
}

export function mapRowToCoupon(row: any): Coupon {
  const safeNumber = (v: any, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    id: row.coupon_id ?? ('coup-' + Math.random().toString(36).slice(2, 10)),
    code: row.code ?? '',
    discountType: (row.discount_type ?? 'percentage') as any,
    discountValue: safeNumber(row.discount_value),
    minPurchase: safeNumber(row.min_purchase ?? 0),
    maxDiscount: row.max_discount != null ? safeNumber(row.max_discount) : undefined,
    expiryDate: row.expiry_date ?? '',
    isActive: row.is_active ?? true,
    usageCount: safeNumber(row.usage_count ?? 0),
  };
}

export function mapCouponToRow(c: Omit<Coupon, 'id'> & { id?: string }): any {
  const row: any = {
    code: c.code,
    discount_type: c.discountType,
    discount_value: c.discountValue,
    min_purchase: c.minPurchase,
    max_discount: c.maxDiscount ?? null,
    expiry_date: c.expiryDate ?? null,
    is_active: c.isActive,
    usage_count: c.usageCount ?? 0,
  };
  if (c.id) row.coupon_id = c.id;
  return row;
}

export function mapRowToOrder(row: any): Order {
  const safeNumber = (v: any, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const safeItem = (it: any) => ({
    productId: it?.productId ?? it?.product_id ?? '',
    productName: it?.productName ?? it?.product_name ?? '',
    productImage: it?.productImage ?? it?.product_image ?? '',
    price: safeNumber(it?.price),
    quantity: safeNumber(it?.quantity),
    color: it?.color,
    size: it?.size,
  });
  const items = Array.isArray(row.items) ? row.items.map(safeItem) : [];
  return {
    id: row.order_id ?? ('ORD-' + Math.random().toString(36).slice(2, 10)),
    userId: row.user_id ?? '',
    userName: row.user_name ?? '',
    userEmail: row.user_email ?? '',
    items,
    subtotal: safeNumber(row.subtotal),
    discount: safeNumber(row.discount ?? 0),
    shippingFee: safeNumber(row.shipping_fee ?? 0),
    tax: safeNumber(row.tax ?? 0),
    total: safeNumber(row.total),
    shippingAddress: row.shipping_address && typeof row.shipping_address === 'object' ? row.shipping_address : {} as any,
    paymentDetails: row.payment_details && typeof row.payment_details === 'object' ? row.payment_details : {} as any,
    status: (row.status ?? 'pending') as any,
    couponCode: row.coupon_code ?? undefined,
    createdAt: row.created_at_str ?? '',
    estimatedDelivery: row.estimated_delivery ?? '',
    trackingNumber: row.tracking_number ?? '',
    timeline: Array.isArray(row.timeline) ? row.timeline : [],
  };
}

export function mapOrderToRow(o: Omit<Order, 'id'> & { id?: string }): any {
  const row: any = {
    user_id: o.userId ?? null,
    user_name: o.userName ?? null,
    user_email: o.userEmail ?? null,
    items: o.items,
    subtotal: o.subtotal,
    discount: o.discount,
    shipping_fee: o.shippingFee,
    tax: o.tax,
    total: o.total,
    shipping_address: o.shippingAddress,
    payment_details: o.paymentDetails,
    status: o.status,
    coupon_code: o.couponCode ?? null,
    created_at_str: o.createdAt ?? null,
    estimated_delivery: o.estimatedDelivery ?? null,
    tracking_number: o.trackingNumber ?? null,
    timeline: o.timeline,
  };
  if (o.id) row.order_id = o.id;
  return row;
}

export interface CompanySettings {
  settingId: string;
  companyName: string;
  memberName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

export function mapRowToSettings(row: any): CompanySettings {
  return {
    settingId: row.setting_id,
    companyName: row.company_name || 'PANTHRON',
    memberName: row.member_name || '',
    phone: row.phone || '',
    whatsapp: row.whatsapp || '',
    email: row.email || '',
    address: row.address || '',
  };
}

export function mapSettingsToRow(s: Partial<CompanySettings> & { settingId?: string }): any {
  const row: any = {
    company_name: s.companyName ?? '',
    member_name: s.memberName ?? null,
    phone: s.phone ?? null,
    whatsapp: s.whatsapp ?? null,
    email: s.email ?? null,
    address: s.address ?? null,
  };
  if (s.settingId) row.setting_id = s.settingId;
  return row;
}

export interface CategoryRow {
  categoryId: string;
  name: string;
  sortOrder: number;
}

export function mapRowToCategory(row: any): Category {
  return row.name as any;
}

export function mapRowToCategoryObj(row: any): CategoryRow {
  return {
    categoryId: row.category_id,
    name: row.name,
    sortOrder: Number(row.sort_order ?? 0),
  };
}

import type { Product, Coupon, Order, Category } from '../types';

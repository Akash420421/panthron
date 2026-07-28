import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  CartItem, 
  WishlistItem, 
  Order, 
  Coupon, 
  User, 
  FilterState, 
  ToastMessage,
  OrderStatus,
  ShippingAddress,
  PaymentDetails,
  ProductReview,
  Category
} from '../types';
import { INITIAL_USER } from '../data/initialData';
import {
  insforge,
  mapRowToProduct,
  mapProductToRow,
  mapRowToCoupon,
  mapCouponToRow,
  mapRowToOrder,
  mapOrderToRow,
  mapRowToSettings,
  mapSettingsToRow,
  mapRowToCategory,
  mapRowToCategoryObj,
  CompanySettings,
  CategoryRow,
} from '../lib/insforge';

export type PageRoute = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'orders' 
  | 'order-detail' 
  | 'account' 
  | 'wishlist' 
  | 'admin';

interface ShopContextType {
  currentRoute: PageRoute;
  selectedProductId: string | null;
  selectedOrderId: string | null;
  navigateTo: (route: PageRoute, params?: { productId?: string; orderId?: string }) => void;

  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => Promise<void>;
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => Promise<void>;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  refreshProducts: () => Promise<void>;

  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => Promise<void>;
  toggleCouponStatus: (id: string) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  refreshCoupons: () => Promise<void>;

  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  user: User;
  setUserRole: (role: 'customer' | 'admin') => void;
  toggleUserRole: () => void;
  updateUserProfile: (data: Partial<User>) => void;

  orders: Order[];
  createOrder: (shippingAddress: ShippingAddress, paymentDetails: PaymentDetails) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refreshOrders: () => Promise<void>;
  
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTax: number;
  cartTotal: number;

  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  isSyncing: boolean;

  categories: Category[];
  categoryObjs: CategoryRow[];
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;

  companySettings: CompanySettings;
  refreshCompanySettings: () => Promise<void>;
  updateCompanySettings: (s: Partial<CompanySettings>) => Promise<void>;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'All',
  brands: [],
  priceRange: [0, 500],
  minRating: 0,
  inStockOnly: false,
  sortBy: 'featured'
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categoryObjs, setCategoryObjs] = useState<CategoryRow[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    settingId: 'main',
    companyName: 'PANTHRON Official',
    memberName: 'Akash Singh',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'support@panthron.in',
    address: 'Panthron Store, India',
  });

  const categories: Category[] = categoryObjs.map(c => c.name as any);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sz_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('sz_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('sz_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      setIsSyncing(true);
      const { data, error } = await insforge.database.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message || JSON.stringify(error));
      const mapped = (data || []).map(mapRowToProduct);
      setProducts(mapped);
    } catch (e: any) {
      console.error('Error loading products:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [addToast]);

  const refreshCoupons = useCallback(async () => {
    try {
      const { data, error } = await insforge.database.from('coupons').select('*').order('usage_count', { ascending: false });
      if (error) throw new Error(error.message || JSON.stringify(error));
      setCoupons((data || []).map(mapRowToCoupon));
    } catch (e: any) {
      console.error('Error loading coupons:', e);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const { data, error } = await insforge.database.from('orders').select('*').order('created_at_str', { ascending: false });
      if (error) throw new Error(error.message || JSON.stringify(error));
      setOrders((data || []).map(mapRowToOrder));
    } catch (e: any) {
      console.error('Error loading orders:', e);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const { data, error } = await insforge.database.from('categories').select('*').order('sort_order');
      if (error) throw new Error(error.message || JSON.stringify(error));
      const rows = (data || []).map(mapRowToCategoryObj);
      if (rows.length === 0) {
        setCategoryObjs([
          { categoryId: 'fallback-0', name: 'All', sortOrder: 0 },
          { categoryId: 'fallback-1', name: 'Sleeper', sortOrder: 1 },
          { categoryId: 'fallback-2', name: 'Electronics', sortOrder: 2 },
          { categoryId: 'fallback-3', name: 'Fashion', sortOrder: 3 },
          { categoryId: 'fallback-4', name: 'Home & Living', sortOrder: 4 },
          { categoryId: 'fallback-5', name: 'Beauty', sortOrder: 5 },
          { categoryId: 'fallback-6', name: 'Sports', sortOrder: 6 },
          { categoryId: 'fallback-7', name: 'Accessories', sortOrder: 7 },
        ]);
      } else {
        setCategoryObjs(rows);
      }
    } catch (e: any) {
      console.error('Error loading categories:', e);
      setCategoryObjs([
        { categoryId: 'fallback-0', name: 'All', sortOrder: 0 },
        { categoryId: 'fallback-1', name: 'Sleeper', sortOrder: 1 },
        { categoryId: 'fallback-2', name: 'Electronics', sortOrder: 2 },
        { categoryId: 'fallback-3', name: 'Fashion', sortOrder: 3 },
        { categoryId: 'fallback-4', name: 'Home & Living', sortOrder: 4 },
        { categoryId: 'fallback-5', name: 'Beauty', sortOrder: 5 },
        { categoryId: 'fallback-6', name: 'Sports', sortOrder: 6 },
        { categoryId: 'fallback-7', name: 'Accessories', sortOrder: 7 },
      ]);
    }
  }, []);

  const refreshCompanySettings = useCallback(async () => {
    try {
      const { data, error } = await insforge.database.from('company_settings').select('*').eq('setting_id', 'main');
      if (error) throw new Error(error.message || JSON.stringify(error));
      if (data && data.length > 0) {
        setCompanySettings(mapRowToSettings(data[0]));
      }
    } catch (e: any) {
      console.error('Error loading settings:', e);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshCoupons();
    refreshOrders();
    refreshCategories();
    refreshCompanySettings();
  }, [refreshProducts, refreshCoupons, refreshOrders, refreshCategories, refreshCompanySettings]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshProducts();
      refreshCoupons();
      refreshOrders();
      refreshCategories();
      refreshCompanySettings();
    }, 15000);
    return () => clearInterval(interval);
  }, [refreshProducts, refreshCoupons, refreshOrders, refreshCategories, refreshCompanySettings]);

  useEffect(() => {
    localStorage.setItem('sz_cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('sz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem('sz_user', JSON.stringify(user));
  }, [user]);

  const navigateTo = (route: PageRoute, params?: { productId?: string; orderId?: string }) => {
    setCurrentRoute(route);
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.orderId) setSelectedOrderId(params.orderId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const addProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    const newId = 'prod-' + Date.now();
    const row = mapProductToRow({ ...productData, id: newId, rating: 5, reviewCount: 0, reviews: [] });
    try {
      const { error } = await insforge.database.from('products').insert([row]);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshProducts();
      addToast(`Product "${newId}" created successfully!`, 'success');
    } catch (e: any) {
      console.error('addProduct error:', e);
      addToast('Failed to create product: ' + (e.message || ''), 'error');
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const updateRow = mapProductToRow(updatedFields as any);
      delete updateRow.product_id;
      const { error } = await insforge.database.from('products').update(updateRow).eq('product_id', id);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshProducts();
      addToast('Product updated successfully!', 'success');
    } catch (e: any) {
      console.error('updateProduct error:', e);
      addToast('Failed to update product: ' + (e.message || ''), 'error');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await insforge.database.from('products').delete().eq('product_id', id);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshProducts();
      addToast('Product removed.', 'info');
    } catch (e: any) {
      console.error('deleteProduct error:', e);
      addToast('Failed to delete product: ' + (e.message || ''), 'error');
    }
  };

  const addProductReview = async (productId: string, reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      const newReview: ProductReview = {
        ...reviewData,
        id: 'rev-' + Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      const updatedReviews = [newReview, ...product.reviews];
      const avgRating = updatedReviews.reduce((s, r) => s + r.rating, 0) / updatedReviews.length;
      const updated = {
        reviews: updatedReviews,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: updatedReviews.length,
      };
      const row = { reviews: updated.reviews, rating: updated.rating, review_count: updated.reviewCount };
      const { error } = await insforge.database.from('products').update(row).eq('product_id', productId);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshProducts();
      addToast('Thank you! Your review has been published.', 'success');
    } catch (e: any) {
      console.error('addProductReview error:', e);
      addToast('Failed to post review: ' + (e.message || ''), 'error');
    }
  };

  const addToCart = (product: Product, quantity: number = 1, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock),
          selectedColor: selectedColor || updated[existingIndex].selectedColor,
          selectedSize: selectedSize || updated[existingIndex].selectedSize
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor, selectedSize }];
      }
    });
    addToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prev) => prev.map((item) => item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.stock) } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed from cart.', 'info');
  };

  const clearCart = () => { setCart([]); setAppliedCoupon(null); };

  const cartSubtotal = cart.reduce((sum, item) => sum + (Number(item.product.price) || 0) * (Number(item.quantity) || 0), 0);
  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= (Number(appliedCoupon.minPurchase) || 0)) {
    if (appliedCoupon.discountType === 'percentage') {
      cartDiscount = (cartSubtotal * (Number(appliedCoupon.discountValue) || 0)) / 100;
      if (appliedCoupon.maxDiscount && cartDiscount > (Number(appliedCoupon.maxDiscount) || 0)) cartDiscount = Number(appliedCoupon.maxDiscount) || 0;
    } else cartDiscount = Number(appliedCoupon.discountValue) || 0;
  }
  const freeShippingThreshold = 75;
  const cartShippingFee = cartSubtotal === 0 ? 0 : cartSubtotal >= freeShippingThreshold ? 0 : 12.00;
  const cartTax = Number(((cartSubtotal - cartDiscount) * 0.08).toFixed(2));
  const cartTotal = Number(Math.max(0, cartSubtotal - cartDiscount + cartShippingFee + cartTax).toFixed(2));

  const applyCouponCode = (code: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);
    if (!found) return { success: false, message: 'Invalid or expired promo code.' };
    if (cartSubtotal < found.minPurchase) return { success: false, message: `Code requires a minimum spend of $${found.minPurchase.toFixed(2)}.` };
    setAppliedCoupon(found);
    addToast(`Promo code "${found.code}" applied!`, 'success');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => { setAppliedCoupon(null); addToast('Coupon removed.', 'info'); };

  const addCoupon = async (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newId = 'coup-' + Date.now();
    const row = mapCouponToRow({ ...couponData, id: newId, usageCount: 0 });
    try {
      const { error } = await insforge.database.from('coupons').insert([row]);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshCoupons();
      addToast(`Coupon "${newId}" created!`, 'success');
    } catch (e: any) {
      console.error('addCoupon error:', e);
      addToast('Failed to create coupon: ' + (e.message || ''), 'error');
    }
  };

  const toggleCouponStatus = async (id: string) => {
    try {
      const coupon = coupons.find(c => c.id === id);
      if (!coupon) return;
      const { error } = await insforge.database.from('coupons').update({ is_active: !coupon.isActive }).eq('coupon_id', id);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshCoupons();
    } catch (e: any) {
      console.error('toggleCouponStatus error:', e);
      addToast('Failed to update coupon: ' + (e.message || ''), 'error');
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await insforge.database.from('coupons').delete().eq('coupon_id', id);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshCoupons();
      addToast('Coupon deleted.', 'info');
    } catch (e: any) {
      console.error('deleteCoupon error:', e);
      addToast('Failed to delete coupon: ' + (e.message || ''), 'error');
    }
  };

  const addCategory = async (name: string) => {
    const newId = 'cat-' + Date.now();
    try {
      const nextOrder = categoryObjs.length;
      const { error } = await insforge.database.from('categories').insert([{ category_id: newId, name, sort_order: nextOrder }]);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshCategories();
      addToast(`Category "${name}" added.`, 'success');
    } catch (e: any) {
      console.error('addCategory error:', e);
      addToast('Failed to add category: ' + (e.message || ''), 'error');
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      const { error } = await insforge.database.from('categories').update({ name }).eq('category_id', id);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshCategories();
      addToast(`Category renamed to "${name}".`, 'success');
    } catch (e: any) {
      console.error('updateCategory error:', e);
      addToast('Failed to rename category: ' + (e.message || ''), 'error');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await insforge.database.from('categories').delete().eq('category_id', id);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshCategories();
      addToast('Category deleted.', 'info');
    } catch (e: any) {
      console.error('deleteCategory error:', e);
      addToast('Failed to delete category: ' + (e.message || ''), 'error');
    }
  };

  const updateCompanySettings = async (s: Partial<CompanySettings>) => {
    try {
      const existing = categoryObjs.length > -1;
      const row = mapSettingsToRow({ ...s, settingId: 'main' });
      const { data: existingData }: any = await insforge.database.from('company_settings').select('*').eq('setting_id', 'main');
      let err;
      if (existingData && existingData.length > 0) {
        const updRow = { ...row };
        delete updRow.setting_id;
        const r: any = await insforge.database.from('company_settings').update(updRow).eq('setting_id', 'main');
        err = r.error;
      } else {
        const r: any = await insforge.database.from('company_settings').insert([row]);
        err = r.error;
      }
      if (err) throw new Error(err.message || JSON.stringify(err));
      await refreshCompanySettings();
      addToast('Company settings saved!', 'success');
    } catch (e: any) {
      console.error('updateCompanySettings error:', e);
      addToast('Failed to save settings: ' + (e.message || ''), 'error');
    }
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.product.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.product.id !== product.id));
      addToast(`Removed "${product.name}" from Wishlist.`, 'info');
    } else {
      setWishlist((prev) => [...prev, { product, addedAt: new Date().toISOString().split('T')[0] }]);
      addToast(`Saved "${product.name}" to Wishlist!`, 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.some((item) => item.product.id === productId);

  const setUserRole = (role: 'customer' | 'admin') => setUser((prev) => ({ ...prev, role }));

  const toggleUserRole = () => {
    const newRole = user.role === 'customer' ? 'admin' : 'customer';
    setUser((prev) => ({ ...prev, role: newRole }));
    addToast(`Switched view to ${newRole.toUpperCase()} mode.`, 'info');
    if (newRole === 'admin') navigateTo('admin'); else navigateTo('home');
  };

  const updateUserProfile = (data: Partial<User>) => { setUser((prev) => ({ ...prev, ...data })); addToast('Profile updated!', 'success'); };

  const createOrder = async (shippingAddress: ShippingAddress, paymentDetails: PaymentDetails): Promise<Order> => {
    const orderItems = cart.map((item) => ({
      productId: item.product.id, productName: item.product.name, productImage: item.product.images[0],
      price: item.product.price, quantity: item.quantity, color: item.selectedColor, size: item.selectedSize,
    }));
    const now = new Date();
    const estDeliveryDate = new Date(now.setDate(now.getDate() + 4)).toISOString().split('T')[0];
    const newOrderId = 'SZ-' + Math.floor(10000 + Math.random() * 90000);

    const newOrder: Order = {
      id: newOrderId, userId: user.id, userName: shippingAddress.fullName || user.name,
      userEmail: shippingAddress.email || user.email, items: orderItems, subtotal: cartSubtotal,
      discount: cartDiscount, shippingFee: cartShippingFee, tax: cartTax, total: cartTotal,
      shippingAddress, paymentDetails, status: 'pending' as OrderStatus,
      couponCode: appliedCoupon?.code, createdAt: new Date().toISOString(),
      estimatedDelivery: estDeliveryDate, trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}-US`,
      timeline: [{ status: 'pending' as OrderStatus, timestamp: new Date().toLocaleString(), description: 'Order placed and payment authorized.' }],
    };

    try {
      const { error } = await insforge.database.from('orders').insert([mapOrderToRow(newOrder)]);
      if (error) throw new Error(error.message || JSON.stringify(error));

      const updates: Promise<any>[] = [];
      cart.forEach((item) => {
        const newStock = Math.max(0, item.product.stock - item.quantity);
        updates.push(insforge.database.from('products').update({ stock: newStock }).eq('product_id', item.product.id).select() as any);
      });
      if (appliedCoupon) {
        updates.push(insforge.database.from('coupons').update({ usage_count: appliedCoupon.usageCount + 1 }).eq('coupon_id', appliedCoupon.id).select() as any);
      }
      await Promise.all(updates);

      await Promise.all([refreshProducts(), refreshCoupons(), refreshOrders()]);
      clearCart();
      addToast('Order placed successfully!', 'success');
      return newOrder;
    } catch (e: any) {
      console.error('createOrder error:', e);
      addToast('Failed to create order: ' + (e.message || ''), 'error');
      throw e;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const statusDescriptions: Record<OrderStatus, string> = {
      pending: 'Order confirmed and awaiting fulfillment',
      processing: 'Order being processed and packed',
      shipped: 'Order dispatched with courier',
      out_for_delivery: 'Package out for final delivery',
      delivered: 'Package delivered to address',
      cancelled: 'Order has been cancelled',
    };
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      const newEntry = { status, timestamp: new Date().toLocaleString(), description: statusDescriptions[status] };
      const newTimeline = [...order.timeline, newEntry];
      const { error } = await insforge.database.from('orders').update({ status, timeline: newTimeline }).eq('order_id', orderId);
      if (error) throw new Error(error.message || JSON.stringify(error));
      await refreshOrders();
      addToast(`Order ${orderId} status updated to ${status.toUpperCase()}.`, 'info');
    } catch (e: any) {
      console.error('updateOrderStatus error:', e);
      addToast('Failed to update order: ' + (e.message || ''), 'error');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        currentRoute, selectedProductId, selectedOrderId, navigateTo,
        products, addProduct, updateProduct, deleteProduct, addProductReview,
        quickViewProduct, setQuickViewProduct, refreshProducts,
        filters, setFilters, resetFilters,
        cart, addToCart, updateCartQuantity, removeFromCart, clearCart,
        isCartDrawerOpen, setIsCartDrawerOpen,
        coupons, appliedCoupon, applyCouponCode, removeCoupon,
        addCoupon, toggleCouponStatus, deleteCoupon, refreshCoupons,
        wishlist, toggleWishlist, isInWishlist,
        user, setUserRole, toggleUserRole, updateUserProfile,
        orders, createOrder, updateOrderStatus, refreshOrders,
        cartSubtotal, cartDiscount, cartShippingFee, cartTax, cartTotal,
        toasts, addToast, removeToast,
        isSyncing,
        categories, categoryObjs, addCategory, updateCategory, deleteCategory, refreshCategories,
        companySettings, refreshCompanySettings, updateCompanySettings,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Coupon, OrderStatus, Category, HeroSlide, Order } from '../types';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FolderPlus,
  Building2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Settings,
  Images,
  ChevronUp,
  ChevronDown,
  Link as LinkIcon,
  Eye,
  FileText,
  Truck,
  CreditCard,
  Calendar,
  Hash,
  User,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    coupons, 
    addCoupon, 
    toggleCouponStatus, 
    deleteCoupon, 
    user,
    categories,
    categoryObjs,
    addCategory,
    updateCategory,
    deleteCategory,
    companySettings,
    updateCompanySettings,
    heroSlides,
    updateHeroSlides,
    registeredUsers,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'coupons' | 'categories' | 'hero-slides' | 'settings'>('overview');
  const [userSearchQuery, setUserSearchQuery] = useState('');


  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [hsNewImage, setHsNewImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80');
  const [hsNewProductId, setHsNewProductId] = useState('');
  const [hsNewAlt, setHsNewAlt] = useState('');
  const [hsEditingId, setHsEditingId] = useState<string | null>(null);
  const [hsEdImage, setHsEdImage] = useState('');
  const [hsEdProductId, setHsEdProductId] = useState('');
  const [hsEdAlt, setHsEdAlt] = useState('');

  const [productSearch, setProductSearch] = useState('');

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>(categories[1] || 'Electronics');
  const [newProdPrice, setNewProdPrice] = useState('99.99');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('129.99');
  const [newProdStock, setNewProdStock] = useState('25');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80');
  const [newProdFeatured, setNewProdFeatured] = useState(false);
  const [newProdIsNew, setNewProdIsNew] = useState(false);
  const [newProdIsTrending, setNewProdIsTrending] = useState(false);
  const [newProdFeatures, setNewProdFeatures] = useState('Premium craftsmanship\nStandard warranty included');
  const [newProdSpecs, setNewProdSpecs] = useState('');
  const [newProdTags, setNewProdTags] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [epName, setEpName] = useState('');
  const [epBrand, setEpBrand] = useState('');
  const [epCategory, setEpCategory] = useState<Category>('Electronics');
  const [epPrice, setEpPrice] = useState('');
  const [epOriginalPrice, setEpOriginalPrice] = useState('');
  const [epStock, setEpStock] = useState('');
  const [epDesc, setEpDesc] = useState('');
  const [epImg, setEpImg] = useState('');
  const [epImages, setEpImages] = useState<string[]>([]);
  const [epImgInput, setEpImgInput] = useState('');
  const [epFeatured, setEpFeatured] = useState(false);
  const [epIsNew, setEpIsNew] = useState(false);
  const [epIsTrending, setEpIsTrending] = useState(false);
  const [epFeatures, setEpFeatures] = useState('');
  const [epSpecs, setEpSpecs] = useState('');
  const [epTags, setEpTags] = useState('');

  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState('15');
  const [couponMinSpend, setCouponMinSpend] = useState('50');

  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const [sCoName, setSCoName] = useState(companySettings.companyName);
  const [sMemName, setSMemName] = useState(companySettings.memberName);
  const [sPhone, setSPhone] = useState(companySettings.phone);
  const [sWhats, setSWhats] = useState(companySettings.whatsapp);
  const [sEmail, setSEmail] = useState(companySettings.email);
  const [sAddr, setSAddr] = useState(companySettings.address);

  useEffect(() => {
    setSCoName(companySettings.companyName);
    setSMemName(companySettings.memberName);
    setSPhone(companySettings.phone);
    setSWhats(companySettings.whatsapp);
    setSEmail(companySettings.email);
    setSAddr(companySettings.address);
  }, [companySettings]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const lowStockCount = products.filter((p) => p.stock < 15).length;

  const filteredAdminProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdBrand) return;
    const imgs = [newProdImg];
    const feats = newProdFeatures.split('\n').map(s => s.trim()).filter(Boolean);
    let specs: any = { Category: newProdCategory, Brand: newProdBrand };
    try { if (newProdSpecs.trim()) specs = JSON.parse(newProdSpecs); } catch {}
    const tagsArr = newProdTags.split(',').map(s => s.trim()).filter(Boolean);
    if (tagsArr.length === 0) tagsArr.push(newProdCategory, newProdBrand);
    void addProduct({
      name: newProdName,
      brand: newProdBrand,
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 0,
      originalPrice: newProdOriginalPrice ? parseFloat(newProdOriginalPrice) : undefined,
      description: newProdDesc || 'High-quality crafted product.',
      features: feats.length ? feats : ['Premium craftsmanship', 'Standard warranty included'],
      specs,
      images: imgs,
      stock: parseInt(newProdStock) || 10,
      isFeatured: newProdFeatured,
      isNew: newProdIsNew,
      isTrending: newProdIsTrending,
      tags: tagsArr,
    });
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdBrand('');
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEpName(p.name);
    setEpBrand(p.brand);
    setEpCategory(p.category);
    setEpPrice(String(p.price));
    setEpOriginalPrice(p.originalPrice != null ? String(p.originalPrice) : '');
    setEpStock(String(p.stock));
    setEpDesc(p.description);
    setEpImg(p.images[0] || '');
    setEpImages([...p.images]);
    setEpImgInput('');
    setEpFeatured(!!p.isFeatured);
    setEpIsNew(!!p.isNew);
    setEpIsTrending(!!p.isTrending);
    setEpFeatures(Array.isArray(p.features) ? p.features.join('\n') : '');
    setEpSpecs(p.specs && typeof p.specs === 'object' ? JSON.stringify(p.specs, null, 2) : '');
    setEpTags(Array.isArray(p.tags) ? p.tags.join(', ') : '');
  };

  const handleUpdateProductSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const feats = epFeatures.split('\n').map(s => s.trim()).filter(Boolean);
    let specs: any = editingProduct.specs;
    try { if (epSpecs.trim()) specs = JSON.parse(epSpecs); } catch {}
    const tagsArr = epTags.split(',').map(s => s.trim()).filter(Boolean);
    const allImgs = epImg ? [epImg, ...epImages.filter(i => i !== epImg)] : [...epImages];
    void updateProduct(editingProduct.id, {
      name: epName,
      brand: epBrand,
      category: epCategory,
      price: parseFloat(epPrice) || 0,
      originalPrice: epOriginalPrice ? parseFloat(epOriginalPrice) : undefined,
      stock: parseInt(epStock) || 0,
      description: epDesc,
      features: feats,
      specs,
      images: allImgs,
      isFeatured: epFeatured,
      isNew: epIsNew,
      isTrending: epIsTrending,
      tags: tagsArr,
    });
    setEditingProduct(null);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    void addCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      discountValue: parseFloat(couponValue) || 10,
      minPurchase: parseFloat(couponMinSpend) || 0,
      expiryDate: '2026-12-31',
      isActive: true
    });
    setIsAddCouponOpen(false);
    setCouponCode('');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    void addCategory(newCatName.trim());
    setNewCatName('');
  };

  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();
    void updateCompanySettings({
      companyName: sCoName,
      memberName: sMemName,
      phone: sPhone,
      whatsapp: sWhats,
      email: sEmail,
      address: sAddr,
    });
  };

  const productCats: Category[] = categories.filter(c => c !== 'All');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Admin Command Center</h1>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 font-extrabold text-[10px] rounded uppercase border border-amber-500/40">
              Admin Protected
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage inventory, orders, coupons, categories and store contact.
          </p>
        </div>

        <button
          onClick={() => setIsAddProductOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="flex flex-wrap border-b border-zinc-800 text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'overview' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'products' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'orders' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'users' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({registeredUsers.length})</span>
        </button>


        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'coupons' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'categories' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Categories ({categoryObjs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hero-slides')}
          className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'hero-slides' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Images className="w-4 h-4" />
          <span>Hero Slider ({heroSlides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'settings' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-bold">
                <span>Total Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">${(totalRevenue ?? 0).toFixed(2)}</p>
              <p className="text-[11px] text-emerald-400 font-semibold">+18.4% from last month</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-bold">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">{totalOrdersCount}</p>
              <p className="text-[11px] text-amber-400 font-semibold">100% Fulfillment Rate</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-bold">
                <span>Total Products</span>
                <Package className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-2xl font-black text-white">{totalProductsCount}</p>
              <p className="text-[11px] text-zinc-400">Across {categoryObjs.length} categories</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-bold">
                <span>Low Stock Alerts</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl font-black text-rose-400">{lowStockCount}</p>
              <p className="text-[11px] text-rose-400 font-semibold">Requires restocking</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white">Monthly Sales & Revenue Breakdown</h3>
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-zinc-800">
              {[
                { month: 'Jan', val: 40 },
                { month: 'Feb', val: 65 },
                { month: 'Mar', val: 50 },
                { month: 'Apr', val: 80 },
                { month: 'May', val: 70 },
                { month: 'Jun', val: 90 },
                { month: 'Jul', val: 100 }
              ].map((bar) => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full max-w-[40px] bg-zinc-800 group-hover:bg-amber-500 rounded-t-lg transition-all" style={{ height: `${bar.val}%` }} />
                  <span className="text-[10px] font-bold text-zinc-400">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800 gap-3">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-zinc-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-zinc-700"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Product</span>
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Brand & Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Tags</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredAdminProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/40">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-lg bg-zinc-800" />
                      <div>
                        <span className="font-bold text-white truncate max-w-xs block">{p.name}</span>
                        <div className="flex gap-1 mt-0.5">
                          {p.isFeatured && <span className="text-[9px] px-1 rounded bg-rose-500/15 text-rose-400">FEATURED</span>}
                          {p.isNew && <span className="text-[9px] px-1 rounded bg-emerald-500/15 text-emerald-400">NEW</span>}
                          {p.isTrending && <span className="text-[9px] px-1 rounded bg-sky-500/15 text-sky-400">TRENDING</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">{p.brand} · <span className="text-zinc-400">{p.category}</span></td>
                    <td className="p-3.5 font-bold text-amber-400">${(p.price ?? 0).toFixed(2)}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${p.stock < 15 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3.5 text-zinc-400 max-w-[140px] truncate">
                      {Array.isArray(p.tags) ? p.tags.slice(0, 3).join(', ') : ''}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditProduct(p)}
                        className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-800/40">
                  <td className="p-3.5 font-mono font-bold text-amber-400">{o.id}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="font-bold text-white hover:text-amber-400 hover:underline text-left transition-colors flex items-center gap-1.5 group"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
                      {o.userName}
                    </button>
                  </td>
                  <td className="p-3.5 text-zinc-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3.5 font-bold text-white">${(o.total ?? 0).toFixed(2)}</td>
                  <td className="p-3.5">
                    <select
                      value={o.status}
                      onChange={(e) => void updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="bg-zinc-800 text-zinc-100 text-xs px-2.5 py-1 rounded-lg border border-zinc-700 capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <div>
              <h3 className="font-bold text-white text-sm">Registered Customer Directory</h3>
              <p className="text-xs text-zinc-400">View customer profile details, phone numbers, and delivery addresses.</p>
            </div>
            <div className="w-full sm:w-72 relative">
              <input
                type="text"
                placeholder="Search user by name, phone, email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 text-xs text-zinc-100 pl-9 pr-3 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredUsers
              .filter(u => 
                !userSearchQuery ||
                u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                (u.phone && u.phone.includes(userSearchQuery))
              )
              .map((u) => {
                const mainAddress = u.addresses?.[0];
                return (
                  <div key={u.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + u.name}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover bg-zinc-800 border border-zinc-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm truncate">{u.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                            u.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                        <p className="text-zinc-400 truncate mt-0.5">{u.email}</p>
                        {u.phone && (
                          <a href={`tel:${u.phone.replace(/\s/g, '')}`} className="text-amber-400 font-bold hover:underline block mt-0.5">
                            📞 {u.phone}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="bg-zinc-800/80 border border-zinc-700/50 p-3 rounded-xl space-y-1 text-zinc-300">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Primary Delivery Address</p>
                      {mainAddress ? (
                        <>
                          <p className="font-semibold text-white">{mainAddress.fullName}</p>
                          <p className="text-zinc-300">{mainAddress.street}</p>
                          <p className="text-zinc-300">{mainAddress.city}, {mainAddress.state} {mainAddress.zipCode}</p>
                          <p className="text-zinc-400">{mainAddress.country}</p>
                        </>
                      ) : (
                        <p className="text-zinc-500 italic">No address provided yet.</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                      <span>Joined: {u.createdAt || 'Recent'}</span>
                      {u.phone && (
                        <a
                          href={`https://wa.me/${u.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 font-bold hover:underline"
                        >
                          💬 WhatsApp User
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {activeTab === 'coupons' && (

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <h3 className="font-bold text-white text-sm">Active Promo Codes</h3>
            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-amber-400 text-sm">{c.code}</span>
                  <button
                    onClick={() => void toggleCouponStatus(c.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
                <p className="text-zinc-300">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                </p>
                <p className="text-zinc-400 text-[11px]">Min spend: ${c.minPurchase} · Used {c.usageCount} times</p>
                <button onClick={() => void deleteCoupon(c.id)} className="text-[11px] text-rose-400 hover:underline pt-1">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <form onSubmit={handleAddCategory} className="flex gap-3 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <input
              type="text"
              placeholder="New category name (e.g. Jewelry)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 bg-zinc-800 text-xs text-white px-3 py-2 rounded-xl border border-zinc-700"
            />
            <button type="submit" className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryObjs.map((c) => (
              <div key={c.categoryId} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between gap-3">
                {editingCatId === c.categoryId ? (
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={editingCatName}
                      onChange={(e) => setEditingCatName(e.target.value)}
                      className="flex-1 bg-zinc-800 text-xs text-white px-3 py-2 rounded-lg border border-zinc-700"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (editingCatName.trim()) void updateCategory(c.categoryId, editingCatName.trim());
                        setEditingCatId(null);
                      }}
                      className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg"
                    ><Check className="w-3.5 h-3.5" /></button>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="p-1.5 bg-zinc-800 text-zinc-400 rounded-lg"
                    ><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                        <FolderPlus className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white truncate">{c.name}</p>
                        <p className="text-[11px] text-zinc-400">Sort order: {c.sortOrder}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCatId(c.categoryId);
                          setEditingCatName(c.name);
                        }}
                        className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => void deleteCategory(c.categoryId)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'hero-slides' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Images className="w-4 h-4 text-amber-400" />
                Add New Hero Slide
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
              <div className="md:col-span-5">
                <label className="block text-zinc-300 font-semibold mb-1">Image URL</label>
                <input type="text" value={hsNewImage} onChange={(e) => setHsNewImage(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2 rounded-xl border border-zinc-700" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-zinc-300 font-semibold mb-1">Link to Product (optional)</label>
                <select value={hsNewProductId} onChange={(e) => setHsNewProductId(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2 rounded-xl border border-zinc-700">
                  <option value="">— No link (just image) —</option>
                  {products.map(p => (<option key={p.id} value={p.id}>{p.name} ({p.id})</option>))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">Alt Text</label>
                <input type="text" value={hsNewAlt} onChange={(e) => setHsNewAlt(e.target.value)} placeholder="e.g. Summer Sale" className="w-full bg-zinc-800 text-zinc-100 p-2 rounded-xl border border-zinc-700" />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button
                  onClick={() => {
                    if (!hsNewImage.trim()) return;
                    const newSlide: HeroSlide = {
                      id: 'slide-' + Date.now(),
                      image: hsNewImage.trim(),
                      productId: hsNewProductId,
                      alt: hsNewAlt.trim() || 'Hero banner',
                    };
                    void updateHeroSlides([...heroSlides, newSlide]);
                    setHsNewImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80');
                    setHsNewProductId('');
                    setHsNewAlt('');
                  }}
                  className="w-full bg-amber-500 text-zinc-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
            {hsNewImage && (
              <div className="pt-2">
                <p className="text-[10px] text-zinc-400 mb-1 font-semibold uppercase tracking-wider">Preview</p>
                <img src={hsNewImage} alt="preview" referrerPolicy="no-referrer" className="w-full h-32 sm:h-40 object-cover rounded-xl border border-zinc-700 bg-zinc-800" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroSlides.map((slide, idx) => {
              const linkedProduct = products.find(p => p.id === slide.productId);
              const isEditing = hsEditingId === slide.id;
              return (
                <div key={slide.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="relative aspect-[16/7] bg-zinc-800">
                    <img src={slide.image} alt={slide.alt} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur text-amber-400 font-black text-[10px] rounded border border-amber-500/30">
                        #{idx + 1}
                      </span>
                      {slide.productId && (
                        <span className="px-2 py-0.5 bg-sky-500/90 text-white font-bold text-[10px] rounded flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" /> Linked
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => {
                          if (idx === 0) return;
                          const newList = [...heroSlides];
                          [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
                          void updateHeroSlides(newList);
                        }}
                        disabled={idx === 0}
                        className="p-1.5 bg-black/70 backdrop-blur text-white rounded-lg disabled:opacity-30 hover:bg-zinc-700"
                        title="Move up"
                      ><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button
                        onClick={() => {
                          if (idx === heroSlides.length - 1) return;
                          const newList = [...heroSlides];
                          [newList[idx + 1], newList[idx]] = [newList[idx], newList[idx + 1]];
                          void updateHeroSlides(newList);
                        }}
                        disabled={idx === heroSlides.length - 1}
                        className="p-1.5 bg-black/70 backdrop-blur text-white rounded-lg disabled:opacity-30 hover:bg-zinc-700"
                        title="Move down"
                      ><ChevronDown className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {isEditing ? (
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="block text-zinc-300 font-semibold mb-1">Image URL</label>
                          <input type="text" value={hsEdImage} onChange={(e) => setHsEdImage(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2 rounded-lg border border-zinc-700" />
                        </div>
                        <div>
                          <label className="block text-zinc-300 font-semibold mb-1">Link to Product</label>
                          <select value={hsEdProductId} onChange={(e) => setHsEdProductId(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2 rounded-lg border border-zinc-700">
                            <option value="">— No link —</option>
                            {products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-zinc-300 font-semibold mb-1">Alt Text</label>
                          <input type="text" value={hsEdAlt} onChange={(e) => setHsEdAlt(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2 rounded-lg border border-zinc-700" />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              const updated = heroSlides.map(s => s.id === slide.id ? {
                                ...s,
                                image: hsEdImage.trim() || s.image,
                                productId: hsEdProductId,
                                alt: hsEdAlt.trim()
                              } : s);
                              void updateHeroSlides(updated);
                              setHsEditingId(null);
                            }}
                            className="flex-1 bg-amber-500 text-zinc-950 font-bold p-2 rounded-lg flex items-center justify-center gap-1"
                          ><Check className="w-3.5 h-3.5" /> Save</button>
                          <button
                            onClick={() => setHsEditingId(null)}
                            className="px-3 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white"
                          ><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Alt Text</p>
                          <p className="text-sm font-bold text-white">{slide.alt || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Linked Product</p>
                          {linkedProduct ? (
                            <div className="flex items-center gap-2">
                              <img src={linkedProduct.images[0]} alt={linkedProduct.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover bg-zinc-800 border border-zinc-700" />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate">{linkedProduct.name}</p>
                                <p className="text-[11px] text-amber-400 font-semibold">ID: {linkedProduct.id}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-500 italic">Not linked to any product</p>
                          )}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => {
                              setHsEditingId(slide.id);
                              setHsEdImage(slide.image);
                              setHsEdProductId(slide.productId);
                              setHsEdAlt(slide.alt);
                            }}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold p-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
                          ><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                          <button
                            onClick={() => {
                              void updateHeroSlides(heroSlides.filter(s => s.id !== slide.id));
                            }}
                            className="px-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl border border-rose-500/20"
                            title="Delete slide"
                          ><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {heroSlides.length === 0 && (
              <div className="md:col-span-2 bg-zinc-900 border border-dashed border-zinc-700 p-10 rounded-2xl text-center">
                <Images className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-white font-bold">No hero slides yet.</p>
                <p className="text-xs text-zinc-400 mt-1">Add your first banner using the form above.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Building2 className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Store & Company Contact Info</h3>
            </div>
            <p className="text-[11px] text-zinc-400 -mt-2">
              This info appears on the customer order detail screen (below order) and everywhere contact details are shown.
            </p>
            <form onSubmit={handleSaveCompanySettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" /> Company / Store Name
                  </label>
                  <input type="text" value={sCoName} onChange={(e) => setSCoName(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" /> Member / Owner Name
                  </label>
                  <input type="text" value={sMemName} onChange={(e) => setSMemName(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" /> Phone Number
                  </label>
                  <input type="text" value={sPhone} onChange={(e) => setSPhone(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                    <MessageCircle className="w-3.5 h-3.5 text-amber-400" /> WhatsApp Number
                  </label>
                  <input type="text" value={sWhats} onChange={(e) => setSWhats(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" placeholder="+91 98765 43210" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" /> Support Email
                  </label>
                  <input type="email" value={sEmail} onChange={(e) => setSEmail(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> Store Address
                  </label>
                  <textarea value={sAddr} onChange={(e) => setSAddr(e.target.value)} rows={3} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 resize-none" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3 sticky top-[-24px] bg-zinc-900 pt-2 z-10">
                <h3 className="font-bold text-white text-sm">Add New Product</h3>
                <button onClick={() => setIsAddProductOpen(false)} className="p-1 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Product Title *</label>
                  <input type="text" required value={newProdName} onChange={(e) => setNewProdName(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Brand *</label>
                    <input type="text" required value={newProdBrand} onChange={(e) => setNewProdBrand(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Category</label>
                    <select value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value as Category)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700">
                      {productCats.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Price ($)</label>
                    <input type="number" step="0.01" required value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Original Price ($)</label>
                    <input type="number" step="0.01" value={newProdOriginalPrice} onChange={(e) => setNewProdOriginalPrice(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Stock</label>
                    <input type="number" required value={newProdStock} onChange={(e) => setNewProdStock(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Main Image URL</label>
                  <input type="text" value={newProdImg} onChange={(e) => setNewProdImg(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Description</label>
                  <textarea value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} rows={3} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 resize-none" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Features (one per line)</label>
                  <textarea value={newProdFeatures} onChange={(e) => setNewProdFeatures(e.target.value)} rows={3} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Specs (JSON, optional)</label>
                    <textarea value={newProdSpecs} onChange={(e) => setNewProdSpecs(e.target.value)} rows={3} placeholder='{ "Weight": "500g" }' className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 resize-none font-mono text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Tags (comma-separated)</label>
                    <input type="text" value={newProdTags} onChange={(e) => setNewProdTags(e.target.value)} placeholder="Summer, Sale, Limited" className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={newProdFeatured} onChange={(e) => setNewProdFeatured(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                    <span className="font-semibold">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={newProdIsNew} onChange={(e) => setNewProdIsNew(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                    <span className="font-semibold">New</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={newProdIsTrending} onChange={(e) => setNewProdIsTrending(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                    <span className="font-semibold">Trending</span>
                  </label>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl">Create Product</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3 sticky top-[-24px] bg-zinc-900 pt-2 z-10">
                <div>
                  <h3 className="font-bold text-white text-sm">Edit Product</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">{editingProduct.id}</p>
                </div>
                <button onClick={() => setEditingProduct(null)} className="p-1 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleUpdateProductSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Product Title *</label>
                  <input type="text" required value={epName} onChange={(e) => setEpName(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Brand *</label>
                    <input type="text" required value={epBrand} onChange={(e) => setEpBrand(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Category</label>
                    <select value={epCategory} onChange={(e) => setEpCategory(e.target.value as Category)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700">
                      {productCats.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Price ($)</label>
                    <input type="number" step="0.01" required value={epPrice} onChange={(e) => setEpPrice(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Original Price ($)</label>
                    <input type="number" step="0.01" value={epOriginalPrice} onChange={(e) => setEpOriginalPrice(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Stock</label>
                    <input type="number" required value={epStock} onChange={(e) => setEpStock(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Main Image URL</label>
                  <div className="flex gap-2 items-start">
                    <input type="text" value={epImg} onChange={(e) => setEpImg(e.target.value)} className="flex-1 bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                    {epImg && (
                      <img src={epImg} alt="preview" referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover border border-zinc-700 shrink-0 bg-zinc-800" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Additional Images</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {epImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`img-${idx}`} referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover border border-zinc-700 bg-zinc-800" />
                        <button
                          type="button"
                          onClick={() => setEpImages(epImages.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold hidden group-hover:flex items-center justify-center"
                        >×</button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={epImgInput} onChange={(e) => setEpImgInput(e.target.value)} placeholder="Enter URL and click +" className="flex-1 bg-zinc-800 text-zinc-100 p-2 rounded-lg border border-zinc-700" />
                    <button
                      type="button"
                      onClick={() => {
                        if (epImgInput.trim()) {
                          setEpImages([...epImages, epImgInput.trim()]);
                          setEpImgInput('');
                        }
                      }}
                      className="bg-amber-500 text-zinc-950 px-3 rounded-lg font-bold"
                    >+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Description</label>
                  <textarea value={epDesc} onChange={(e) => setEpDesc(e.target.value)} rows={3} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 resize-none" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Features (one per line)</label>
                  <textarea value={epFeatures} onChange={(e) => setEpFeatures(e.target.value)} rows={3} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Specs (JSON)</label>
                    <textarea value={epSpecs} onChange={(e) => setEpSpecs(e.target.value)} rows={3} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 resize-none font-mono text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Tags (comma-separated)</label>
                    <input type="text" value={epTags} onChange={(e) => setEpTags(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={epFeatured} onChange={(e) => setEpFeatured(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                    <span className="font-semibold">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={epIsNew} onChange={(e) => setEpIsNew(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                    <span className="font-semibold">New</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={epIsTrending} onChange={(e) => setEpIsTrending(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                    <span className="font-semibold">Trending</span>
                  </label>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl">Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddCouponOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 className="font-bold text-white text-sm">Create Promo Coupon</h3>
                <button onClick={() => setIsAddCouponOpen(false)} className="p-1 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Coupon Code</label>
                  <input type="text" required placeholder="e.g. FLASH25" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Type</label>
                    <select value={couponType} onChange={(e) => setCouponType(e.target.value as any)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Discount Value</label>
                    <input type="number" required value={couponValue} onChange={(e) => setCouponValue(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Minimum Purchase ($)</label>
                  <input type="number" value={couponMinSpend} onChange={(e) => setCouponMinSpend(e.target.value)} className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700" />
                </div>
                <button type="submit" className="w-full bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl">Save Promo Code</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
              <div className="sticky top-0 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 p-5 flex items-start justify-between gap-4 z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-white text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-400" />
                      Order Details
                    </h3>
                    <span className="px-2.5 py-0.5 bg-amber-500/15 text-amber-400 font-black text-[10px] rounded-lg border border-amber-500/30 font-mono">
                      {selectedOrder.id}
                    </span>
                    <span className={`px-2.5 py-0.5 font-black text-[10px] rounded-lg border capitalize ${
                      selectedOrder.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                      selectedOrder.status === 'cancelled' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                      selectedOrder.status === 'shipped' || selectedOrder.status === 'out_for_delivery' ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' :
                      'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                      {selectedOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                    {selectedOrder.couponCode && (
                      <span className="ml-2 px-2 py-0.5 bg-violet-500/15 text-violet-400 rounded border border-violet-500/30 font-bold">
                        Coupon: {selectedOrder.couponCode}
                      </span>
                    )}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl shrink-0 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <User className="w-3 h-3" /> Customer
                    </p>
                    <p className="text-sm font-black text-white">{selectedOrder.userName}</p>
                    <p className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3 text-zinc-500" /> {selectedOrder.userEmail || '—'}</p>
                    <p className="text-[11px] text-zinc-300 flex items-center gap-1"><Phone className="w-3 h-3 text-zinc-500" /> {selectedOrder.shippingAddress?.phone || '—'}</p>
                  </div>
                  <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Hash className="w-3 h-3" /> Tracking
                    </p>
                    <p className="text-sm font-black text-amber-400 font-mono break-all">{selectedOrder.trackingNumber || '—'}</p>
                    <p className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3 text-zinc-500" />
                      Est. Delivery: <span className="font-bold text-white ml-0.5">{selectedOrder.estimatedDelivery || '—'}</span>
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{selectedOrder.items.length} item{selectedOrder.items.length !== 1 ? 's' : ''} ordered</p>
                  </div>
                  <div className="bg-zinc-950/60 border border-amber-500/30 p-3.5 rounded-2xl space-y-1.5">
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> Payment
                    </p>
                    <div className="flex justify-between text-[11px]"><span className="text-zinc-400">Subtotal</span><span className="text-white font-bold">${(selectedOrder.subtotal ?? 0).toFixed(2)}</span></div>
                    <div className="flex justify-between text-[11px]"><span className="text-zinc-400">Discount</span><span className="text-emerald-400 font-bold">-${(selectedOrder.discount ?? 0).toFixed(2)}</span></div>
                    <div className="flex justify-between text-[11px]"><span className="text-zinc-400">Shipping</span><span className="text-white font-bold">${(selectedOrder.shippingFee ?? 0).toFixed(2)}</span></div>
                    <div className="flex justify-between text-[11px]"><span className="text-zinc-400">Tax</span><span className="text-white font-bold">${(selectedOrder.tax ?? 0).toFixed(2)}</span></div>
                    <div className="pt-1.5 mt-1.5 border-t border-zinc-800 flex justify-between items-baseline">
                      <span className="text-zinc-300 font-bold">TOTAL</span>
                      <span className="text-lg font-black text-amber-400">${(selectedOrder.total ?? 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                    <h4 className="font-black text-white text-sm flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      Items Ordered ({selectedOrder.items.length})
                    </h4>
                  </div>
                  <div className="divide-y divide-zinc-800/70">
                    {selectedOrder.items.length === 0 ? (
                      <p className="p-6 text-center text-zinc-500 text-xs italic">No items record found for this order.</p>
                    ) : selectedOrder.items.map((it, i) => (
                      <div key={i} className="p-4 flex items-center gap-3 hover:bg-zinc-800/30 transition-colors">
                        {it.productImage ? (
                          <img src={it.productImage} alt={it.productName} referrerPolicy="no-referrer" className="w-14 h-14 rounded-xl object-cover bg-zinc-800 border border-zinc-700 shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center text-zinc-600"><Package className="w-6 h-6" /></div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-sm truncate">{it.productName}</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-[11px] text-zinc-400">
                            <span className="font-mono">SKU: {it.productId || '—'}</span>
                            {it.color && <span>Color: <span className="text-zinc-300 font-semibold">{it.color}</span></span>}
                            {it.size && <span>Size: <span className="text-zinc-300 font-semibold">{it.size}</span></span>}
                            <span>Qty: <span className="text-white font-bold">×{it.quantity}</span></span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-amber-400">${(it.price * it.quantity).toFixed(2)}</p>
                          <p className="text-[10px] text-zinc-500">${(it.price ?? 0).toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-2xl space-y-2">
                    <h4 className="font-black text-white text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <Home className="w-3.5 h-3.5 text-amber-400" /> Shipping Address
                    </h4>
                    {selectedOrder.shippingAddress ? (
                      <div className="space-y-0.5 text-[12px] text-zinc-200 pl-5">
                        <p className="font-bold text-white text-sm">{selectedOrder.shippingAddress.fullName}</p>
                        {selectedOrder.shippingAddress.street && <p>{selectedOrder.shippingAddress.street}</p>}
                        {(selectedOrder.shippingAddress.city || selectedOrder.shippingAddress.state || selectedOrder.shippingAddress.zipCode) && (
                          <p>{[selectedOrder.shippingAddress.city, selectedOrder.shippingAddress.state, selectedOrder.shippingAddress.zipCode].filter(Boolean).join(', ')}</p>
                        )}
                        {selectedOrder.shippingAddress.country && <p>{selectedOrder.shippingAddress.country}</p>}
                        {selectedOrder.shippingAddress.phone && <p className="text-zinc-400 pt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedOrder.shippingAddress.phone}</p>}
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-xs italic pl-5">No shipping address on file.</p>
                    )}
                  </div>

                  <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-2xl space-y-2">
                    <h4 className="font-black text-white text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Status Timeline
                    </h4>
                    <div className="space-y-2 pl-5">
                      {Array.isArray(selectedOrder.timeline) && selectedOrder.timeline.length > 0 ? (
                        selectedOrder.timeline.slice().reverse().map((t, i) => (
                          <div key={i} className="relative pl-4 pb-2 border-l-2 border-zinc-700 last:pb-0 last:border-transparent">
                            <div className={`absolute -left-[7px] top-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                              i === 0 ? 'bg-amber-400 ring-2 ring-amber-400/30' : 'bg-zinc-600'
                            }`} />
                            <p className="font-bold text-white text-[11px] capitalize">{t.status?.replace(/_/g, ' ')}</p>
                            <p className="text-[10px] text-zinc-400">{t.timestamp}</p>
                            <p className="text-[11px] text-zinc-300 mt-0.5">{t.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-500 text-xs italic">No timeline entries yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" /> Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

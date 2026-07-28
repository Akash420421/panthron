import { Product, Coupon, Order, User } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AuraSound Pro Noise-Cancelling Headphones',
    brand: 'AuraSound',
    category: 'Electronics',
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Experience studio-quality audio purity with active hybrid noise-cancellation, custom 40mm titanium drivers, and up to 40 hours of playtime.',
    features: [
      'Active Hybrid Noise Cancellation (ANC)',
      '40-Hour Battery Life with Fast Charge (10 min = 5 hrs)',
      'Custom tuned 40mm HD Neodymium Titanium Drivers',
      'Bluetooth 5.3 with multipoint device connection',
      'Ultra-soft memory foam ear cushions'
    ],
    specs: {
      'Frequency Response': '20Hz - 40,000Hz',
      'Battery Capacity': '800 mAh',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.3 & 3.5mm Aux',
      'Warranty': '2 Years Limited'
    },
    stock: 45,
    isFeatured: true,
    isTrending: true,
    tags: ['Headphones', 'Audio', 'Wireless', 'ANC', 'Bestseller'],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Alex Rivera',
        rating: 5,
        date: '2026-06-15',
        comment: 'The noise cancellation is phenomenal! I use these daily for travel and focused work sessions.',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        userName: 'Samantha Lee',
        rating: 4.5,
        date: '2026-07-02',
        comment: 'Super comfortable cushions, impressive soundstage with punchy bass.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'PulseFit Horizon Ultra Smartwatch',
    brand: 'PulseFit',
    category: 'Electronics',
    price: 189.00,
    originalPrice: 229.00,
    rating: 4.7,
    reviewCount: 94,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Next-generation fitness watch with bright AMOLED display, continuous SpO2 & ECG tracking, dual-band GPS, and 14-day battery life.',
    features: [
      '1.43" Always-On HD AMOLED Display',
      'ECG, Heart Rate, SpO2 & Sleep Monitoring',
      '100+ Sports & Outdoor Tracking Modes',
      '5 ATM Water Resistance (50 meters)',
      'Built-in Voice Assistant & Bluetooth Calling'
    ],
    specs: {
      'Screen Size': '1.43 inch AMOLED',
      'Battery Life': 'Up to 14 Days',
      'Waterproof Rating': '5 ATM',
      'Compatibility': 'iOS & Android',
      'Weight': '42g'
    },
    stock: 28,
    isFeatured: true,
    isNew: true,
    tags: ['Smartwatch', 'Fitness', 'GPS', 'Health'],
    reviews: [
      {
        id: 'rev-3',
        userName: 'David Miller',
        rating: 5,
        date: '2026-07-10',
        comment: 'Battery life easily lasts 10-12 days on heavy use. The OLED screen is bright outdoors!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Minimalist Artisan Leather Backpack',
    brand: 'UrbanCraft',
    category: 'Accessories',
    price: 129.50,
    originalPrice: 159.00,
    rating: 4.9,
    reviewCount: 86,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Handcrafted from full-grain top leather with a padded 16-inch laptop compartment, hidden security pocket, and water-resistant lining.',
    features: [
      'Authentic Full-Grain Genuine Leather',
      'Dedicated padded sleeve for up to 16" MacBook/Laptop',
      'Ergonomic padded shoulder straps with breathable mesh',
      'Luggage pass-through strap for travel',
      'YKK weather-resistant zippers'
    ],
    specs: {
      'Material': '100% Full Grain Cowhide Leather',
      'Dimensions': '17.5" H x 12" W x 5.5" D',
      'Capacity': '22 Liters',
      'Laptop Compartment': 'Fits up to 16-inch',
      'Color': 'Vintage Chestnut'
    },
    stock: 12,
    isFeatured: true,
    isTrending: true,
    tags: ['Backpack', 'Leather', 'Travel', 'Laptop Bag', 'Crafted'],
    reviews: [
      {
        id: 'rev-4',
        userName: 'Elena Rostova',
        rating: 5,
        date: '2026-05-20',
        comment: 'The leather smells amazing and patinas beautifully over time. Highly recommended!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'AromaCraft Ceramic Diffuser & Essential Oils',
    brand: 'AromaCraft',
    category: 'Home & Living',
    price: 54.99,
    originalPrice: 69.99,
    rating: 4.6,
    reviewCount: 72,
    images: [
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Transform your living space with silent ultrasonic misting, ambient warm LED lighting, and 100% organic essential oils starter set.',
    features: [
      'Handcrafted Matte Ceramic Cover',
      'Ultrasonic whisper-quiet mist technology',
      '7 Warm ambient light modes with intensity adjustment',
      'Auto shut-off when water level runs low',
      'Includes 3x 10ml Organic Oils: Lavender, Eucalyptus, Citrus'
    ],
    specs: {
      'Water Tank Capacity': '300 ml',
      'Coverage Area': 'Up to 350 sq ft',
      'Timer Options': '1h / 3h / 6h / Continuous',
      'Power Source': 'AC Adapter (Included)'
    },
    stock: 35,
    isFeatured: false,
    tags: ['Aroma', 'Home Decor', 'Essential Oils', 'Wellness'],
    reviews: [
      {
        id: 'rev-5',
        userName: 'Jessica Taylor',
        rating: 4.5,
        date: '2026-06-11',
        comment: 'Makes my bedroom smell like a luxury spa. Soft glow is so soothing at night.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-5',
    name: 'Vogue Luxe Cashmere Blend Knit Sweater',
    brand: 'Vogue Studio',
    category: 'Fashion',
    price: 119.00,
    originalPrice: 149.00,
    rating: 4.9,
    reviewCount: 54,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Ultra-soft Mongolian cashmere blend sweater tailored for timeless elegance, maximum warmth, and breathable all-season layering.',
    features: [
      '70% Fine Grade Merino Wool, 30% Pure Mongolian Cashmere',
      'Relaxed silhouette with ribbed cuffs and hem',
      'Hypoallergenic and gentle on skin',
      'Pre-shrunk fabric treatment'
    ],
    specs: {
      'Material': '70% Wool, 30% Cashmere',
      'Fit': 'Relaxed Modern Fit',
      'Care Instructions': 'Hand wash cold or dry clean',
      'Country of Origin': 'Italy'
    },
    stock: 18,
    isFeatured: true,
    isTrending: true,
    tags: ['Fashion', 'Sweater', 'Cashmere', 'Winter', 'Luxury'],
    reviews: [
      {
        id: 'rev-6',
        userName: 'Michael Brown',
        rating: 5,
        date: '2026-06-29',
        comment: 'Incredible soft touch and premium weight. Fits perfectly.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-6',
    name: 'GlowHydrate Botanical Facial Serum',
    brand: 'GlowHydrate',
    category: 'Beauty',
    price: 42.00,
    originalPrice: 55.00,
    rating: 4.8,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608248597261-5421d55ab365?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Intense hydrating serum infused with multi-weight Hyaluronic Acid, Vitamin C, Niacinamide, and soothing Rosehip Extract.',
    features: [
      'Deep 72-hour moisture retention',
      'Brightens skin tone & reduces fine lines',
      '100% Vegan, Cruelty-free & Dermatologist tested',
      'Non-comedogenic & suitable for sensitive skin'
    ],
    specs: {
      'Volume': '50ml / 1.7 fl oz',
      'Key Ingredients': 'Hyaluronic Acid, Vitamin C, Niacinamide, Rosehip',
      'Skin Type': 'All Skin Types',
      'Shelf Life': '24 Months'
    },
    stock: 50,
    isFeatured: false,
    isNew: true,
    tags: ['Skincare', 'Serum', 'Beauty', 'Organic', 'Hydrate'],
    reviews: [
      {
        id: 'rev-7',
        userName: 'Rachel Adams',
        rating: 5,
        date: '2026-07-04',
        comment: 'My skin has never been this glowing and smooth! Reduced my redness in 3 days.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-7',
    name: 'ProPerformance Carbon Yoga & Exercise Mat',
    brand: 'ProPerformance',
    category: 'Sports',
    price: 68.00,
    originalPrice: 85.00,
    rating: 4.7,
    reviewCount: 63,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Extra-thick 6mm eco-friendly natural rubber grip mat engineered with precision body alignment lines for optimal yoga and fitness form.',
    features: [
      '6mm high-density cushioned support for joints',
      'Non-slip wet & dry dual texture surface',
      'Laser-etched posture guide alignment lines',
      'Includes carrying strap and moisture bag',
      '100% Eco-friendly tree rubber material'
    ],
    specs: {
      'Dimensions': '72" L x 26" W',
      'Thickness': '6mm',
      'Weight': '2.4 kg',
      'Material': 'Natural Rubber + Eco Polyurethane'
    },
    stock: 22,
    isFeatured: false,
    tags: ['Yoga', 'Fitness', 'Sports', 'Mat', 'Wellness'],
    reviews: []
  },
  {
    id: 'prod-8',
    name: 'Precision Barista Electric Pour-Over Kettle',
    brand: 'AromaCraft',
    category: 'Home & Living',
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.9,
    reviewCount: 140,
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Variable temperature control gooseneck kettle designed for pour-over coffee purists and tea connoisseurs. Fast 1200W boil speed.',
    features: [
      'Precision Gooseneck Spout for controlled pour rate',
      'Exact temperature setting to the degree (104°F - 212°F)',
      '60-Minute hold temperature mode',
      'Built-in brew stopwatch timer',
      'Food-grade 304 Stainless Steel interior'
    ],
    specs: {
      'Capacity': '0.9 Liters',
      'Wattage': '1200W',
      'Display': 'LCD Temperature Screen',
      'Material': 'Stainless Steel'
    },
    stock: 31,
    isFeatured: true,
    tags: ['Coffee', 'Kitchen', 'Home', 'Kettle', 'Barista'],
    reviews: [
      {
        id: 'rev-8',
        userName: 'Tom Harrison',
        rating: 5,
        date: '2026-06-18',
        comment: 'Best pour-over kettle I have ever owned. Holds exact temp for my Chemex brew!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-slp-1',
    name: "Panthron UltraComfort Men's Orthopedic Sleeper",
    brand: 'Panthron Footwear',
    category: 'Sleeper',
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.9,
    reviewCount: 184,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80'
    ],
    description: "Premium ergonomic men's sleepers engineered with arch support memory foam, anti-skid rubber sole, and breathable fleece lining for all-day indoor & outdoor relaxed wear.",
    features: [
      'High-density Memory Foam Cushioning',
      'Non-slip textured rubber outsole for wet/dry surfaces',
      'Breathable, odor-resistant fabric lining',
      'Men Subcategory: Durable Ergonomic Fit'
    ],
    specs: {
      'Gender': 'Men',
      'Subcategory': 'Men',
      'Material': 'Memory Foam + Synthetic Leather',
      'Sole': 'Anti-skid TPR Rubber'
    },
    stock: 65,
    isFeatured: true,
    isTrending: true,
    tags: ['Sleeper', 'Men', 'Footwear', 'Slippers', 'Orthopedic'],
    reviews: [
      {
        id: 'rev-slp-1',
        userName: 'Rahul Sharma',
        rating: 5,
        date: '2026-07-20',
        comment: 'Extremely comfortable! The memory foam feels like walking on clouds.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-slp-2',
    name: "Panthron Velvet Cloud Women's Plush Sleeper",
    brand: 'Panthron Footwear',
    category: 'Sleeper',
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviewCount: 210,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: "Ultra-soft faux fur plush slippers designed for women. Features thick cushioned soles, stylish cross-strap upper, and gentle warm lining.",
    features: [
      'Luxurious plush velvet faux fur',
      'Thick impact-absorbing EVA midsole',
      'Women Subcategory: Fashionable Cozy Slip-on',
      'Machine washable gently'
    ],
    specs: {
      'Gender': 'Women',
      'Subcategory': 'Women',
      'Material': 'Faux Fur Velvet',
      'Sole': 'Lightweight EVA'
    },
    stock: 80,
    isFeatured: true,
    isTrending: true,
    tags: ['Sleeper', 'Women', 'Slippers', 'Plush', 'Cozy'],
    reviews: [
      {
        id: 'rev-slp-2',
        userName: 'Priya Verma',
        rating: 5,
        date: '2026-07-22',
        comment: 'So soft and pretty! Loved the color and quality.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-slp-3',
    name: "Panthron Soft Bunny Kids Cushion Sleeper",
    brand: 'Panthron Junior',
    category: 'Sleeper',
    price: 22.50,
    originalPrice: 29.99,
    rating: 4.9,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
    ],
    description: "Fun and safe cartoon slippers for children. Ultra lightweight, flexible, anti-trip safety grip, and gentle plush inner layer for kids' active home play.",
    features: [
      'Non-slip grip outsole for safe indoor play',
      'Kid Subcategory: Adorable Bunny Character Design',
      'Ultra light and flexible construction',
      'Easy slip-on heel band'
    ],
    specs: {
      'Target Group': 'Kids / Children',
      'Subcategory': 'Kid',
      'Material': 'Soft Fleece & Cotton',
      'Sole': 'Flexible Safety Rubber'
    },
    stock: 50,
    isFeatured: true,
    isTrending: true,
    tags: ['Sleeper', 'Kid', 'Children', 'Cartoons', 'Soft'],
    reviews: []
  },
  {
    id: 'prod-slp-4',
    name: "Panthron AirCushion Trendy Slide (New Style Sleeper)",
    brand: 'Panthron Studio',
    category: 'Sleeper',
    price: 39.99,
    originalPrice: 59.99,
    rating: 5.0,
    reviewCount: 312,
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: "The latest futuristic pillow-slide sleeper! Designed with 4.5cm extra thick air-cushioned sole, quick-drying waterproof EVA, and ergonomic modern street style.",
    features: [
      '4.5cm Pillow Cushion Thick Sole',
      'New Style Subcategory: Modern Urban Slide Aesthetic',
      '100% Waterproof & Quick-Dry EVA',
      'Shock absorbing recovery heel'
    ],
    specs: {
      'Style': 'New Style / Pillow Slide',
      'Subcategory': 'New Style',
      'Material': 'High-Elasticity Cloud EVA',
      'Waterproof': 'Yes'
    },
    stock: 120,
    isFeatured: true,
    isTrending: true,
    tags: ['Sleeper', 'New Style', 'Slides', 'Trending', 'Cloud'],
    reviews: []
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 30,
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 142
  },
  {
    id: 'coup-2',
    code: 'SUMMER20',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 100,
    maxDiscount: 50,
    expiryDate: '2026-09-01',
    isActive: true,
    usageCount: 89
  },
  {
    id: 'coup-3',
    code: 'FLASH50',
    discountType: 'fixed',
    discountValue: 50,
    minPurchase: 200,
    expiryDate: '2026-08-15',
    isActive: true,
    usageCount: 25
  },
  {
    id: 'coup-4',
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 15,
    minPurchase: 0,
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 210
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SZ-98241',
    userId: 'usr-customer-1',
    userName: 'Jane Doe',
    userEmail: 'jane.doe@example.com',
    items: [
      {
        productId: 'prod-1',
        productName: 'AuraSound Pro Noise-Cancelling Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
        price: 249.99,
        quantity: 1,
        color: 'Matte Black'
      }
    ],
    subtotal: 249.99,
    discount: 25.00,
    shippingFee: 0,
    tax: 18.00,
    total: 242.99,
    shippingAddress: {
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 234-5678',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'United States',
      isDefault: true
    },
    paymentDetails: {
      method: 'credit_card',
      cardNumberLast4: '4242',
      cardBrand: 'Visa'
    },
    status: 'shipped',
    couponCode: 'WELCOME10',
    createdAt: '2026-07-24T14:30:00Z',
    estimatedDelivery: '2026-07-29',
    trackingNumber: 'TRK-98241-US',
    timeline: [
      { status: 'pending', timestamp: '2026-07-24 14:30', description: 'Order received and confirmed' },
      { status: 'processing', timestamp: '2026-07-25 09:15', description: 'Package packed at fulfillment center' },
      { status: 'shipped', timestamp: '2026-07-26 11:00', description: 'Handed over to carrier (FedEx Express)' }
    ]
  },
  {
    id: 'SZ-98105',
    userId: 'usr-customer-1',
    userName: 'Jane Doe',
    userEmail: 'jane.doe@example.com',
    items: [
      {
        productId: 'prod-4',
        productName: 'AromaCraft Ceramic Diffuser & Essential Oils',
        productImage: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=500&q=80',
        price: 54.99,
        quantity: 2
      }
    ],
    subtotal: 109.98,
    discount: 0,
    shippingFee: 0,
    tax: 8.80,
    total: 118.78,
    shippingAddress: {
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 234-5678',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'United States',
      isDefault: true
    },
    paymentDetails: {
      method: 'paypal',
      cardNumberLast4: '',
      cardBrand: 'PayPal'
    },
    status: 'delivered',
    createdAt: '2026-07-10T10:15:00Z',
    estimatedDelivery: '2026-07-14',
    trackingNumber: 'TRK-98105-US',
    timeline: [
      { status: 'pending', timestamp: '2026-07-10 10:15', description: 'Order confirmed' },
      { status: 'processing', timestamp: '2026-07-11 08:30', description: 'Order packed' },
      { status: 'shipped', timestamp: '2026-07-12 14:00', description: 'In transit with UPS' },
      { status: 'out_for_delivery', timestamp: '2026-07-14 07:30', description: 'Out for delivery' },
      { status: 'delivered', timestamp: '2026-07-14 13:45', description: 'Delivered at front door' }
    ]
  }
];

export const INITIAL_USER: User = {
  id: 'usr-customer-1',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  phone: '+1 (555) 234-5678',
  createdAt: '2026-01-15',
  addresses: [
    {
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 234-5678',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'United States',
      isDefault: true
    }
  ]
};

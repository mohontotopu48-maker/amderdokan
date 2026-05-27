import { db } from '../src/lib/db';

async function main() {
  console.log('🌱 Starting database seeding...');

  // ============================================================
  // Step 1: Clear all existing data (respecting relations)
  // ============================================================
  console.log('🧹 Clearing existing data...');

  await db.review.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.coupon.deleteMany();
  await db.billPayment.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();
  await db.user.deleteMany();
  await db.category.deleteMany();
  await db.contactMessage.deleteMany();

  console.log('✅ Existing data cleared.');

  // ============================================================
  // Step 2: Create Categories
  // ============================================================
  console.log('📂 Creating categories...');

  const categoriesData = [
    { nameBn: 'শাকসবজি', nameEn: 'Vegetables', slug: 'vegetables', icon: 'Leaf', order: 1, description: 'তাজা ও জৈব শাকসবজি' },
    { nameBn: 'ফলমূল', nameEn: 'Fruits', slug: 'fruits', icon: 'Apple', order: 2, description: 'মৌসুমী ফলমূল ও আমদানিকৃত ফল' },
    { nameBn: 'মাছ ও মাংস', nameEn: 'Fish & Meat', slug: 'fish-meat', icon: 'Fish', order: 3, description: 'তাজা মাছ, গরুর মাংস, খাসির মাংস ও মুরগি' },
    { nameBn: 'চাল ও ডাল', nameEn: 'Rice & Lentils', slug: 'rice-lentils', icon: 'Wheat', order: 4, description: 'বিভিন্ন ধরনের চাল ও ডাল' },
    { nameBn: 'মসলা ও তেল', nameEn: 'Spices & Oil', slug: 'spices-oil', icon: 'Flame', order: 5, description: 'রান্নার মসলা, তেল ও গুঁড়া মসলা' },
    { nameBn: 'দুগ্ধ ও ডিম', nameEn: 'Dairy & Eggs', slug: 'dairy-eggs', icon: 'Milk', order: 6, description: 'দুধ, দই, ঘি, মাখন ও ডিম' },
    { nameBn: 'বেকারি', nameEn: 'Bakery', slug: 'bakery', icon: 'Croissant', order: 7, description: 'পাউরুটি, কেক, বিস্কুট ও পেস্ট্রি' },
    { nameBn: 'পানীয়', nameEn: 'Beverages', slug: 'beverages', icon: 'Coffee', order: 8, description: 'চা, কফি, জুস ও পানীয়' },
    { nameBn: 'স্ন্যাকস', nameEn: 'Snacks', slug: 'snacks', icon: 'Cookie', order: 9, description: 'চানাচুর, চিপস, বিস্কুট ও মিষ্টি' },
    { nameBn: 'পরিষ্কার', nameEn: 'Household', slug: 'household', icon: 'SprayCan', order: 10, description: 'ঘরদোর পরিষ্কারের সামগ্রী' },
    { nameBn: 'ব্যক্তিগত যত্ন', nameEn: 'Personal Care', slug: 'personal-care', icon: 'Sparkles', order: 11, description: 'সাবান, শ্যাম্পু, টুথপেস্ট ও প্রসাধনী' },
    { nameBn: 'ফ্রোজেন', nameEn: 'Frozen', slug: 'frozen', icon: 'Snowflake', order: 12, description: 'ফ্রোজেন খাবার ও সামুদ্রিক মাছ' },
  ];

  const categories: Record<string, string> = {};

  for (const cat of categoriesData) {
    const created = await db.category.create({ data: cat });
    categories[cat.slug] = created.id;
    console.log(`  ✓ ${cat.nameBn} (${cat.nameEn})`);
  }

  console.log(`✅ ${categoriesData.length} categories created.`);

  // ============================================================
  // Step 2.5: Create Brands
  // ============================================================
  console.log('🏷️ Creating brands...');

  const brandsData = [
    { nameBn: 'প্রাণ', nameEn: 'PRAN', slug: 'pran', logo: '🥭', description: 'প্রাণ-আরএফএল গ্রুপ, বাংলাদেশের শীর্ষ খাদ্য ও পানীয় ব্র্যান্ড' },
    { nameBn: 'এসিআই', nameEn: 'ACI', slug: 'aci', logo: '🧪', description: 'এসিআই লিমিটেড, বাংলাদেশের অন্যতম শীর্ষ কনজ্যুমার গুডস কোম্পানি' },
    { nameBn: 'স্কয়ার', nameEn: 'Square', slug: 'square', logo: '🔷', description: 'স্কয়ার টয়লেট্রিজ, হাইজিন ও হেলথকেয়ার পণ্য' },
    { nameBn: 'ইউনিলিভার', nameEn: 'Unilever BD', slug: 'unilever-bd', logo: '🧴', description: 'ইউনিলিভার বাংলাদেশ, পার্সোনাল কেয়ার ও হাউজহোল্ড পণ্য' },
    { nameBn: 'রাধুনী', nameEn: 'Radhuni', slug: 'radhuni', logo: '🌶️', description: 'রাধুনী মসলা, বাংলাদেশের জনপ্রিয় মসলা ব্র্যান্ড' },
    { nameBn: 'ফ্রেশ', nameEn: 'Fresh', slug: 'fresh', logo: '🫒', description: 'ফ্রেশ মসলা ও তেল, বিশুদ্ধ মসলার আস্থার ব্র্যান্ড' },
    { nameBn: 'আড়ং', nameEn: 'Aarong', slug: 'aarong', logo: '🐄', description: 'আড়ং ডেইরি, বাংলাদেশের শীর্ষ দুগ্ধ ব্র্যান্ড' },
    { nameBn: 'ডেটল', nameEn: 'Dettol', slug: 'dettol', logo: '🛡️', description: 'ডেটল, বিশ্বস্ত হাইজিন ও অ্যান্টিসেপটিক ব্র্যান্ড' },
    { nameBn: 'মার্কস', nameEn: 'Marks', slug: 'marks', logo: '🥛', description: 'মার্কস ডেইরি, বাংলাদেশের জনপ্রিয় দুগ্ধ ব্র্যান্ড' },
    { nameBn: 'ইগলু', nameEn: 'Igloo', slug: 'igloo', logo: '🍦', description: 'ইগলু আইসক্রিম ও ডেইরি, বাংলাদেশের শীর্ষ আইসক্রিম ব্র্যান্ড' },
    { nameBn: 'অ্যারিস্টোক্রেট', nameEn: 'Aristocrat', slug: 'aristocrat', logo: '👑', description: 'অ্যারিস্টোক্রেট, প্রিমিয়াম টয়লেট্রিজ ও বডি স্প্রে' },
    { nameBn: 'তিব্বত', nameEn: 'Tibet', slug: 'tibet', logo: '🏔️', description: 'তিব্বত, বাংলাদেশের ঐতিহ্যবাহী পার্সোনাল কেয়ার ব্র্যান্ড' },
    { nameBn: 'মেরিল', nameEn: 'Meril', slug: 'meril', logo: '💐', description: 'মেরিল, বিউটি ও কেয়ার পণ্য' },
    { nameBn: 'লাক্স', nameEn: 'Lux', slug: 'lux', logo: '✨', description: 'লাক্স, বিশ্বের অন্যতম জনপ্রিয় পার্সোনাল কেয়ার ব্র্যান্ড' },
    { nameBn: 'স্যাভলন', nameEn: 'Savlon', slug: 'savlon', logo: '🧬', description: 'স্যাভলন, অ্যান্টিসেপটিক ও হাইজিন পণ্য' },
    { nameBn: 'আরএফএল', nameEn: 'RFL', slug: 'rfl', logo: '🏠', description: 'আরএফএল, হাউজহোল্ড ও প্লাস্টিক পণ্য' },
    { nameBn: 'ওয়ালটন', nameEn: 'Walton', slug: 'walton', logo: '📱', description: 'ওয়ালটন, বাংলাদেশের শীর্ষ ইলেকট্রনিক্স ব্র্যান্ড' },
    { nameBn: 'সিঙ্গার', nameEn: 'Singer', slug: 'singer', logo: '🎛️', description: 'সিঙ্গার, ইলেকট্রনিক্স ও হোম অ্যাপ্লায়েন্সেস' },
    { nameBn: 'বেবি', nameEn: 'BABY', slug: 'baby', logo: '👶', description: 'বেবি, শিশু যত্নের বিশ্বস্ত ব্র্যান্ড' },
    { nameBn: 'প্রাণ-আরএফএল', nameEn: 'PRAN-RFL', slug: 'pran-rfl', logo: '🏭', description: 'প্রাণ-আরএফএল গ্রুপ, ডাইভার্সিফাইড কনগ্লোমারেট' },
    { nameBn: 'তীর', nameEn: 'Teer', slug: 'teer', logo: '🏹', description: 'তীর, বাংলাদেশের জনপ্রিয় আটা, সুজি ও ডাল ব্র্যান্ড' },
    { nameBn: 'সিটি গ্রুপ', nameEn: 'City Group', slug: 'city-group', logo: '🏙️', description: 'সিটি গ্রুপ, বাংলাদেশের শীর্ষ আটা ও খাদ্যপণ্য ব্র্যান্ড' },
    { nameBn: 'শান', nameEn: 'Shan', slug: 'shan', logo: '🏔️', description: 'শান ফুডস, পাকিস্তানের বিখ্যাত মসলা ব্র্যান্ড' },
    { nameBn: 'লাল কেল্লা', nameEn: 'Lal Qilla', slug: 'lal-qilla', logo: '🏰', description: 'লাল কেল্লা, প্রিমিয়াম বাসমতি চালের ব্র্যান্ড' },
    { nameBn: 'মিল্কভিটা', nameEn: 'Milk Vita', slug: 'milk-vita', logo: '🐄', description: 'মিল্কভিটা, বাংলাদেশের জাতীয় দুগ্ধ বোর্ডের ব্র্যান্ড' },
  ];

  const brands: Record<string, string> = {};

  for (const brand of brandsData) {
    const created = await db.brand.create({ data: brand });
    brands[brand.slug] = created.id;
    console.log(`  ✓ ${brand.nameBn} (${brand.nameEn})`);
  }

  console.log(`✅ ${brandsData.length} brands created.`);

  // ============================================================
  // Step 3: Create Products (200+)
  // ============================================================
  console.log('🛒 Creating products...');

  const productsData = [
    // ═══════════════════════════════════════════════════════════
    // শাকসবজি (Vegetables) - 25 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'আলু', nameEn: 'Potato', slug: 'potato',
      descriptionBn: 'তাজা দেশি আলু, রান্নার জন্য উৎকৃষ্ট', descriptionEn: 'Fresh local potatoes, excellent for cooking',
      price: 25, originalPrice: 30, unit: 'কেজি', stock: 500, images: '["🥔"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 17, rating: 4.5, reviewCount: 128,
    },
    {
      nameBn: 'পেঁয়াজ', nameEn: 'Onion', slug: 'onion',
      descriptionBn: 'দেশি পেঁয়াজ, রান্নায় অপরিহার্য', descriptionEn: 'Local onions, essential for cooking',
      price: 45, originalPrice: 55, unit: 'কেজি', stock: 400, images: '["🧅"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 18, rating: 4.3, reviewCount: 95,
    },
    {
      nameBn: 'রসুন', nameEn: 'Garlic', slug: 'garlic',
      descriptionBn: 'তাজা রসুন, স্বাদ ও গন্ধে ভরপুর', descriptionEn: 'Fresh garlic, full of flavor and aroma',
      price: 120, originalPrice: 140, unit: 'কেজি', stock: 250, images: '["🧄"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.4, reviewCount: 67,
    },
    {
      nameBn: 'আদা', nameEn: 'Ginger', slug: 'ginger',
      descriptionBn: 'তাজা আদা, চায়ে ও রান্নায় ব্যবহার্য', descriptionEn: 'Fresh ginger, great for tea and cooking',
      price: 100, originalPrice: 120, unit: 'কেজি', stock: 200, images: '["🫚"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.2, reviewCount: 54,
    },
    {
      nameBn: 'টমেটো', nameEn: 'Tomato', slug: 'tomato',
      descriptionBn: 'লাল টমেটো, সালাদ ও রান্নার জন্য', descriptionEn: 'Red tomatoes, great for salad and cooking',
      price: 35, originalPrice: 40, unit: 'কেজি', stock: 350, images: '["🍅"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 72,
    },
    {
      nameBn: 'বেগুন', nameEn: 'Eggplant', slug: 'eggplant',
      descriptionBn: 'তাজা বেগুন, ভর্তা ও তরকারির জন্য', descriptionEn: 'Fresh eggplant, great for bharta and curry',
      price: 40, originalPrice: 50, unit: 'কেজি', stock: 300, images: '["🍆"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.1, reviewCount: 43,
    },
    {
      nameBn: 'ফুলকপি', nameEn: 'Cauliflower', slug: 'cauliflower',
      descriptionBn: 'তাজা ফুলকপি, শীতকালীন সবজি', descriptionEn: 'Fresh cauliflower, winter vegetable',
      price: 30, originalPrice: 35, unit: 'পিস', stock: 180, images: '["🥦"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.0, reviewCount: 38,
    },
    {
      nameBn: 'লাউ', nameEn: 'Bottle Gourd', slug: 'bottle-gourd',
      descriptionBn: 'সবুজ লাউ, তরকারি ও ঘন্টের জন্য', descriptionEn: 'Green bottle gourd, great for curry',
      price: 25, originalPrice: 30, unit: 'পিস', stock: 150, images: '["🫛"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 3.9, reviewCount: 28,
    },
    {
      nameBn: 'পেঁপে', nameEn: 'Papaya (Raw)', slug: 'papaya-vegetable',
      descriptionBn: 'কাঁচা পেঁপে, তরকারির জন্য', descriptionEn: 'Raw papaya, great for curry',
      price: 20, originalPrice: 25, unit: 'পিস', stock: 200, images: '["🫒"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 3.8, reviewCount: 22,
    },
    {
      nameBn: 'ধনেপাতা', nameEn: 'Coriander Leaves', slug: 'coriander-leaves',
      descriptionBn: 'তাজা ধনেপাতা, সালাদ ও গার্নিশিং এর জন্য', descriptionEn: 'Fresh coriander leaves, great for salad and garnishing',
      price: 15, originalPrice: 20, unit: 'আঁটি', stock: 300, images: '["🌿"]',
      categoryId: categories['vegetables'], isOrganic: true, isFeatured: false, isTrending: false,
      discount: 25, rating: 4.4, reviewCount: 56,
    },
    {
      nameBn: 'কাঁচা কলা', nameEn: 'Green Banana', slug: 'green-banana',
      descriptionBn: 'কাঁচা কলা, ভর্তা ও তরকারির জন্য', descriptionEn: 'Green banana, great for bharta and curry',
      price: 40, originalPrice: 45, unit: 'কেজি', stock: 250, images: '["🍌"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.0, reviewCount: 33,
    },
    {
      nameBn: 'লাল শাক', nameEn: 'Red Spinach', slug: 'red-spinach',
      descriptionBn: 'তাজা লাল শাক, ভাজির জন্য', descriptionEn: 'Fresh red spinach, great for stir-fry',
      price: 20, originalPrice: 25, unit: 'আঁটি', stock: 200, images: '["🥬"]',
      categoryId: categories['vegetables'], isOrganic: true, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.3, reviewCount: 41,
    },
    {
      nameBn: 'পুঁইশাক', nameEn: 'Pui Shak', slug: 'pui-shak',
      descriptionBn: 'তাজা পুঁইশাক, ভর্তার জন্য উৎকৃষ্ট', descriptionEn: 'Fresh pui shak, excellent for bharta',
      price: 18, originalPrice: 22, unit: 'আঁটি', stock: 180, images: '["🥬"]',
      categoryId: categories['vegetables'], isOrganic: true, isFeatured: false, isTrending: false,
      discount: 18, rating: 4.2, reviewCount: 35,
    },
    {
      nameBn: 'পালংশাক', nameEn: 'Spinach', slug: 'spinach',
      descriptionBn: 'তাজা পালংশাক, পুষ্টিকর শাক', descriptionEn: 'Fresh spinach, nutritious greens',
      price: 20, originalPrice: 25, unit: 'আঁটি', stock: 220, images: '["🥬"]',
      categoryId: categories['vegetables'], isOrganic: true, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.3, reviewCount: 38,
    },
    {
      nameBn: 'শিম', nameEn: 'Flat Beans', slug: 'flat-beans',
      descriptionBn: 'তাজা শিম, তরকারি ও ভুনার জন্য', descriptionEn: 'Fresh flat beans, great for curry and bhuna',
      price: 50, originalPrice: 60, unit: 'কেজি', stock: 150, images: '["🫛"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.1, reviewCount: 29,
    },
    {
      nameBn: 'বরবটি', nameEn: 'Long Beans', slug: 'long-beans',
      descriptionBn: 'তাজা বরবটি, ভাজির জন্য', descriptionEn: 'Fresh long beans, great for stir-fry',
      price: 45, originalPrice: 55, unit: 'কেজি', stock: 160, images: '["🫘"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 18, rating: 4.0, reviewCount: 24,
    },
    {
      nameBn: 'কুমড়া', nameEn: 'Pumpkin', slug: 'pumpkin',
      descriptionBn: 'তাজা কুমড়া, তরকারি ও হালুয়ার জন্য', descriptionEn: 'Fresh pumpkin, great for curry and halwa',
      price: 25, originalPrice: 30, unit: 'কেজি', stock: 200, images: '["🎃"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.0, reviewCount: 31,
    },
    {
      nameBn: 'ঝিঙ্গা', nameEn: 'Ridge Gourd', slug: 'ridge-gourd',
      descriptionBn: 'তাজা ঝিঙ্গা, তরকারির জন্য', descriptionEn: 'Fresh ridge gourd, great for curry',
      price: 35, originalPrice: 40, unit: 'কেজি', stock: 130, images: '["🥒"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 3.9, reviewCount: 19,
    },
    {
      nameBn: 'কাঁচকলা ফুল', nameEn: 'Banana Flower', slug: 'banana-flower',
      descriptionBn: 'তাজা কাঁচকলা ফুল, ভর্তার জন্য', descriptionEn: 'Fresh banana flower, great for bharta',
      price: 30, originalPrice: 35, unit: 'পিস', stock: 80, images: '["🌸"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.2, reviewCount: 26,
    },
    {
      nameBn: 'মিষ্টি কুমড়া', nameEn: 'Sweet Gourd', slug: 'sweet-gourd',
      descriptionBn: 'মিষ্টি কুমড়া, হালুয়া ও পায়েসের জন্য', descriptionEn: 'Sweet gourd, great for halwa and payesh',
      price: 30, originalPrice: 35, unit: 'কেজি', stock: 140, images: '["🟧"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 22,
    },
    {
      nameBn: 'শসা', nameEn: 'Cucumber', slug: 'cucumber',
      descriptionBn: 'তাজা শসা, সালাদ ও রায়তার জন্য', descriptionEn: 'Fresh cucumber, great for salad and raita',
      price: 30, originalPrice: 35, unit: 'কেজি', stock: 250, images: '["🥒"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.2, reviewCount: 34,
    },
    {
      nameBn: 'ক্যাপসিকাম', nameEn: 'Capsicum', slug: 'capsicum',
      descriptionBn: 'সবুজ ক্যাপসিকাম, সালাদ ও ফ্রাইয়ের জন্য', descriptionEn: 'Green capsicum, great for salad and fry',
      price: 80, originalPrice: 90, unit: 'কেজি', stock: 100, images: '["🫑"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.0, reviewCount: 18,
    },
    {
      nameBn: 'দেশি কাঁচামরিচ', nameEn: 'Green Chili', slug: 'green-chili',
      descriptionBn: 'ঝাল কাঁচামরিচ, রান্নায় অপরিহার্য', descriptionEn: 'Hot green chili, essential for cooking',
      price: 60, originalPrice: 70, unit: 'কেজি', stock: 300, images: '["🌶️"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 45,
    },
    {
      nameBn: 'লাল গাজর', nameEn: 'Red Carrot', slug: 'red-carrot',
      descriptionBn: 'লাল গাজর, হালুয়া ও সালাদের জন্য', descriptionEn: 'Red carrot, great for halwa and salad',
      price: 50, originalPrice: 60, unit: 'কেজি', stock: 200, images: '["🥕"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 17, rating: 4.4, reviewCount: 56,
    },
    {
      nameBn: 'মূলা', nameEn: 'Radish', slug: 'radish',
      descriptionBn: 'তাজা মূলা, সালাদ ও ভর্তার জন্য', descriptionEn: 'Fresh radish, great for salad and bharta',
      price: 20, originalPrice: 25, unit: 'কেজি', stock: 180, images: '["⚪"]',
      categoryId: categories['vegetables'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 3.8, reviewCount: 16,
    },

    // ═══════════════════════════════════════════════════════════
    // ফলমূল (Fruits) - 15 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'আম', nameEn: 'Mango', slug: 'mango',
      descriptionBn: 'হিমসাগর আম, মৌসুমী ফল', descriptionEn: 'Himsagar mango, seasonal fruit',
      price: 150, originalPrice: 200, unit: 'কেজি', stock: 100, images: '["🥭"]',
      categoryId: categories['fruits'], isOrganic: true, isFeatured: true, isTrending: true,
      discount: 25, rating: 4.8, reviewCount: 210,
    },
    {
      nameBn: 'কাঁঠাল', nameEn: 'Jackfruit', slug: 'jackfruit',
      descriptionBn: 'বাংলাদেশের জাতীয় ফল, তাজা কাঁঠাল', descriptionEn: "Bangladesh's national fruit, fresh jackfruit",
      price: 80, originalPrice: 100, unit: 'পিস', stock: 60, images: '["🍈"]',
      categoryId: categories['fruits'], isOrganic: true, isFeatured: true, isTrending: true,
      discount: 20, rating: 4.6, reviewCount: 87,
    },
    {
      nameBn: 'পেয়ারা', nameEn: 'Guava', slug: 'guava',
      descriptionBn: 'তাজা পেয়ারা, ভিটামিন সি সমৃদ্ধ', descriptionEn: 'Fresh guava, rich in Vitamin C',
      price: 60, originalPrice: 70, unit: 'কেজি', stock: 200, images: '["🍐"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 64,
    },
    {
      nameBn: 'লেবু', nameEn: 'Lemon', slug: 'lemon',
      descriptionBn: 'দেশি লেবু, চা ও রান্নায় ব্যবহার্য', descriptionEn: 'Local lemon, great for tea and cooking',
      price: 80, originalPrice: 90, unit: 'কেজি', stock: 300, images: '["🍋"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.2, reviewCount: 51,
    },
    {
      nameBn: 'পাকা পেঁপে', nameEn: 'Ripe Papaya', slug: 'ripe-papaya',
      descriptionBn: 'পাকা পেঁপে, মিষ্টি ও পুষ্টিকর', descriptionEn: 'Ripe papaya, sweet and nutritious',
      price: 35, originalPrice: 40, unit: 'পিস', stock: 120, images: '["🧡"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.0, reviewCount: 29,
    },
    {
      nameBn: 'সফেদ আপেল', nameEn: 'Apple', slug: 'apple',
      descriptionBn: 'আমদানিকৃত সফেদ আপেল', descriptionEn: 'Imported white apple',
      price: 250, originalPrice: 300, unit: 'কেজি', stock: 150, images: '["🍎"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.5, reviewCount: 93,
    },
    {
      nameBn: 'কলা', nameEn: 'Banana', slug: 'banana',
      descriptionBn: 'পাকা সবরি কলা, পুষ্টিকর ফল', descriptionEn: 'Ripe sabri banana, nutritious fruit',
      price: 50, originalPrice: 60, unit: 'ডজন', stock: 250, images: '["🍌"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.4, reviewCount: 88,
    },
    {
      nameBn: 'তরমুজ', nameEn: 'Watermelon', slug: 'watermelon',
      descriptionBn: 'তাজা তরমুজ, গরমে শরণাপন্ন', descriptionEn: 'Fresh watermelon, perfect for summer',
      price: 40, originalPrice: 50, unit: 'কেজি', stock: 150, images: '["🍉"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 20, rating: 4.5, reviewCount: 76,
    },
    {
      nameBn: 'মাল্টা', nameEn: 'Malta (Orange)', slug: 'malta',
      descriptionBn: 'তাজা মাল্টা, ভিটামিন সি এর উৎস', descriptionEn: 'Fresh malta, rich source of Vitamin C',
      price: 150, originalPrice: 180, unit: 'কেজি', stock: 100, images: '["🍊"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.3, reviewCount: 48,
    },
    {
      nameBn: 'আনারস', nameEn: 'Pineapple', slug: 'pineapple',
      descriptionBn: 'তাজা আনারস, মিষ্টি ও রসালো', descriptionEn: 'Fresh pineapple, sweet and juicy',
      price: 60, originalPrice: 70, unit: 'পিস', stock: 80, images: '["🍍"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.4, reviewCount: 55,
    },
    {
      nameBn: 'আমড়া', nameEn: 'Hog Plum', slug: 'hog-plum',
      descriptionBn: 'টক আমড়া, চাটনি ও কাঁচা খাওয়ার জন্য', descriptionEn: 'Sour hog plum, great for chutney or eating raw',
      price: 40, originalPrice: 50, unit: 'কেজি', stock: 100, images: '["🟢"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.0, reviewCount: 22,
    },
    {
      nameBn: 'জাম', nameEn: 'Black Berry', slug: 'black-berry',
      descriptionBn: 'তাজা জাম, মৌসুমী ফল', descriptionEn: 'Fresh black berry, seasonal fruit',
      price: 100, originalPrice: 120, unit: 'কেজি', stock: 60, images: '["🫐"]',
      categoryId: categories['fruits'], isOrganic: true, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.2, reviewCount: 33,
    },
    {
      nameBn: 'লিচু', nameEn: 'Lychee', slug: 'lychee',
      descriptionBn: 'দিনাজপুরের লিচু, মিষ্টি ও সুগন্ধি', descriptionEn: "Dinajpur's lychee, sweet and aromatic",
      price: 200, originalPrice: 250, unit: 'কেজি', stock: 80, images: '["🔴"]',
      categoryId: categories['fruits'], isOrganic: true, isFeatured: true, isTrending: true,
      discount: 20, rating: 4.7, reviewCount: 134,
    },
    {
      nameBn: 'সফেদ আঁতলা', nameEn: 'Amla (Indian Gooseberry)', slug: 'amla',
      descriptionBn: 'তাজা আঁতলা, ভিটামিন সি সমৃদ্ধ', descriptionEn: 'Fresh amla, rich in Vitamin C',
      price: 70, originalPrice: 80, unit: 'কেজি', stock: 90, images: '["🟢"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.1, reviewCount: 20,
    },
    {
      nameBn: 'বেল', nameEn: 'Wood Apple', slug: 'wood-apple',
      descriptionBn: 'পাকা বেল, শরবত ও মিষ্টির জন্য', descriptionEn: 'Ripe wood apple, great for sherbet and sweets',
      price: 45, originalPrice: 55, unit: 'পিস', stock: 70, images: '["🟤"]',
      categoryId: categories['fruits'], isOrganic: true, isFeatured: false, isTrending: false,
      discount: 18, rating: 4.0, reviewCount: 15,
    },

    // ═══════════════════════════════════════════════════════════
    // মাছ ও মাংস (Fish & Meat) - 14 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'তাজা রুই মাছ', nameEn: 'Fresh Rui Fish', slug: 'rui-fish',
      descriptionBn: 'তাজা রুই মাছ, ঝাল ও ভুনার জন্য উৎকৃষ্ট', descriptionEn: 'Fresh Rui fish, excellent for curry',
      price: 350, originalPrice: 400, unit: 'কেজি', stock: 80, images: '["🐟"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 12, rating: 4.6, reviewCount: 145,
    },
    {
      nameBn: 'ইলিশ', nameEn: 'Hilsa Fish', slug: 'hilsa-fish',
      descriptionBn: 'পদ্মা ইলিশ, বাংলাদেশের রাজকীয় মাছ', descriptionEn: 'Padma Hilsa, the royal fish of Bangladesh',
      price: 900, originalPrice: 1100, unit: 'কেজি', stock: 30, images: '["🐠"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 18, rating: 4.9, reviewCount: 267,
    },
    {
      nameBn: 'চিংড়ি', nameEn: 'Shrimp', slug: 'shrimp',
      descriptionBn: 'তাজা চিংড়ি মাছ, মালাই কারির জন্য', descriptionEn: 'Fresh shrimp, great for malai curry',
      price: 550, originalPrice: 650, unit: 'কেজি', stock: 50, images: '["🦐"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 15, rating: 4.7, reviewCount: 112,
    },
    {
      nameBn: 'তাজা খাসির মাংস', nameEn: 'Fresh Mutton', slug: 'mutton',
      descriptionBn: 'তাজা খাসির মাংস, কোরমার জন্য উৎকৃষ্ট', descriptionEn: 'Fresh mutton, excellent for korma',
      price: 750, originalPrice: 850, unit: 'কেজি', stock: 40, images: '["🥩"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 12, rating: 4.5, reviewCount: 89,
    },
    {
      nameBn: 'মুরগির মাংস', nameEn: 'Chicken', slug: 'chicken',
      descriptionBn: 'দেশি মুরগির মাংস, তাজা ও স্বাস্দেশীয়', descriptionEn: 'Local chicken meat, fresh and tasty',
      price: 280, originalPrice: 320, unit: 'কেজি', stock: 100, images: '["🍗"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 12, rating: 4.4, reviewCount: 156,
    },
    {
      nameBn: 'গরুর মাংস', nameEn: 'Beef', slug: 'beef',
      descriptionBn: 'তাজা গরুর মাংস, কোরমার জন্য', descriptionEn: 'Fresh beef, great for korma',
      price: 650, originalPrice: 700, unit: 'কেজি', stock: 50, images: '["🥩"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 7, rating: 4.4, reviewCount: 76,
    },
    {
      nameBn: 'কাতলা মাছ', nameEn: 'Katla Fish', slug: 'katla-fish',
      descriptionBn: 'তাজা কাতলা মাছ, ঝালের জন্য উৎকৃষ্ট', descriptionEn: 'Fresh Katla fish, excellent for curry',
      price: 380, originalPrice: 420, unit: 'কেজি', stock: 60, images: '["🐟"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.5, reviewCount: 78,
    },
    {
      nameBn: 'ভেটকি মাছ', nameEn: 'Bhetki Fish', slug: 'bhetki-fish',
      descriptionBn: 'তাজা ভেটকি মাছ, ভাজার জন্য উৎকৃষ্ট', descriptionEn: 'Fresh Bhetki fish, excellent for frying',
      price: 500, originalPrice: 580, unit: 'কেজি', stock: 40, images: '["🐠"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.6, reviewCount: 65,
    },
    {
      nameBn: 'তাজা পুটি মাছ', nameEn: 'Puti Fish', slug: 'puti-fish',
      descriptionBn: 'তাজা পুটি মাছ, ঝাল তরকারির জন্য', descriptionEn: 'Fresh Puti fish, great for spicy curry',
      price: 250, originalPrice: 280, unit: 'কেজি', stock: 70, images: '["🐟"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.2, reviewCount: 42,
    },
    {
      nameBn: 'ডোবা মাছ', nameEn: 'Sing Fish', slug: 'sing-fish',
      descriptionBn: 'তাজা ডোবা মাছ, ঝালের জন্য', descriptionEn: 'Fresh Sing fish, great for spicy curry',
      price: 300, originalPrice: 350, unit: 'কেজি', stock: 45, images: '["🐟"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 38,
    },
    {
      nameBn: 'ব্রয়লার মুরগি', nameEn: 'Broiler Chicken', slug: 'broiler-chicken',
      descriptionBn: 'তাজা ব্রয়লার মুরগি, দৈনন্দিন রান্নায়', descriptionEn: 'Fresh broiler chicken, for daily cooking',
      price: 220, originalPrice: 250, unit: 'কেজি', stock: 120, images: '["🍗"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.2, reviewCount: 98,
    },
    {
      nameBn: 'মুরগির ডিম (ফার্ম)', nameEn: 'Farm Eggs', slug: 'farm-eggs',
      descriptionBn: 'ফার্মের মুরগির ডিম, ১২টি প্রতি ডজন', descriptionEn: 'Farm chicken eggs, 12 per dozen',
      price: 120, originalPrice: 135, unit: '১২ পিস', stock: 300, images: '["🥚"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.1, reviewCount: 85,
    },
    {
      nameBn: 'কড়াই মাছ', nameEn: 'Carp Fish', slug: 'carp-fish',
      descriptionBn: 'তাজা কড়াই মাছ, ঝাল ও ভুনার জন্য', descriptionEn: 'Fresh carp fish, great for curry and bhuna',
      price: 320, originalPrice: 360, unit: 'কেজি', stock: 55, images: '["🐟"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 55,
    },
    {
      nameBn: 'হাঁসের ডিম', nameEn: 'Duck Eggs', slug: 'duck-eggs',
      descriptionBn: 'তাজা হাঁসের ডিম, ৬টি প্রতি প্যাকেট', descriptionEn: 'Fresh duck eggs, 6 per pack',
      price: 90, originalPrice: 100, unit: '৬ পিস', stock: 100, images: '["🥚"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.0, reviewCount: 28,
    },

    // ═══════════════════════════════════════════════════════════
    // চাল ও ডাল (Rice & Lentils) - 14 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'বাসমতি চাল', nameEn: 'Basmati Rice', slug: 'basmati-rice',
      descriptionBn: 'প্রিমিয়াম বাসমতি চাল, বিরিয়ানির জন্য', descriptionEn: 'Premium basmati rice, perfect for biryani',
      price: 180, originalPrice: 200, unit: 'কেজি', stock: 300, images: '["🍚"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 10, rating: 4.7, reviewCount: 198,
    },
    {
      nameBn: 'মিনিকেট চাল', nameEn: 'Miniket Rice', slug: 'miniket-rice',
      descriptionBn: 'দেশি মিনিকেট চাল, প্রতিদিনের ভাতের জন্য', descriptionEn: 'Local miniket rice, perfect for daily meals',
      price: 85, originalPrice: 95, unit: 'কেজি', stock: 500, images: '["🌾"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 234,
    },
    {
      nameBn: 'লাল ডাল', nameEn: 'Red Lentils', slug: 'red-lentils',
      descriptionBn: 'মসুর ডাল, ডাল ভুনার জন্য উৎকৃষ্ট', descriptionEn: 'Masoor dal, excellent for dal fry',
      price: 120, originalPrice: 140, unit: 'কেজি', stock: 400, images: '["🫘"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.5, reviewCount: 167,
    },
    {
      nameBn: 'মটর ডাল', nameEn: 'Motor Lentils', slug: 'motor-lentils',
      descriptionBn: 'মটর ডাল, ঘুগনি ও তরকারির জন্য', descriptionEn: 'Motor dal, great for ghugni and curry',
      price: 130, originalPrice: 150, unit: 'কেজি', stock: 350, images: '["🟡"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.3, reviewCount: 98,
    },
    {
      nameBn: 'ছোলা ডাল', nameEn: 'Chickpeas', slug: 'chickpeas',
      descriptionBn: 'ছোলা ডাল, হরেক রান্নায় ব্যবহার্য', descriptionEn: 'Chickpeas, versatile for many dishes',
      price: 110, originalPrice: 125, unit: 'কেজি', stock: 280, images: '["🟤"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.2, reviewCount: 76,
    },
    {
      nameBn: 'নাজিরশাইল চাল', nameEn: 'Nazirshail Rice', slug: 'nazirshail-rice',
      descriptionBn: 'নাজিরশাইল চাল, খিচুড়ির জন্য উৎকৃষ্ট', descriptionEn: 'Nazirshail rice, excellent for khichuri',
      price: 75, originalPrice: 82, unit: 'কেজি', stock: 350, images: '["🌾"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.3, reviewCount: 102,
    },
    {
      nameBn: 'চিনিগুঁড়া চাল', nameEn: 'Chinigura Rice', slug: 'chinigura-rice',
      descriptionBn: 'সুগন্ধি চিনিগুঁড়া চাল, পোলাও ও পায়েসের জন্য', descriptionEn: 'Aromatic chinigura rice, for polao and payesh',
      price: 120, originalPrice: 135, unit: 'কেজি', stock: 250, images: '["🍚"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 11, rating: 4.6, reviewCount: 145,
    },
    {
      nameBn: 'কালিজিরা চাল', nameEn: 'Kalijira Rice', slug: 'kalijira-rice',
      descriptionBn: 'দেশি কালিজিরা চাল, সুগন্ধি ও ছোট দানা', descriptionEn: 'Local kalijira rice, aromatic small grain',
      price: 100, originalPrice: 110, unit: 'কেজি', stock: 200, images: '["🌾"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.4, reviewCount: 88,
    },
    {
      nameBn: 'অড়হর ডাল', nameEn: 'Arhar Dal', slug: 'arhar-dal',
      descriptionBn: 'অড়হর ডাল, সাম্বার ও ডাল ফ্রাইয়ের জন্য', descriptionEn: 'Arhar dal, great for sambar and dal fry',
      price: 140, originalPrice: 160, unit: 'কেজি', stock: 200, images: '["🟡"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 64,
    },
    {
      nameBn: 'মুগ ডাল', nameEn: 'Mung Dal', slug: 'mung-dal',
      descriptionBn: 'মুগ ডাল, খিচুড়ি ও ডালের জন্য', descriptionEn: 'Mung dal, great for khichuri and dal',
      price: 150, originalPrice: 170, unit: 'কেজি', stock: 250, images: '["🟢"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.4, reviewCount: 72,
    },
    {
      nameBn: 'চিড়া', nameEn: 'Flattened Rice', slug: 'flattened-rice',
      descriptionBn: 'চিড়া, চিরার পান্তা ও নাস্তায়', descriptionEn: 'Flattened rice, for panta and snacks',
      price: 60, originalPrice: 70, unit: 'কেজি', stock: 300, images: '["🥣"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 55,
    },
    {
      nameBn: 'মুড়ি', nameEn: 'Puffed Rice', slug: 'puffed-rice',
      descriptionBn: 'কুড়মুড়ে মুড়ি, ঝালমুড়ি ও নাস্তায়', descriptionEn: 'Crispy puffed rice, for jhalmuri and snacks',
      price: 50, originalPrice: 55, unit: 'কেজি', stock: 400, images: '["🥣"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.2, reviewCount: 89,
    },
    {
      nameBn: 'খই', nameEn: 'Parched Rice', slug: 'parched-rice',
      descriptionBn: 'মুড়ি খই, মুড়ির সাথে মেশানো যায়', descriptionEn: 'Parched rice, great mixed with puffed rice',
      price: 80, originalPrice: 90, unit: 'কেজি', stock: 250, images: '["🌾"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.0, reviewCount: 34,
    },
    {
      nameBn: 'লাটি ডাল', nameEn: 'Lathyrus Dal', slug: 'lathyrus-dal',
      descriptionBn: 'লাটি ডাল, বিশেষ রান্নার জন্য', descriptionEn: 'Lathyrus dal, for special cooking',
      price: 90, originalPrice: 100, unit: 'কেজি', stock: 180, images: '["🟠"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 3.9, reviewCount: 28,
    },

    // ═══════════════════════════════════════════════════════════
    // মসলা ও তেল (Spices & Oil) - 16 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'সরিষার তেল', nameEn: 'Mustard Oil', slug: 'mustard-oil',
      descriptionBn: 'খাঁটি সরিষার তেল, রান্নায় অপরিহার্য', descriptionEn: 'Pure mustard oil, essential for cooking',
      price: 220, originalPrice: 250, unit: 'লিটার', stock: 200, images: '["🫗"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 12, rating: 4.6, reviewCount: 189,
    },
    {
      nameBn: 'হলুদ গুঁড়া', nameEn: 'Turmeric Powder', slug: 'turmeric-powder',
      descriptionBn: 'ভালো মানের হলুদ গুঁড়া, রান্নায় রঙের জন্য', descriptionEn: 'Quality turmeric powder, for color in cooking',
      price: 80, originalPrice: 90, unit: '২৫০ গ্রাম', stock: 350, images: '["🟨"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 143,
    },
    {
      nameBn: 'জিরা গুঁড়া', nameEn: 'Cumin Powder', slug: 'cumin-powder',
      descriptionBn: 'তাজা ভাজা জিরা গুঁড়া', descriptionEn: 'Fresh roasted cumin powder',
      price: 120, originalPrice: 140, unit: '২৫০ গ্রাম', stock: 300, images: '["🟫"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.5, reviewCount: 112,
    },
    {
      nameBn: 'মরিচ গুঁড়া', nameEn: 'Chili Powder', slug: 'chili-powder',
      descriptionBn: 'ঝাল মরিচ গুঁড়া, রান্নায় ঝালের জন্য', descriptionEn: 'Hot chili powder, for spiciness in cooking',
      price: 90, originalPrice: 100, unit: '২৫০ গ্রাম', stock: 320, images: '["🌶️"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.3, reviewCount: 98,
    },
    {
      nameBn: 'সয়াবিন তেল', nameEn: 'Soybean Oil', slug: 'soybean-oil',
      descriptionBn: 'রিফাইন্ড সয়াবিন তেল, ভাজাভুজির জন্য', descriptionEn: 'Refined soybean oil, great for frying',
      price: 185, originalPrice: 200, unit: 'লিটার', stock: 250, images: '["🫙"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 8, rating: 4.2, reviewCount: 87,
    },
    {
      nameBn: 'পাঁচফোড়ন', nameEn: 'Panch Phoron', slug: 'panch-phoron',
      descriptionBn: 'বাংলাদেশি পাঁচফোড়ন মসলা মিশ্রণ', descriptionEn: 'Bangladeshi five-spice blend',
      price: 60, originalPrice: 70, unit: '১০০ গ্রাম', stock: 200, images: '["🌰"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 45,
    },
    {
      nameBn: 'লবণ', nameEn: 'Salt', slug: 'salt',
      descriptionBn: 'আয়োডিনযুক্ত লবণ', descriptionEn: 'Iodized salt',
      price: 30, originalPrice: 35, unit: 'কেজি', stock: 500, images: '["🧂"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 89,
    },
    {
      nameBn: 'দারুচিনি', nameEn: 'Cinnamon', slug: 'cinnamon',
      descriptionBn: 'সিলন দারুচিনি, বিরিয়ানি ও পোলাওয়ে', descriptionEn: 'Ceylon cinnamon, for biryani and polao',
      price: 350, originalPrice: 400, unit: '১০০ গ্রাম', stock: 150, images: '["🪵"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.5, reviewCount: 67,
    },
    {
      nameBn: 'এলাচ', nameEn: 'Cardamom', slug: 'cardamom',
      descriptionBn: 'সবুজ এলাচ, চা ও মিষ্টিতে', descriptionEn: 'Green cardamom, for tea and sweets',
      price: 800, originalPrice: 900, unit: '১০০ গ্রাম', stock: 80, images: '["🫛"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.6, reviewCount: 54,
    },
    {
      nameBn: 'লবঙ্গ', nameEn: 'Cloves', slug: 'cloves',
      descriptionBn: 'লবঙ্গ, বিরিয়ানি ও কোরমায়', descriptionEn: 'Cloves, for biryani and korma',
      price: 600, originalPrice: 700, unit: '১০০ গ্রাম', stock: 100, images: '["🟤"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.4, reviewCount: 48,
    },
    {
      nameBn: 'তেজপাতা', nameEn: 'Bay Leaves', slug: 'bay-leaves',
      descriptionBn: 'শুকনো তেজপাতা, রান্নায় সুগন্ধের জন্য', descriptionEn: 'Dried bay leaves, for aroma in cooking',
      price: 80, originalPrice: 90, unit: '৫০ গ্রাম', stock: 250, images: '["🍃"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.2, reviewCount: 42,
    },
    {
      nameBn: 'ধনে বীজ', nameEn: 'Coriander Seeds', slug: 'coriander-seeds',
      descriptionBn: 'শুকনো ধনে বীজ, মসলা বাটার জন্য', descriptionEn: 'Dried coriander seeds, for spice paste',
      price: 100, originalPrice: 115, unit: '২৫০ গ্রাম', stock: 280, images: '["🟤"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.3, reviewCount: 58,
    },
    {
      nameBn: 'শুকনো মরিচ', nameEn: 'Dry Chili', slug: 'dry-chili',
      descriptionBn: 'শুকনো লাল মরিচ, তরকারিতে ঝালের জন্য', descriptionEn: 'Dry red chili, for spiciness in curry',
      price: 150, originalPrice: 170, unit: 'কেজি', stock: 200, images: '["🌶️"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 72,
    },
    {
      nameBn: 'গরম মসলা গুঁড়া', nameEn: 'Garam Masala', slug: 'garam-masala',
      descriptionBn: 'গরম মসলা মিশ্রণ, রান্নায় সুগন্ধের জন্য', descriptionEn: 'Garam masala blend, for aroma in cooking',
      price: 150, originalPrice: 170, unit: '১০০ গ্রাম', stock: 220, images: '["🟫"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.5, reviewCount: 84,
    },
    {
      nameBn: 'নারকেল তেল', nameEn: 'Coconut Oil', slug: 'coconut-oil',
      descriptionBn: 'খাঁটি নারকেল তেল, রান্না ও চুলায়', descriptionEn: 'Pure coconut oil, for cooking and hair',
      price: 280, originalPrice: 320, unit: 'লিটার', stock: 120, images: '["🥥"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.4, reviewCount: 65,
    },
    {
      nameBn: 'জায়ফল', nameEn: 'Nutmeg', slug: 'nutmeg',
      descriptionBn: 'জায়ফল, মিষ্টি ও গোস্তের রান্নায়', descriptionEn: 'Nutmeg, for sweets and meat dishes',
      price: 500, originalPrice: 580, unit: '১০০ গ্রাম', stock: 80, images: '["🟤"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 36,
    },

    // ═══════════════════════════════════════════════════════════
    // দুগ্ধ ও ডিম (Dairy & Eggs) - 10 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'দেশি মুরগির ডিম', nameEn: 'Local Chicken Eggs', slug: 'local-eggs',
      descriptionBn: 'তাজা দেশি মুরগির ডিম, ১২টি প্রতি ডজন', descriptionEn: 'Fresh local chicken eggs, 12 per dozen',
      price: 150, originalPrice: 170, unit: '১২ পিস', stock: 200, images: '["🥚"]',
      categoryId: categories['dairy-eggs'], isOrganic: true, isFeatured: true, isTrending: true,
      discount: 12, rating: 4.6, reviewCount: 178,
    },
    {
      nameBn: 'মিষ্টি দই', nameEn: 'Sweet Yogurt', slug: 'sweet-yogurt',
      descriptionBn: 'বগুড়ার মিষ্টি দই, ঐতিহ্যবাহী', descriptionEn: "Bogura's famous sweet yogurt, traditional",
      price: 60, originalPrice: 70, unit: 'পিস', stock: 100, images: '["🥣"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 14, rating: 4.8, reviewCount: 234,
    },
    {
      nameBn: 'ফুল ক্রিম দুধ', nameEn: 'Full Cream Milk', slug: 'full-cream-milk',
      descriptionBn: 'তাজা ফুল ক্রিম দুধ', descriptionEn: 'Fresh full cream milk',
      price: 80, originalPrice: 85, unit: 'লিটার', stock: 300, images: '["🥛"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 6, rating: 4.5, reviewCount: 156,
    },
    {
      nameBn: 'ঘি', nameEn: 'Ghee', slug: 'ghee',
      descriptionBn: 'খাঁটি গাওয়া ঘি, পোলাও ও বিরিয়ানিতে', descriptionEn: 'Pure cow ghee, for polao and biryani',
      price: 650, originalPrice: 750, unit: '৫০০ মিলি', stock: 80, images: '["🧈"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 13, rating: 4.7, reviewCount: 145,
    },
    {
      nameBn: 'মাখন', nameEn: 'Butter', slug: 'butter',
      descriptionBn: 'তাজা মাখন, পাউরুটির সাথে', descriptionEn: 'Fresh butter, great with bread',
      price: 180, originalPrice: 200, unit: '২০০ গ্রাম', stock: 100, images: '["🧈"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.3, reviewCount: 67,
    },
    {
      nameBn: 'পনির', nameEn: 'Paneer', slug: 'paneer',
      descriptionBn: 'তাজা পনির, সালাদ ও তরকারিতে', descriptionEn: 'Fresh paneer, for salad and curry',
      price: 200, originalPrice: 230, unit: '২৫০ গ্রাম', stock: 80, images: '["🧀"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.5, reviewCount: 56,
    },
    {
      nameBn: 'দুধের ছানা', nameEn: 'Cottage Cheese (Chana)', slug: 'cottage-cheese',
      descriptionBn: 'তাজা দুধের ছানা, মিষ্টি ও তরকারিতে', descriptionEn: 'Fresh cottage cheese, for sweets and curry',
      price: 120, originalPrice: 140, unit: '২৫০ গ্রাম', stock: 100, images: '["🧀"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 48,
    },
    {
      nameBn: 'টক দই', nameEn: 'Sour Yogurt', slug: 'sour-yogurt',
      descriptionBn: 'টক দই, রান্না ও মাখন তৈরিতে', descriptionEn: 'Sour yogurt, for cooking and making butter',
      price: 50, originalPrice: 55, unit: '৫০০ গ্রাম', stock: 150, images: '["🥣"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.2, reviewCount: 42,
    },
    {
      nameBn: 'ক্রিম', nameEn: 'Cream', slug: 'cream',
      descriptionBn: 'ফ্রেশ ক্রিম, মিষ্টি ও ডেজার্টে', descriptionEn: 'Fresh cream, for sweets and desserts',
      price: 100, originalPrice: 110, unit: '২৫০ মিলি', stock: 80, images: '["🥛"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.1, reviewCount: 32,
    },
    {
      nameBn: 'ক্ষীর', nameEn: 'Condensed Milk', slug: 'condensed-milk',
      descriptionBn: 'মিষ্টি ক্ষীর, পায়েস ও মিষ্টিতে', descriptionEn: 'Sweet condensed milk, for payesh and sweets',
      price: 120, originalPrice: 135, unit: '৪০০ গ্রাম', stock: 120, images: '["🥫"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 75,
    },

    // ═══════════════════════════════════════════════════════════
    // বেকারি (Bakery) - 10 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'পাউরুটি', nameEn: 'Bread', slug: 'bread',
      descriptionBn: 'তাজা পাউরুটি, প্রতিদিনের নাস্তায়', descriptionEn: 'Fresh bread, for daily breakfast',
      price: 50, originalPrice: 55, unit: 'পিস', stock: 200, images: '["🍞"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.2, reviewCount: 89,
    },
    {
      nameBn: 'কেক', nameEn: 'Cake', slug: 'cake',
      descriptionBn: 'বাটার কেক, বিশেষ অনুষ্ঠানের জন্য', descriptionEn: 'Butter cake, for special occasions',
      price: 350, originalPrice: 400, unit: 'পিস', stock: 50, images: '["🎂"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.5, reviewCount: 78,
    },
    {
      nameBn: 'পাঁপড়', nameEn: 'Papad', slug: 'papad',
      descriptionBn: 'কড়কড়ে পাঁপড়, খাবারের সাথে', descriptionEn: 'Crispy papad, great with meals',
      price: 40, originalPrice: 45, unit: 'প্যাকেট', stock: 250, images: '["🫓"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.0, reviewCount: 56,
    },
    {
      nameBn: 'রুটি', nameEn: 'Roti', slug: 'roti',
      descriptionBn: 'তাজা আটার রুটি, ৬ পিস', descriptionEn: 'Fresh wheat roti, 6 pieces',
      price: 30, originalPrice: 35, unit: 'প্যাকেট', stock: 180, images: '["🫓"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 43,
    },
    {
      nameBn: 'সমুচা', nameEn: 'Samosa', slug: 'samosa',
      descriptionBn: 'তাজা আলু সমুচা, ইফতারের জন্য', descriptionEn: 'Fresh potato samosa, for iftar',
      price: 15, originalPrice: 20, unit: 'পিস', stock: 300, images: '["🔺"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 25, rating: 4.3, reviewCount: 67,
    },
    {
      nameBn: 'পাউরুটি (ফ্রুট)', nameEn: 'Fruit Bread', slug: 'fruit-bread',
      descriptionBn: 'ফ্রুট পাউরুটি, কিশমিশ ও ফ্রুটসহ', descriptionEn: 'Fruit bread, with raisins and fruits',
      price: 70, originalPrice: 80, unit: 'পিস', stock: 100, images: '["🍞"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 45,
    },
    {
      nameBn: 'বান', nameEn: 'Bun', slug: 'bun',
      descriptionBn: 'সফেদ বান, বার্গার ও স্ন্যাকসে', descriptionEn: 'White bun, for burgers and snacks',
      price: 20, originalPrice: 25, unit: 'পিস', stock: 200, images: '["🍔"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.0, reviewCount: 34,
    },
    {
      nameBn: 'নিমকি', nameEn: 'Nimki', slug: 'nimki',
      descriptionBn: 'কুড়মুড়ে নিমকি, চায়ের সাথে', descriptionEn: 'Crispy nimki, great with tea',
      price: 40, originalPrice: 45, unit: 'প্যাকেট', stock: 200, images: '["🥐"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.1, reviewCount: 38,
    },
    {
      nameBn: 'পেস্ট্রি', nameEn: 'Pastry', slug: 'pastry',
      descriptionBn: 'ক্রিম পেস্ট্রি, সফেদ ক্রিমসহ', descriptionEn: 'Cream pastry, with white cream',
      price: 30, originalPrice: 35, unit: 'পিস', stock: 150, images: '["🧁"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.2, reviewCount: 52,
    },
    {
      nameBn: 'টোস্ট বিস্কুট', nameEn: 'Toast Biscuit', slug: 'toast-biscuit',
      descriptionBn: 'কুড়মুড়ে টোস্ট, চায়ে ডুবিয়ে খাওয়ার জন্য', descriptionEn: 'Crispy toast, for dipping in tea',
      price: 45, originalPrice: 50, unit: 'প্যাকেট', stock: 250, images: '["🍪"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.2, reviewCount: 62,
    },

    // ═══════════════════════════════════════════════════════════
    // পানীয় (Beverages) - 12 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'চা পাতা', nameEn: 'Tea Leaves', slug: 'tea-leaves',
      descriptionBn: 'সিলেটের চা পাতা, সুগন্ধি ও স্বাদে ভরপুর', descriptionEn: "Sylhet's tea leaves, aromatic and flavorful",
      price: 120, originalPrice: 140, unit: '২৫০ গ্রাম', stock: 350, images: '["🍵"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 14, rating: 4.6, reviewCount: 201,
    },
    {
      nameBn: 'চিনি', nameEn: 'Sugar', slug: 'sugar',
      descriptionBn: 'খাদ্যশর্করা, চা ও মিষ্টিতে', descriptionEn: 'Sugar, for tea and sweets',
      price: 120, originalPrice: 130, unit: 'কেজি', stock: 400, images: '["🍬"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 8, rating: 4.3, reviewCount: 134,
    },
    {
      nameBn: 'কফি', nameEn: 'Coffee', slug: 'coffee',
      descriptionBn: 'ইনস্ট্যান্ট কফি, দ্রুত তৈরির জন্য', descriptionEn: 'Instant coffee, quick to prepare',
      price: 250, originalPrice: 280, unit: '২০০ গ্রাম', stock: 150, images: '["☕"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 87,
    },
    {
      nameBn: 'আমের জুস', nameEn: 'Mango Juice', slug: 'mango-juice',
      descriptionBn: 'তাজা আমের জুস, ১ লিটার', descriptionEn: 'Fresh mango juice, 1 liter',
      price: 85, originalPrice: 100, unit: 'লিটার', stock: 180, images: '["🧃"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 15, rating: 4.2, reviewCount: 65,
    },
    {
      nameBn: 'লাচ্ছি', nameEn: 'Lassi', slug: 'lassi',
      descriptionBn: 'মিষ্টি লাচ্ছি, দই থেকে তৈরি', descriptionEn: 'Sweet lassi, made from yogurt',
      price: 40, originalPrice: 50, unit: 'গ্লাস', stock: 100, images: '["🥛"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.5, reviewCount: 78,
    },
    {
      nameBn: 'পানি (খনিজ)', nameEn: 'Mineral Water', slug: 'mineral-water',
      descriptionBn: 'বিশুদ্ধ খনিজ পানি, ১ লিটার', descriptionEn: 'Pure mineral water, 1 liter',
      price: 20, originalPrice: 25, unit: 'বোতল', stock: 500, images: '["💧"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.0, reviewCount: 45,
    },
    {
      nameBn: 'কোকাকোলা', nameEn: 'Coca-Cola', slug: 'coca-cola',
      descriptionBn: 'কোকাকোলা, ৫০০ মিলি বোতল', descriptionEn: 'Coca-Cola, 500ml bottle',
      price: 30, originalPrice: 35, unit: 'বোতল', stock: 400, images: '["🥤"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 89,
    },
    {
      nameBn: 'স্প্রাইট', nameEn: 'Sprite', slug: 'sprite',
      descriptionBn: 'স্প্রাইট, ৫০০ মিলি বোতল', descriptionEn: 'Sprite, 500ml bottle',
      price: 30, originalPrice: 35, unit: 'বোতল', stock: 350, images: '["🥤"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.0, reviewCount: 56,
    },
    {
      nameBn: 'দুধের চা', nameEn: 'Milk Tea Pack', slug: 'milk-tea-pack',
      descriptionBn: '৩ ইন ১ দুধের চা প্যাকেট', descriptionEn: '3 in 1 milk tea packet',
      price: 10, originalPrice: 12, unit: 'পিস', stock: 600, images: '["☕"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 17, rating: 4.1, reviewCount: 98,
    },
    {
      nameBn: 'পাকা আমের শরবত', nameEn: 'Mango Squash', slug: 'mango-squash',
      descriptionBn: 'ঘন আমের শরবত, পানি মিশিয়ে খাওয়ার জন্য', descriptionEn: 'Concentrated mango squash, mix with water',
      price: 120, originalPrice: 140, unit: 'বোতল', stock: 150, images: '["🧃"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 62,
    },
    {
      nameBn: 'লেমন স্কোয়াশ', nameEn: 'Lemon Squash', slug: 'lemon-squash',
      descriptionBn: 'ঘন লেবুর শরবত, গরমে শরণাপন্ন', descriptionEn: 'Concentrated lemon squash, perfect for summer',
      price: 100, originalPrice: 115, unit: 'বোতল', stock: 140, images: '["🍋"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.2, reviewCount: 48,
    },
    {
      nameBn: 'মধু', nameEn: 'Honey', slug: 'honey',
      descriptionBn: 'খাঁটি সুন্দরবনের মধু, স্বাস্থ্যকর', descriptionEn: 'Pure Sundarbans honey, healthy',
      price: 500, originalPrice: 600, unit: '৫০০ গ্রাম', stock: 60, images: '["🍯"]',
      categoryId: categories['beverages'], isOrganic: true, isFeatured: true, isTrending: true,
      discount: 17, rating: 4.8, reviewCount: 176,
    },

    // ═══════════════════════════════════════════════════════════
    // স্ন্যাকস (Snacks) - 12 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'বিস্কুট', nameEn: 'Biscuits', slug: 'biscuits',
      descriptionBn: 'কুকিজ বিস্কুট, চায়ের সাথে', descriptionEn: 'Cookies biscuits, great with tea',
      price: 30, originalPrice: 35, unit: 'প্যাকেট', stock: 500, images: '["🍪"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 112,
    },
    {
      nameBn: 'চানাচুর', nameEn: 'Chanachur', slug: 'chanachur',
      descriptionBn: 'ঝাল চানাচুর, চায়ের সাথে অপরিহার্য', descriptionEn: 'Spicy chanachur, essential with tea',
      price: 35, originalPrice: 40, unit: 'প্যাকেট', stock: 400, images: '["🥜"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 89,
    },
    {
      nameBn: 'চিপস', nameEn: 'Chips', slug: 'chips',
      descriptionBn: 'আলুর চিপস, কুড়মুড়ে স্ন্যাকস', descriptionEn: 'Potato chips, crispy snack',
      price: 25, originalPrice: 30, unit: 'প্যাকেট', stock: 350, images: '["🥔"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.0, reviewCount: 67,
    },
    {
      nameBn: 'নুডলস', nameEn: 'Noodles', slug: 'noodles',
      descriptionBn: 'ইনস্ট্যান্ট নুডলস, দ্রুত খাবার', descriptionEn: 'Instant noodles, quick meal',
      price: 20, originalPrice: 25, unit: 'প্যাকেট', stock: 600, images: '["🍜"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 20, rating: 4.2, reviewCount: 198,
    },
    {
      nameBn: 'ঝালমুড়ি', nameEn: 'Jhalmuri', slug: 'jhalmuri',
      descriptionBn: 'ঝাল মুড়ি, চায়ের সাথে', descriptionEn: 'Spicy puffed rice, with tea',
      price: 20, originalPrice: 25, unit: 'প্যাকেট', stock: 300, images: '["🥣"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.2, reviewCount: 56,
    },
    {
      nameBn: 'মুড়ি ভাজা', nameEn: 'Fried Puffed Rice', slug: 'fried-puffed-rice',
      descriptionBn: 'ভাজা মুড়ি, সরিষার তেলে ভাজা', descriptionEn: 'Fried puffed rice, fried in mustard oil',
      price: 40, originalPrice: 45, unit: 'প্যাকেট', stock: 250, images: '["🥣"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.1, reviewCount: 38,
    },
    {
      nameBn: 'পাকোড়া মশলা', nameEn: 'Pakora Mix', slug: 'pakora-mix',
      descriptionBn: 'পাকোড়া তৈরির মশলা মিশ্রণ', descriptionEn: 'Spice mix for making pakora',
      price: 35, originalPrice: 40, unit: 'প্যাকেট', stock: 200, images: '["🟡"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.0, reviewCount: 28,
    },
    {
      nameBn: 'পেঁয়াজু', nameEn: 'Peyaju', slug: 'peyaju',
      descriptionBn: 'তাজা পেঁয়াজু, ইফতারের জন্য', descriptionEn: 'Fresh lentil fritters, for iftar',
      price: 10, originalPrice: 15, unit: 'পিস', stock: 400, images: '["🧅"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 33, rating: 4.2, reviewCount: 45,
    },
    {
      nameBn: 'শুকনো মিষ্টি', nameEn: 'Dry Sweets', slug: 'dry-sweets',
      descriptionBn: 'নিমকি ও শুকনো মিষ্টি মিশ্রণ', descriptionEn: 'Mix of nimki and dry sweets',
      price: 80, originalPrice: 95, unit: 'প্যাকেট', stock: 150, images: '["🍬"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 16, rating: 4.3, reviewCount: 52,
    },
    {
      nameBn: 'ভুজিয়া', nameEn: 'Bhujiya', slug: 'bhujiya',
      descriptionBn: 'ঝাল ভুজিয়া, চানাচুরের মতো', descriptionEn: 'Spicy bhujiya, similar to chanachur',
      price: 40, originalPrice: 45, unit: 'প্যাকেট', stock: 200, images: '["🥜"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.1, reviewCount: 34,
    },
    {
      nameBn: 'চিড়া ভাজা', nameEn: 'Fried Flattened Rice', slug: 'fried-flattened-rice',
      descriptionBn: 'ভাজা চিড়া, নাস্তায়', descriptionEn: 'Fried flattened rice, for snacks',
      price: 50, originalPrice: 55, unit: 'প্যাকেট', stock: 180, images: '["🥣"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.0, reviewCount: 22,
    },
    {
      nameBn: 'মাখন বিস্কুট', nameEn: 'Butter Biscuits', slug: 'butter-biscuits',
      descriptionBn: 'মাখন বিস্কুট, চায়ের সাথে', descriptionEn: 'Butter biscuits, great with tea',
      price: 45, originalPrice: 50, unit: 'প্যাকেট', stock: 280, images: '["🍪"]',
      categoryId: categories['snacks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.3, reviewCount: 65,
    },

    // ═══════════════════════════════════════════════════════════
    // পরিষ্কার (Household) - 10 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'সাবান', nameEn: 'Soap', slug: 'soap',
      descriptionBn: 'হাত ধোয়ার সাবান, জীবাণুমুক্তি', descriptionEn: 'Hand washing soap, germ protection',
      price: 45, originalPrice: 50, unit: 'পিস', stock: 400, images: '["🧼"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.2, reviewCount: 78,
    },
    {
      nameBn: 'ডিটার্জেন্ট', nameEn: 'Detergent', slug: 'detergent',
      descriptionBn: 'কাপড় ধোয়ার ডিটার্জেন্ট পাউডার', descriptionEn: 'Laundry detergent powder',
      price: 85, originalPrice: 100, unit: 'প্যাকেট', stock: 300, images: '["🧴"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 15, rating: 4.3, reviewCount: 92,
    },
    {
      nameBn: 'ফ্লোর ক্লিনার', nameEn: 'Floor Cleaner', slug: 'floor-cleaner',
      descriptionBn: 'মেঝে পরিষ্কারের তরল', descriptionEn: 'Floor cleaning liquid',
      price: 120, originalPrice: 140, unit: 'বোতল', stock: 200, images: '["🧹"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 45,
    },
    {
      nameBn: 'ডিশওয়াশ', nameEn: 'Dishwash', slug: 'dishwash',
      descriptionBn: 'বাসন ধোয়ার তরল সাবান', descriptionEn: 'Dishwashing liquid soap',
      price: 65, originalPrice: 75, unit: 'বোতল', stock: 250, images: '["🫧"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.0, reviewCount: 56,
    },
    {
      nameBn: 'ফেনি', nameEn: 'Phenyl', slug: 'phenyl',
      descriptionBn: 'মেঝে মোছার ফেনি', descriptionEn: 'Floor mop phenyl',
      price: 55, originalPrice: 65, unit: 'বোতল', stock: 180, images: '["🧴"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 15, rating: 4.0, reviewCount: 32,
    },
    {
      nameBn: 'হার্পিক', nameEn: 'Toilet Cleaner', slug: 'toilet-cleaner',
      descriptionBn: 'টয়লেট পরিষ্কারের তরল', descriptionEn: 'Toilet cleaning liquid',
      price: 140, originalPrice: 160, unit: 'বোতল', stock: 150, images: '["🚽"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 48,
    },
    {
      nameBn: 'স্পঞ্জ', nameEn: 'Sponge', slug: 'sponge',
      descriptionBn: 'বাসন মাজার স্পঞ্জ', descriptionEn: 'Dish washing sponge',
      price: 25, originalPrice: 30, unit: 'পিস', stock: 300, images: '["🟡"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 3.9, reviewCount: 22,
    },
    {
      nameBn: 'ঝাড়ু', nameEn: 'Broom', slug: 'broom',
      descriptionBn: 'দেশি ঝাড়ু, মেঝে পরিষ্কারের জন্য', descriptionEn: 'Local broom, for floor cleaning',
      price: 60, originalPrice: 70, unit: 'পিস', stock: 100, images: '["🧹"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.0, reviewCount: 18,
    },
    {
      nameBn: 'মসল কাপড়', nameEn: 'Mop Cloth', slug: 'mop-cloth',
      descriptionBn: 'মেঝে মোছার কাপড়', descriptionEn: 'Floor mop cloth',
      price: 30, originalPrice: 35, unit: 'পিস', stock: 200, images: '["🧽"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 3.8, reviewCount: 14,
    },
    {
      nameBn: 'মশা কয়েল', nameEn: 'Mosquito Coil', slug: 'mosquito-coil',
      descriptionBn: 'মশা তাড়ানোর কয়েল, ১০ পিস', descriptionEn: 'Mosquito repellent coil, 10 pieces',
      price: 35, originalPrice: 40, unit: 'প্যাকেট', stock: 250, images: '["🪵"]',
      categoryId: categories['household'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.1, reviewCount: 56,
    },

    // ═══════════════════════════════════════════════════════════
    // ব্যক্তিগত যত্ন (Personal Care) - 10 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'টুথপেস্ট', nameEn: 'Toothpaste', slug: 'toothpaste',
      descriptionBn: 'দাঁতের পেস্ট, দাঁত ও মাড়ি রক্ষায়', descriptionEn: 'Toothpaste, for teeth and gum protection',
      price: 75, originalPrice: 85, unit: 'টিউব', stock: 300, images: '["🪥"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 87,
    },
    {
      nameBn: 'শ্যাম্পু', nameEn: 'Shampoo', slug: 'shampoo',
      descriptionBn: 'চুল পরিষ্কারের শ্যাম্পু', descriptionEn: 'Hair cleaning shampoo',
      price: 150, originalPrice: 180, unit: 'বোতল', stock: 200, images: '["🧴"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.4, reviewCount: 78,
    },
    {
      nameBn: 'বডি লোশন', nameEn: 'Body Lotion', slug: 'body-lotion',
      descriptionBn: 'ত্বকের যত্নে বডি লোশন', descriptionEn: 'Body lotion for skin care',
      price: 180, originalPrice: 200, unit: 'বোতল', stock: 150, images: '["🧴"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.2, reviewCount: 54,
    },
    {
      nameBn: 'ফেস ওয়াশ', nameEn: 'Face Wash', slug: 'face-wash',
      descriptionBn: 'মুখ পরিষ্কারের ফেস ওয়াশ', descriptionEn: 'Face wash for facial cleansing',
      price: 130, originalPrice: 150, unit: 'টিউব', stock: 180, images: '["✨"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.3, reviewCount: 67,
    },
    {
      nameBn: 'হেয়ার অয়েল', nameEn: 'Hair Oil', slug: 'hair-oil',
      descriptionBn: 'নারকেল হেয়ার অয়েল, চুলের যত্নে', descriptionEn: 'Coconut hair oil, for hair care',
      price: 120, originalPrice: 140, unit: 'বোতল', stock: 200, images: '["💧"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 62,
    },
    {
      nameBn: 'তোয়ালে', nameEn: 'Towel', slug: 'towel',
      descriptionBn: 'সুতির তোয়ালে, গোসলের জন্য', descriptionEn: 'Cotton towel, for bath',
      price: 200, originalPrice: 250, unit: 'পিস', stock: 80, images: '["🧣"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.2, reviewCount: 34,
    },
    {
      nameBn: 'ডিওডোরেন্ট', nameEn: 'Deodorant', slug: 'deodorant',
      descriptionBn: 'বডি স্প্রে ডিওডোরেন্ট', descriptionEn: 'Body spray deodorant',
      price: 180, originalPrice: 200, unit: 'বোতল', stock: 120, images: '["💨"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.1, reviewCount: 42,
    },
    {
      nameBn: 'ফেস ক্রিম', nameEn: 'Face Cream', slug: 'face-cream',
      descriptionBn: 'ত্বকের যত্নে ফেস ক্রিম', descriptionEn: 'Face cream for skin care',
      price: 150, originalPrice: 170, unit: 'টিউব', stock: 160, images: '["🫧"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.2, reviewCount: 48,
    },
    {
      nameBn: 'সেভিং ক্রিম', nameEn: 'Shaving Cream', slug: 'shaving-cream',
      descriptionBn: 'শেভিং ক্রিম, পুরুষদের জন্য', descriptionEn: 'Shaving cream, for men',
      price: 100, originalPrice: 115, unit: 'টিউব', stock: 100, images: '["🪒"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.0, reviewCount: 28,
    },
    {
      nameBn: 'টিস্যু পেপার', nameEn: 'Tissue Paper', slug: 'tissue-paper',
      descriptionBn: 'ফেসিয়াল টিস্যু, ১০০ পিস', descriptionEn: 'Facial tissue, 100 pieces',
      price: 50, originalPrice: 55, unit: 'বক্স', stock: 350, images: '["🧻"]',
      categoryId: categories['personal-care'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.0, reviewCount: 36,
    },

    // ═══════════════════════════════════════════════════════════
    // ফ্রোজেন (Frozen) - 8 products
    // ═══════════════════════════════════════════════════════════
    {
      nameBn: 'ফ্রোজেন সামুদ্রিক মাছ', nameEn: 'Frozen Sea Fish', slug: 'frozen-sea-fish',
      descriptionBn: 'ফ্রোজেন সামুদ্রিক মাছ, যেকোনো সময় রান্নার জন্য', descriptionEn: 'Frozen sea fish, cook anytime',
      price: 300, originalPrice: 350, unit: 'কেজি', stock: 100, images: '["🐟"]',
      categoryId: categories['frozen'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 45,
    },
    {
      nameBn: 'ফ্রোজেন পেঁয়াজ রিংস', nameEn: 'Frozen Onion Rings', slug: 'frozen-onion-rings',
      descriptionBn: 'কুড়মুড়ে ফ্রোজেন পেঁয়াজ রিংস', descriptionEn: 'Crispy frozen onion rings',
      price: 180, originalPrice: 200, unit: 'প্যাকেট', stock: 80, images: '["🧅"]',
      categoryId: categories['frozen'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.0, reviewCount: 32,
    },
    {
      nameBn: 'ফ্রোজেন সবজি মিক্স', nameEn: 'Frozen Veg Mix', slug: 'frozen-veg-mix',
      descriptionBn: 'ফ্রোজেন মিশ্র সবজি, দ্রুত রান্নার জন্য', descriptionEn: 'Frozen mixed vegetables, for quick cooking',
      price: 90, originalPrice: 100, unit: 'প্যাকেট', stock: 120, images: '["🥕"]',
      categoryId: categories['frozen'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 3.9, reviewCount: 28,
    },
    {
      nameBn: 'ফ্রোজেন পরোটা', nameEn: 'Frozen Paratha', slug: 'frozen-paratha',
      descriptionBn: 'ফ্রোজেন লেয়ার্ড পরোটা, ৫ পিস', descriptionEn: 'Frozen layered paratha, 5 pieces',
      price: 80, originalPrice: 90, unit: 'প্যাকেট', stock: 150, images: '["🫓"]',
      categoryId: categories['frozen'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 11, rating: 4.4, reviewCount: 89,
    },
    {
      nameBn: 'ফ্রোজেন চিংড়ি', nameEn: 'Frozen Shrimp', slug: 'frozen-shrimp',
      descriptionBn: 'ফ্রোজেন চিংড়ি, সারাবছর পাওয়া যায়', descriptionEn: 'Frozen shrimp, available year-round',
      price: 450, originalPrice: 520, unit: 'কেজি', stock: 60, images: '["🦐"]',
      categoryId: categories['frozen'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.3, reviewCount: 42,
    },
    {
      nameBn: 'ফ্রোজেন সমুচা', nameEn: 'Frozen Samosa', slug: 'frozen-samosa',
      descriptionBn: 'ফ্রোজেন আলু সমুচা, ভেজে খাওয়ার জন্য', descriptionEn: 'Frozen potato samosa, fry and eat',
      price: 60, originalPrice: 70, unit: '১০ পিস', stock: 100, images: '["🔺"]',
      categoryId: categories['frozen'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.2, reviewCount: 38,
    },
    {
      nameBn: 'ফ্রোজেন মুরগি', nameEn: 'Frozen Chicken', slug: 'frozen-chicken',
      descriptionBn: 'ফ্রোজেন ব্রয়লার মুরগি, পুরো পিস', descriptionEn: 'Frozen broiler chicken, whole piece',
      price: 200, originalPrice: 230, unit: 'কেজি', stock: 80, images: '["🍗"]',
      categoryId: categories['frozen'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.1, reviewCount: 35,
    },
    {
      nameBn: 'ফ্রোজেন নুগেট', nameEn: 'Frozen Nuggets', slug: 'frozen-nuggets',
      descriptionBn: 'চিকেন নুগেট, ভেজে খাওয়ার জন্য', descriptionEn: 'Chicken nuggets, fry and eat',
      price: 250, originalPrice: 280, unit: 'প্যাকেট', stock: 90, images: '["🍗"]',
      categoryId: categories['frozen'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.3, reviewCount: 48,
    },

    // ═══════════════════════════════════════════════════════════
    // ব্র্যান্ড পণ্য (Branded Products) - 65+ products
    // ═══════════════════════════════════════════════════════════

    // --- PRAN (প্রাণ) - Food & Beverage ---
    {
      nameBn: 'প্রাণ আমের জুস', nameEn: 'PRAN Mango Juice', slug: 'pran-mango-juice',
      descriptionBn: 'প্রাণ আমের জুস, ১ লিটার', descriptionEn: 'PRAN Mango Juice, 1 liter',
      price: 65, originalPrice: 75, unit: 'লিটার', stock: 250, images: '["🧃"]',
      categoryId: categories['beverages'], brandId: brands['pran'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 13, rating: 4.4, reviewCount: 156,
    },
    {
      nameBn: 'প্রাণ লেমন জুস', nameEn: 'PRAN Lemon Juice', slug: 'pran-lemon-juice',
      descriptionBn: 'প্রাণ লেমন জুস, তাজা লেবুর স্বাদ', descriptionEn: 'PRAN Lemon Juice, fresh lemon taste',
      price: 55, originalPrice: 65, unit: 'লিটার', stock: 200, images: '["🍋"]',
      categoryId: categories['beverages'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 15, rating: 4.2, reviewCount: 89,
    },
    {
      nameBn: 'প্রাণ চানাচুর', nameEn: 'PRAN Chanachur', slug: 'pran-chanachur',
      descriptionBn: 'প্রাণ চানাচুর, ঝাল ও মুক্তা', descriptionEn: 'PRAN Chanachur, spicy and crunchy',
      price: 40, originalPrice: 45, unit: 'প্যাকেট', stock: 350, images: '["🥜"]',
      categoryId: categories['snacks'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 11, rating: 4.5, reviewCount: 201,
    },
    {
      nameBn: 'প্রাণ বিস্কুট', nameEn: 'PRAN Biscuit', slug: 'pran-biscuit',
      descriptionBn: 'প্রাণ বিস্কুট, চায়ের সাথে', descriptionEn: 'PRAN Biscuit, great with tea',
      price: 25, originalPrice: 30, unit: 'প্যাকেট', stock: 400, images: '["🍪"]',
      categoryId: categories['snacks'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.1, reviewCount: 134,
    },
    {
      nameBn: 'প্রাণ কেচাপ', nameEn: 'PRAN Tomato Ketchup', slug: 'pran-ketchup',
      descriptionBn: 'প্রাণ টমেটো কেচাপ, স্ন্যাকসের সাথে', descriptionEn: 'PRAN Tomato Ketchup, great with snacks',
      price: 85, originalPrice: 95, unit: 'বোতল', stock: 180, images: '["🥫"]',
      categoryId: categories['spices-oil'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.3, reviewCount: 87,
    },
    {
      nameBn: 'প্রাণ সয়াবিন তেল', nameEn: 'PRAN Soybean Oil', slug: 'pran-soybean-oil',
      descriptionBn: 'প্রাণ সয়াবিন তেল, রিফাইন্ড', descriptionEn: 'PRAN Soybean Oil, refined',
      price: 190, originalPrice: 210, unit: 'লিটার', stock: 200, images: '["🫙"]',
      categoryId: categories['spices-oil'], brandId: brands['pran'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 10, rating: 4.3, reviewCount: 112,
    },
    {
      nameBn: 'প্রাণ সরিষার তেল', nameEn: 'PRAN Mustard Oil', slug: 'pran-mustard-oil',
      descriptionBn: 'প্রাণ সরিষার তেল, খাঁটি ও ঘ্রাণযুক্ত', descriptionEn: 'PRAN Mustard Oil, pure and aromatic',
      price: 230, originalPrice: 260, unit: 'লিটার', stock: 150, images: '["🫗"]',
      categoryId: categories['spices-oil'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.4, reviewCount: 98,
    },
    {
      nameBn: 'প্রাণ চায়না বাদাম', nameEn: 'PRAN Peanut', slug: 'pran-peanut',
      descriptionBn: 'প্রাণ চায়না বাদাম, ভাজা ও লবণযুক্ত', descriptionEn: 'PRAN Peanut, roasted and salted',
      price: 60, originalPrice: 70, unit: 'প্যাকেট', stock: 250, images: '["🥜"]',
      categoryId: categories['snacks'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.2, reviewCount: 76,
    },
    {
      nameBn: 'প্রাণ ফ্রুট জুস', nameEn: 'PRAN Fruit Juice', slug: 'pran-fruit-juice',
      descriptionBn: 'প্রাণ ফ্রুট জুস, মিশ্র ফলের স্বাদ', descriptionEn: 'PRAN Fruit Juice, mixed fruit flavor',
      price: 55, originalPrice: 65, unit: 'লিটার', stock: 180, images: '["🧃"]',
      categoryId: categories['beverages'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 15, rating: 4.1, reviewCount: 62,
    },
    {
      nameBn: 'প্রাণ মশলা', nameEn: 'PRAN Spice Mix', slug: 'pran-spice-mix',
      descriptionBn: 'প্রাণ মশলা মিশ্রণ, রান্নার জন্য', descriptionEn: 'PRAN Spice Mix, for cooking',
      price: 45, originalPrice: 55, unit: 'প্যাকেট', stock: 200, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 18, rating: 4.0, reviewCount: 45,
    },

    // --- ACI (এসিআই) - Consumer Goods ---
    {
      nameBn: 'এসিআই আয়োডিন লবণ', nameEn: 'ACI Iodized Salt', slug: 'aci-iodized-salt',
      descriptionBn: 'এসিআই আয়োডিন লবণ, বিশুদ্ধ ও স্বাস্থ্যকর', descriptionEn: 'ACI Iodized Salt, pure and healthy',
      price: 35, originalPrice: 40, unit: 'কেজি', stock: 400, images: '["🧂"]',
      categoryId: categories['spices-oil'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 123,
    },
    {
      nameBn: 'এসিআই মসলা', nameEn: 'ACI Pure Spice', slug: 'aci-pure-spice',
      descriptionBn: 'এসিআই খাঁটি মসলা, গুঁড়া মসলার মিশ্রণ', descriptionEn: 'ACI Pure Spice, powdered spice blend',
      price: 90, originalPrice: 100, unit: 'প্যাকেট', stock: 200, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.2, reviewCount: 78,
    },
    {
      nameBn: 'এসিআই হলুদ গুঁড়া', nameEn: 'ACI Turmeric', slug: 'aci-turmeric',
      descriptionBn: 'এসিআই হলুদ গুঁড়া, বিশুদ্ধ ও উজ্জ্বল রঙের', descriptionEn: 'ACI Turmeric Powder, pure and bright color',
      price: 85, originalPrice: 95, unit: '২৫০ গ্রাম', stock: 250, images: '["🟨"]',
      categoryId: categories['spices-oil'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 92,
    },
    {
      nameBn: 'এসিআই জিরা গুঁড়া', nameEn: 'ACI Cumin Powder', slug: 'aci-cumin-powder',
      descriptionBn: 'এসিআই জিরা গুঁড়া, সুগন্ধি ও তাজা', descriptionEn: 'ACI Cumin Powder, aromatic and fresh',
      price: 125, originalPrice: 140, unit: '২৫০ গ্রাম', stock: 180, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.5, reviewCount: 85,
    },
    {
      nameBn: 'এসিআই মরিচ গুঁড়া', nameEn: 'ACI Chili Powder', slug: 'aci-chili-powder',
      descriptionBn: 'এসিআই মরিচ গুঁড়া, ঝাল ও লাল রঙের', descriptionEn: 'ACI Chili Powder, hot and red colored',
      price: 95, originalPrice: 110, unit: '২৫০ গ্রাম', stock: 220, images: '["🌶️"]',
      categoryId: categories['spices-oil'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 76,
    },
    {
      nameBn: 'এসিআই কাসুন্দি', nameEn: 'ACI Kasundi', slug: 'aci-kasundi',
      descriptionBn: 'এসিআই কাসুন্দি, ঐতিহ্যবাহী সরিষার সস', descriptionEn: 'ACI Kasundi, traditional mustard sauce',
      price: 70, originalPrice: 80, unit: 'বোতল', stock: 160, images: '["🫙"]',
      categoryId: categories['spices-oil'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.4, reviewCount: 68,
    },

    // --- Radhuni (রাধুনী) - Spices ---
    {
      nameBn: 'রাধুনী হলুদ গুঁড়া', nameEn: 'Radhuni Turmeric', slug: 'radhuni-turmeric',
      descriptionBn: 'রাধুনী হলুদ গুঁড়া, বিশুদ্ধ ও ভালো মানের', descriptionEn: 'Radhuni Turmeric, pure and quality',
      price: 75, originalPrice: 85, unit: '২৫০ গ্রাম', stock: 280, images: '["🟨"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.5, reviewCount: 134,
    },
    {
      nameBn: 'রাধুনী মরিচ গুঁড়া', nameEn: 'Radhuni Chili Powder', slug: 'radhuni-chili-powder',
      descriptionBn: 'রাধুনী মরিচ গুঁড়া, ঝাল ও লাল রঙের', descriptionEn: 'Radhuni Chili Powder, hot and red',
      price: 85, originalPrice: 95, unit: '২৫০ গ্রাম', stock: 260, images: '["🌶️"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 112,
    },
    {
      nameBn: 'রাধুনী জিরা গুঁড়া', nameEn: 'Radhuni Cumin', slug: 'radhuni-cumin',
      descriptionBn: 'রাধুনী জিরা গুঁড়া, সুগন্ধি ও তাজা', descriptionEn: 'Radhuni Cumin, aromatic and fresh',
      price: 110, originalPrice: 125, unit: '২৫০ গ্রাম', stock: 200, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.5, reviewCount: 96,
    },
    {
      nameBn: 'রাধুনী গরম মসলা', nameEn: 'Radhuni Garam Masala', slug: 'radhuni-garam-masala',
      descriptionBn: 'রাধুনী গরম মসলা, রান্নায় সুগন্ধের জন্য', descriptionEn: 'Radhuni Garam Masala, for aroma in cooking',
      price: 130, originalPrice: 150, unit: '১০০ গ্রাম', stock: 180, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 13, rating: 4.6, reviewCount: 108,
    },
    {
      nameBn: 'রাধুনী পাঁচফোড়ন', nameEn: 'Radhuni Panch Phoron', slug: 'radhuni-panch-phoron',
      descriptionBn: 'রাধুনী পাঁচফোড়ন, বাংলাদেশি পাঁচ মসলা', descriptionEn: 'Radhuni Panch Phoron, Bengali five spice',
      price: 55, originalPrice: 65, unit: '১০০ গ্রাম', stock: 160, images: '["🌰"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 15, rating: 4.2, reviewCount: 56,
    },
    {
      nameBn: 'রাধুনী কাসুন্দি', nameEn: 'Radhuni Kasundi', slug: 'radhuni-kasundi',
      descriptionBn: 'রাধুনী কাসুন্দি, সরিষার তৈরি সস', descriptionEn: 'Radhuni Kasundi, mustard sauce',
      price: 65, originalPrice: 75, unit: 'বোতল', stock: 150, images: '["🫙"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.3, reviewCount: 62,
    },

    // --- Fresh (ফ্রেশ) - Spices & Oil ---
    {
      nameBn: 'ফ্রেশ সয়াবিন তেল', nameEn: 'Fresh Soybean Oil', slug: 'fresh-soybean-oil',
      descriptionBn: 'ফ্রেশ সয়াবিন তেল, রিফাইন্ড ও বিশুদ্ধ', descriptionEn: 'Fresh Soybean Oil, refined and pure',
      price: 195, originalPrice: 215, unit: 'লিটার', stock: 200, images: '["🫙"]',
      categoryId: categories['spices-oil'], brandId: brands['fresh'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 9, rating: 4.3, reviewCount: 98,
    },
    {
      nameBn: 'ফ্রেশ সরিষার তেল', nameEn: 'Fresh Mustard Oil', slug: 'fresh-mustard-oil',
      descriptionBn: 'ফ্রেশ সরিষার তেল, খাঁটি ও ঘ্রাণযুক্ত', descriptionEn: 'Fresh Mustard Oil, pure and aromatic',
      price: 225, originalPrice: 250, unit: 'লিটার', stock: 150, images: '["🫗"]',
      categoryId: categories['spices-oil'], brandId: brands['fresh'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.4, reviewCount: 86,
    },
    {
      nameBn: 'ফ্রেশ চাল', nameEn: 'Fresh Rice', slug: 'fresh-rice',
      descriptionBn: 'ফ্রেশ চাল, মিনিকেট প্রিমিয়াম', descriptionEn: 'Fresh Rice, premium miniket',
      price: 90, originalPrice: 100, unit: 'কেজি', stock: 300, images: '["🌾"]',
      categoryId: categories['rice-lentils'], brandId: brands['fresh'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.2, reviewCount: 67,
    },
    {
      nameBn: 'ফ্রেশ ডাল', nameEn: 'Fresh Dal', slug: 'fresh-dal',
      descriptionBn: 'ফ্রেশ মসুর ডাল, পরিষ্কার ও বাছাই', descriptionEn: 'Fresh Masoor Dal, cleaned and sorted',
      price: 130, originalPrice: 145, unit: 'কেজি', stock: 250, images: '["🫘"]',
      categoryId: categories['rice-lentils'], brandId: brands['fresh'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.3, reviewCount: 72,
    },
    {
      nameBn: 'ফ্রেশ মসলা', nameEn: 'Fresh Spices', slug: 'fresh-spices',
      descriptionBn: 'ফ্রেশ মসলা মিশ্রণ, রান্নার জন্য', descriptionEn: 'Fresh Spice Mix, for cooking',
      price: 95, originalPrice: 110, unit: 'প্যাকেট', stock: 180, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['fresh'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 54,
    },

    // --- Square / Meril / Aristocrat ---
    {
      nameBn: 'মেরিল শ্যাম্পু', nameEn: 'Meril Shampoo', slug: 'meril-shampoo',
      descriptionBn: 'মেরিল শ্যাম্পু, চুলের পুষ্টি ও উজ্জ্বলতা', descriptionEn: 'Meril Shampoo, hair nourishment and shine',
      price: 160, originalPrice: 180, unit: 'বোতল', stock: 180, images: '["🧴"]',
      categoryId: categories['personal-care'], brandId: brands['meril'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.3, reviewCount: 87,
    },
    {
      nameBn: 'মেরিল ফেস ওয়াশ', nameEn: 'Meril Face Wash', slug: 'meril-face-wash',
      descriptionBn: 'মেরিল ফেস ওয়াশ, মুখ পরিষ্কারের জন্য', descriptionEn: 'Meril Face Wash, for facial cleansing',
      price: 140, originalPrice: 160, unit: 'টিউব', stock: 200, images: '["✨"]',
      categoryId: categories['personal-care'], brandId: brands['meril'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.2, reviewCount: 65,
    },
    {
      nameBn: 'অ্যারিস্টোক্রেট বডি স্প্রে', nameEn: 'Aristocrat Body Spray', slug: 'aristocrat-body-spray',
      descriptionBn: 'অ্যারিস্টোক্রেট বডি স্প্রে, দীর্ঘস্থায়ী সুগন্ধ', descriptionEn: 'Aristocrat Body Spray, long lasting fragrance',
      price: 200, originalPrice: 230, unit: 'বোতল', stock: 150, images: '["💨"]',
      categoryId: categories['personal-care'], brandId: brands['aristocrat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.4, reviewCount: 92,
    },
    {
      nameBn: 'স্কয়ার টয়লেট ক্লিনার', nameEn: 'Square Toilet Cleaner', slug: 'square-toilet-cleaner',
      descriptionBn: 'স্কয়ার টয়লেট ক্লিনার, জীবাণুমুক্তি', descriptionEn: 'Square Toilet Cleaner, germ protection',
      price: 145, originalPrice: 165, unit: 'বোতল', stock: 120, images: '["🚽"]',
      categoryId: categories['household'], brandId: brands['square'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 56,
    },
    {
      nameBn: 'স্কয়ার ডিটার্জেন্ট', nameEn: 'Square Detergent', slug: 'square-detergent',
      descriptionBn: 'স্কয়ার ডিটার্জেন্ট, কাপড় পরিষ্কারের জন্য', descriptionEn: 'Square Detergent, for laundry cleaning',
      price: 95, originalPrice: 110, unit: 'প্যাকেট', stock: 200, images: '["🧴"]',
      categoryId: categories['household'], brandId: brands['square'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.2, reviewCount: 78,
    },

    // --- Unilever BD ---
    {
      nameBn: 'সারফ এক্সেল', nameEn: 'Surf Excel', slug: 'surf-excel',
      descriptionBn: 'সারফ এক্সেল, কঠিন দাগ দূর করে', descriptionEn: 'Surf Excel, removes tough stains',
      price: 90, originalPrice: 105, unit: 'প্যাকেট', stock: 300, images: '["🧴"]',
      categoryId: categories['household'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 14, rating: 4.5, reviewCount: 145,
    },
    {
      nameBn: 'রিন ডিটার্জেন্ট', nameEn: 'Rin Detergent', slug: 'rin-detergent',
      descriptionBn: 'রিন ডিটার্জেন্ট, উজ্জ্বল সাদা কাপড়', descriptionEn: 'Rin Detergent, bright white clothes',
      price: 80, originalPrice: 90, unit: 'প্যাকেট', stock: 250, images: '["🧴"]',
      categoryId: categories['household'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.3, reviewCount: 98,
    },
    {
      nameBn: 'লাক্স সাবান', nameEn: 'Lux Soap', slug: 'lux-soap',
      descriptionBn: 'লাক্স সাবান, ত্বকের যত্নে বিশ্বস্ত', descriptionEn: 'Lux Soap, trusted skin care',
      price: 55, originalPrice: 65, unit: 'পিস', stock: 350, images: '["🧼"]',
      categoryId: categories['personal-care'], brandId: brands['lux'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 15, rating: 4.4, reviewCount: 167,
    },
    {
      nameBn: 'লাক্স শ্যাম্পু', nameEn: 'Lux Shampoo', slug: 'lux-shampoo',
      descriptionBn: 'লাক্স শ্যাম্পু, সিল্কি ও চকচকে চুল', descriptionEn: 'Lux Shampoo, silky and shiny hair',
      price: 175, originalPrice: 200, unit: 'বোতল', stock: 180, images: '["🧴"]',
      categoryId: categories['personal-care'], brandId: brands['lux'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 89,
    },
    {
      nameBn: 'ক্লোজআপ টুথপেস্ট', nameEn: 'Closeup Toothpaste', slug: 'closeup-toothpaste',
      descriptionBn: 'ক্লোজআপ টুথপেস্ট, তাজা শ্বাস ও উজ্জ্বল হাসি', descriptionEn: 'Closeup Toothpaste, fresh breath and bright smile',
      price: 85, originalPrice: 95, unit: 'টিউব', stock: 280, images: '["🪥"]',
      categoryId: categories['personal-care'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 112,
    },
    {
      nameBn: 'পিপসডেন্ট', nameEn: 'Pepsodent Toothpaste', slug: 'pepsodent-toothpaste',
      descriptionBn: 'পিপসডেন্ট টুথপেস্ট, দাঁত ও মাড়ি রক্ষায়', descriptionEn: 'Pepsodent Toothpaste, teeth and gum protection',
      price: 80, originalPrice: 90, unit: 'টিউব', stock: 250, images: '["🪥"]',
      categoryId: categories['personal-care'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.3, reviewCount: 89,
    },
    {
      nameBn: 'ডাভ সাবান', nameEn: 'Dove Soap', slug: 'dove-soap',
      descriptionBn: 'ডাভ সাবান, নরম ও মসৃণ ত্বক', descriptionEn: 'Dove Soap, soft and smooth skin',
      price: 65, originalPrice: 75, unit: 'পিস', stock: 220, images: '["🧼"]',
      categoryId: categories['personal-care'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.5, reviewCount: 98,
    },
    {
      nameBn: 'ডাভ শ্যাম্পু', nameEn: 'Dove Shampoo', slug: 'dove-shampoo',
      descriptionBn: 'ডাভ শ্যাম্পু, ক্ষতিগ্রস্ত চুলের মেরামত', descriptionEn: 'Dove Shampoo, damaged hair repair',
      price: 195, originalPrice: 220, unit: 'বোতল', stock: 150, images: '["🧴"]',
      categoryId: categories['personal-care'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.5, reviewCount: 76,
    },

    // --- Aarong / Marks / Igloo ---
    {
      nameBn: 'আড়ং দুধ', nameEn: 'Aarong Milk', slug: 'aarong-milk',
      descriptionBn: 'আড়ং ফুল ক্রিম দুধ, খাঁটি ও পুষ্টিকর', descriptionEn: 'Aarong Full Cream Milk, pure and nutritious',
      price: 85, originalPrice: 90, unit: 'লিটার', stock: 300, images: '["🥛"]',
      categoryId: categories['dairy-eggs'], brandId: brands['aarong'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 6, rating: 4.7, reviewCount: 234,
    },
    {
      nameBn: 'আড়ং ঘি', nameEn: 'Aarong Ghee', slug: 'aarong-ghee',
      descriptionBn: 'আড়ং গাওয়া ঘি, খাঁটি ও সুগন্ধি', descriptionEn: 'Aarong Cow Ghee, pure and aromatic',
      price: 680, originalPrice: 750, unit: '৫০০ মিলি', stock: 80, images: '["🧈"]',
      categoryId: categories['dairy-eggs'], brandId: brands['aarong'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 9, rating: 4.8, reviewCount: 189,
    },
    {
      nameBn: 'আড়ং দই', nameEn: 'Aarong Yogurt', slug: 'aarong-yogurt',
      descriptionBn: 'আড়ং মিষ্টি দই, ঘন ও সুস্বাদু', descriptionEn: 'Aarong Sweet Yogurt, thick and delicious',
      price: 65, originalPrice: 70, unit: 'পিস', stock: 200, images: '["🥣"]',
      categoryId: categories['dairy-eggs'], brandId: brands['aarong'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 7, rating: 4.6, reviewCount: 156,
    },
    {
      nameBn: 'আড়ং মাখন', nameEn: 'Aarong Butter', slug: 'aarong-butter',
      descriptionBn: 'আড়ং মাখন, তাজা ও ক্রিমি', descriptionEn: 'Aarong Butter, fresh and creamy',
      price: 190, originalPrice: 210, unit: '২০০ গ্রাম', stock: 100, images: '["🧈"]',
      categoryId: categories['dairy-eggs'], brandId: brands['aarong'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.5, reviewCount: 87,
    },
    {
      nameBn: 'মার্কস ফুলক্রিম দুধ', nameEn: 'Marks Full Cream Milk', slug: 'marks-full-cream-milk',
      descriptionBn: 'মার্কস ফুলক্রিম দুধ, পুষ্টিকর', descriptionEn: 'Marks Full Cream Milk, nutritious',
      price: 80, originalPrice: 85, unit: 'লিটার', stock: 250, images: '["🥛"]',
      categoryId: categories['dairy-eggs'], brandId: brands['marks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 6, rating: 4.4, reviewCount: 98,
    },
    {
      nameBn: 'মার্কস দই', nameEn: 'Marks Yogurt', slug: 'marks-yogurt',
      descriptionBn: 'মার্কস মিষ্টি দই, সুস্বাদু ও ঘন', descriptionEn: 'Marks Sweet Yogurt, delicious and thick',
      price: 55, originalPrice: 60, unit: 'পিস', stock: 180, images: '["🥣"]',
      categoryId: categories['dairy-eggs'], brandId: brands['marks'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 8, rating: 4.3, reviewCount: 76,
    },
    {
      nameBn: 'ইগলু আইসক্রিম', nameEn: 'Igloo Ice Cream', slug: 'igloo-ice-cream',
      descriptionBn: 'ইগলু আইসক্রিম, ক্রিমি ও মিষ্টি', descriptionEn: 'Igloo Ice Cream, creamy and sweet',
      price: 120, originalPrice: 140, unit: 'বক্স', stock: 100, images: '["🍦"]',
      categoryId: categories['dairy-eggs'], brandId: brands['igloo'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 14, rating: 4.5, reviewCount: 134,
    },
    {
      nameBn: 'ইগলু কুলফি', nameEn: 'Igloo Kulfi', slug: 'igloo-kulfi',
      descriptionBn: 'ইগলু কুলফি, ঐতিহ্যবাহী মিষ্টি', descriptionEn: 'Igloo Kulfi, traditional dessert',
      price: 30, originalPrice: 35, unit: 'পিস', stock: 200, images: '["🧊"]',
      categoryId: categories['dairy-eggs'], brandId: brands['igloo'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.2, reviewCount: 65,
    },

    // --- Dettol / Savlon ---
    {
      nameBn: 'ডেটল সাবান', nameEn: 'Dettol Soap', slug: 'dettol-soap',
      descriptionBn: 'ডেটল সাবান, জীবাণুমুক্তি ও সুরক্ষা', descriptionEn: 'Dettol Soap, germ protection',
      price: 55, originalPrice: 65, unit: 'পিস', stock: 300, images: '["🧼"]',
      categoryId: categories['personal-care'], brandId: brands['dettol'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 15, rating: 4.5, reviewCount: 134,
    },
    {
      nameBn: 'ডেটল হ্যান্ডওয়াশ', nameEn: 'Dettol Handwash', slug: 'dettol-handwash',
      descriptionBn: 'ডেটল হ্যান্ডওয়াশ, হাত পরিষ্কারের তরল', descriptionEn: 'Dettol Handwash, hand cleaning liquid',
      price: 140, originalPrice: 160, unit: 'বোতল', stock: 200, images: '["🧴"]',
      categoryId: categories['personal-care'], brandId: brands['dettol'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 12, rating: 4.6, reviewCount: 156,
    },
    {
      nameBn: 'স্যাভলন সাবান', nameEn: 'Savlon Soap', slug: 'savlon-soap',
      descriptionBn: 'স্যাভলন সাবান, অ্যান্টিসেপটিক সুরক্ষা', descriptionEn: 'Savlon Soap, antiseptic protection',
      price: 50, originalPrice: 58, unit: 'পিস', stock: 250, images: '["🧼"]',
      categoryId: categories['personal-care'], brandId: brands['savlon'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 89,
    },
    {
      nameBn: 'স্যাভলন অ্যান্টিসেপটিক', nameEn: 'Savlon Antiseptic', slug: 'savlon-antiseptic',
      descriptionBn: 'স্যাভলন অ্যান্টিসেপটিক তরল, ক্ষত সুরক্ষা', descriptionEn: 'Savlon Antiseptic liquid, wound protection',
      price: 120, originalPrice: 140, unit: 'বোতল', stock: 150, images: '["🧬"]',
      categoryId: categories['personal-care'], brandId: brands['savlon'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.5, reviewCount: 76,
    },

    // --- Tibet ---
    {
      nameBn: 'তিব্বত টুথপেস্ট', nameEn: 'Tibet Toothpaste', slug: 'tibet-toothpaste',
      descriptionBn: 'তিব্বত টুথপেস্ট, দাঁতের যত্নে বিশ্বস্ত', descriptionEn: 'Tibet Toothpaste, trusted dental care',
      price: 65, originalPrice: 75, unit: 'টিউব', stock: 250, images: '["🪥"]',
      categoryId: categories['personal-care'], brandId: brands['tibet'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.2, reviewCount: 98,
    },
    {
      nameBn: 'তিব্বত হেয়ার অয়েল', nameEn: 'Tibet Hair Oil', slug: 'tibet-hair-oil',
      descriptionBn: 'তিব্বত হেয়ার অয়েল, চুলের পুষ্টি ও বৃদ্ধি', descriptionEn: 'Tibet Hair Oil, hair nourishment and growth',
      price: 95, originalPrice: 110, unit: 'বোতল', stock: 180, images: '["💧"]',
      categoryId: categories['personal-care'], brandId: brands['tibet'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 72,
    },

    // --- RFL (আরএফএল) - Household ---
    {
      nameBn: 'আরএফএল প্লাস্টিক বালতি', nameEn: 'RFL Plastic Bucket', slug: 'rfl-plastic-bucket',
      descriptionBn: 'আরএফএল প্লাস্টিক বালতি, মজবুত ও টেকসই', descriptionEn: 'RFL Plastic Bucket, strong and durable',
      price: 180, originalPrice: 210, unit: 'পিস', stock: 100, images: '["🪣"]',
      categoryId: categories['household'], brandId: brands['rfl'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.3, reviewCount: 56,
    },
    {
      nameBn: 'আরএফএল স্টোরেজ কন্টেইনার', nameEn: 'RFL Storage Container', slug: 'rfl-storage-container',
      descriptionBn: 'আরএফএল খাবার সংরক্ষণ কন্টেইনার, এয়ারটাইট', descriptionEn: 'RFL Food Storage Container, airtight',
      price: 120, originalPrice: 140, unit: 'সেট', stock: 150, images: '["📦"]',
      categoryId: categories['household'], brandId: brands['rfl'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.2, reviewCount: 48,
    },

    // --- BABY (বেবি) - Baby Care ---
    {
      nameBn: 'বেবি ডায়াপার', nameEn: 'Baby Diaper', slug: 'baby-diaper',
      descriptionBn: 'বেবি ডায়াপার, শিশুদের জন্য আরামদায়ক', descriptionEn: 'Baby Diaper, comfortable for babies',
      price: 350, originalPrice: 400, unit: 'প্যাকেট', stock: 120, images: '["👶"]',
      categoryId: categories['personal-care'], brandId: brands['baby'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.4, reviewCount: 78,
    },
    {
      nameBn: 'বেবি লোশন', nameEn: 'Baby Lotion', slug: 'baby-lotion',
      descriptionBn: 'বেবি লোশন, শিশুর ত্বকের যত্নে', descriptionEn: 'Baby Lotion, for baby skin care',
      price: 180, originalPrice: 200, unit: 'বোতল', stock: 100, images: '["🧴"]',
      categoryId: categories['personal-care'], brandId: brands['baby'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.3, reviewCount: 56,
    },

    // --- PRAN-RFL (প্রাণ-আরএফএল) - Diversified ---
    {
      nameBn: 'প্রাণ-আরএফএল চায়ের কাপ সেট', nameEn: 'PRAN-RFL Tea Cup Set', slug: 'pran-rfl-tea-cup-set',
      descriptionBn: 'প্রাণ-আরএফএল চায়ের কাপ সেট, ৬ পিস', descriptionEn: 'PRAN-RFL Tea Cup Set, 6 pieces',
      price: 250, originalPrice: 300, unit: 'সেট', stock: 80, images: '["☕"]',
      categoryId: categories['household'], brandId: brands['pran-rfl'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.1, reviewCount: 34,
    },
    {
      nameBn: 'প্রাণ-আরএফএল ডিনার সেট', nameEn: 'PRAN-RFL Dinner Set', slug: 'pran-rfl-dinner-set',
      descriptionBn: 'প্রাণ-আরএফএল ডিনার সেট, মেলামাইন', descriptionEn: 'PRAN-RFL Dinner Set, melamine',
      price: 850, originalPrice: 1000, unit: 'সেট', stock: 40, images: '["🍽️"]',
      categoryId: categories['household'], brandId: brands['pran-rfl'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 15, rating: 4.2, reviewCount: 28,
    },

    // ═══════════════════════════════════════════════════════════
    // অতিরিক্ত ব্র্যান্ড পণ্য (Additional Brand Products) - 52+ products
    // ═══════════════════════════════════════════════════════════

    // --- PRAN Group (প্রাণ) - Additional ---
    {
      nameBn: 'প্রাণ লিচু জুস', nameEn: 'PRAN Litchi Juice', slug: 'pran-litchi-juice-1-ltr',
      descriptionBn: 'প্রাণ লিচু জুস, ১ লিটার, তাজা লিচুর স্বাদ', descriptionEn: 'PRAN Litchi Juice, 1 liter, fresh lychee flavor',
      price: 70, originalPrice: 80, unit: 'লিটার', stock: 220, images: '["🧃"]',
      categoryId: categories['beverages'], brandId: brands['pran'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 12, rating: 4.3, reviewCount: 112,
    },
    {
      nameBn: 'প্রাণ অরেঞ্জ ড্রিংক', nameEn: 'PRAN Orange Drink', slug: 'pran-orange-drink-1-ltr',
      descriptionBn: 'প্রাণ অরেঞ্জ ড্রিংক, ১ লিটার', descriptionEn: 'PRAN Orange Drink, 1 liter',
      price: 60, originalPrice: 70, unit: 'লিটার', stock: 200, images: '["🍊"]',
      categoryId: categories['beverages'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 78,
    },
    {
      nameBn: 'প্রাণ স্পাইসি চানাচুর', nameEn: 'PRAN Spicy Chanachur', slug: 'pran-spicy-chanachur',
      descriptionBn: 'প্রাণ স্পাইসি চানাচুর, অতিরিক্ত ঝাল', descriptionEn: 'PRAN Spicy Chanachur, extra hot',
      price: 45, originalPrice: 50, unit: 'প্যাকেট', stock: 300, images: '["🌶️"]',
      categoryId: categories['snacks'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 10, rating: 4.5, reviewCount: 167,
    },
    {
      nameBn: 'প্রাণ নাটি বিস্কুট', nameEn: 'PRAN Nutty Biscuit', slug: 'pran-nutty-biscuit',
      descriptionBn: 'প্রাণ নাটি বিস্কুট, বাদামযুক্ত ও মুক্তা', descriptionEn: 'PRAN Nutty Biscuit, nutty and crunchy',
      price: 30, originalPrice: 35, unit: 'প্যাকেট', stock: 350, images: '["🍪"]',
      categoryId: categories['snacks'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.2, reviewCount: 89,
    },
    {
      nameBn: 'প্রাণ ডাল', nameEn: 'PRAN Dal', slug: 'pran-dal-1kg',
      descriptionBn: 'প্রাণ মসুর ডাল, পরিষ্কার ও বাছাই', descriptionEn: 'PRAN Masoor Dal, cleaned and sorted',
      price: 125, originalPrice: 140, unit: 'কেজি', stock: 280, images: '["🫘"]',
      categoryId: categories['rice-lentils'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.3, reviewCount: 95,
    },
    {
      nameBn: 'প্রাণ চিলি সস', nameEn: 'PRAN Chili Sauce', slug: 'pran-chili-sauce',
      descriptionBn: 'প্রাণ চিলি সস, ঝাল ও মসলাযুক্ত', descriptionEn: 'PRAN Chili Sauce, spicy and flavorful',
      price: 75, originalPrice: 85, unit: 'বোতল', stock: 200, images: '["🌶️"]',
      categoryId: categories['spices-oil'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.2, reviewCount: 67,
    },
    {
      nameBn: 'প্রাণ আচার', nameEn: 'PRAN Pickles', slug: 'pran-pickles',
      descriptionBn: 'প্রাণ মিশ্র আচার, ঐতিহ্যবাহী স্বাদ', descriptionEn: 'PRAN Mixed Pickles, traditional taste',
      price: 95, originalPrice: 110, unit: 'বয়াম', stock: 180, images: '["🫙"]',
      categoryId: categories['spices-oil'], brandId: brands['pran'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.4, reviewCount: 82,
    },

    // --- ACI Limited (এসিআই) - Additional ---
    {
      nameBn: 'এসিআই খাঁটি সরিষার তেল', nameEn: 'ACI Pure Mustard Oil', slug: 'aci-pure-mustard-oil',
      descriptionBn: 'এসিআই খাঁটি সরিষার তেল, ঘ্রাণযুক্ত ও বিশুদ্ধ', descriptionEn: 'ACI Pure Mustard Oil, aromatic and pure',
      price: 225, originalPrice: 250, unit: 'লিটার', stock: 160, images: '["🫗"]',
      categoryId: categories['spices-oil'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.5, reviewCount: 98,
    },
    {
      nameBn: 'এসিআই সয়াবিন তেল', nameEn: 'ACI Soyabean Oil', slug: 'aci-soyabean-oil',
      descriptionBn: 'এসিআই সয়াবিন তেল, রিফাইন্ড ও বিশুদ্ধ', descriptionEn: 'ACI Soyabean Oil, refined and pure',
      price: 195, originalPrice: 215, unit: 'লিটার', stock: 200, images: '["🫙"]',
      categoryId: categories['spices-oil'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.3, reviewCount: 85,
    },
    {
      nameBn: 'এসিআই আটা', nameEn: 'ACI Flour', slug: 'aci-flour-2kg',
      descriptionBn: 'এসিআই আটা, রুটি ও পরোটার জন্য', descriptionEn: 'ACI Flour, for roti and paratha',
      price: 90, originalPrice: 100, unit: '২ কেজি', stock: 250, images: '["🌾"]',
      categoryId: categories['bakery'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.2, reviewCount: 76,
    },
    {
      nameBn: 'এসিআই চিনি', nameEn: 'ACI Sugar', slug: 'aci-sugar-1kg',
      descriptionBn: 'এসিআই খাদ্যশর্করা, বিশুদ্ধ ও সাদা', descriptionEn: 'ACI Sugar, pure and white',
      price: 125, originalPrice: 135, unit: 'কেজি', stock: 300, images: '["🍬"]',
      categoryId: categories['beverages'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 7, rating: 4.3, reviewCount: 88,
    },
    {
      nameBn: 'এসিআই সুজি', nameEn: 'ACI Semolina', slug: 'aci-semolina-1kg',
      descriptionBn: 'এসিআই সুজি, হালুয়া ও পায়েসের জন্য', descriptionEn: 'ACI Semolina, for halwa and payesh',
      price: 65, originalPrice: 75, unit: 'কেজি', stock: 200, images: '["🥣"]',
      categoryId: categories['bakery'], brandId: brands['aci'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.1, reviewCount: 54,
    },

    // --- Square Consumer Products ---
    {
      nameBn: 'স্কয়ার তুর ডাল', nameEn: 'Square Toor Dal', slug: 'square-toor-dal-1kg',
      descriptionBn: 'স্কয়ার তুর ডাল, বিশুদ্ধ ও পরিষ্কার', descriptionEn: 'Square Toor Dal, pure and cleaned',
      price: 140, originalPrice: 160, unit: 'কেজি', stock: 180, images: '["🟡"]',
      categoryId: categories['rice-lentils'], brandId: brands['square'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 67,
    },
    {
      nameBn: 'স্কয়ার মুগ ডাল', nameEn: 'Square Moong Dal', slug: 'square-moong-dal-1kg',
      descriptionBn: 'স্কয়ার মুগ ডাল, খিচুড়ির জন্য উৎকৃষ্ট', descriptionEn: 'Square Moong Dal, excellent for khichuri',
      price: 155, originalPrice: 175, unit: 'কেজি', stock: 170, images: '["🟢"]',
      categoryId: categories['rice-lentils'], brandId: brands['square'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 72,
    },
    {
      nameBn: 'স্কয়ার ছোলা ডাল', nameEn: 'Square Chana Dal', slug: 'square-chana-dal-1kg',
      descriptionBn: 'স্কয়ার ছোলা ডাল, ঘুগনি ও তরকারির জন্য', descriptionEn: 'Square Chana Dal, for ghugni and curry',
      price: 115, originalPrice: 130, unit: 'কেজি', stock: 200, images: '["🟤"]',
      categoryId: categories['rice-lentils'], brandId: brands['square'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.2, reviewCount: 58,
    },
    {
      nameBn: 'স্কয়ার সরিষার তেল', nameEn: 'Square Mustard Oil', slug: 'square-mustard-oil',
      descriptionBn: 'স্কয়ার সরিষার তেল, খাঁটি ও ঘ্রাণযুক্ত', descriptionEn: 'Square Mustard Oil, pure and aromatic',
      price: 220, originalPrice: 245, unit: 'লিটার', stock: 140, images: '["🫗"]',
      categoryId: categories['spices-oil'], brandId: brands['square'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.4, reviewCount: 76,
    },
    {
      nameBn: 'স্কয়ার সয়াবিন তেল', nameEn: 'Square Soyabean Oil', slug: 'square-soyabean-oil',
      descriptionBn: 'স্কয়ার সয়াবিন তেল, রিফাইন্ড ও বিশুদ্ধ', descriptionEn: 'Square Soyabean Oil, refined and pure',
      price: 190, originalPrice: 210, unit: 'লিটার', stock: 160, images: '["🫙"]',
      categoryId: categories['spices-oil'], brandId: brands['square'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.3, reviewCount: 68,
    },

    // --- Unilever BD - Additional ---
    {
      nameBn: 'ভিম ডিশওয়াশ', nameEn: 'Vim Dishwash', slug: 'vim-dishwash',
      descriptionBn: 'ভিম ডিশওয়াশ, বাসন মসৃণ ও চকচকে', descriptionEn: 'Vim Dishwash, smooth and shiny dishes',
      price: 70, originalPrice: 80, unit: 'বোতল', stock: 280, images: '["🫧"]',
      categoryId: categories['household'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 12, rating: 4.4, reviewCount: 134,
    },
    {
      nameBn: 'লাইফবয় সাবান', nameEn: 'Lifebuoy Soap', slug: 'lifebuoy-soap',
      descriptionBn: 'লাইফবয় সাবান, জীবাণুমুক্তি ও সুরক্ষা', descriptionEn: 'Lifebuoy Soap, germ protection',
      price: 45, originalPrice: 52, unit: 'পিস', stock: 320, images: '["🧼"]',
      categoryId: categories['personal-care'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.3, reviewCount: 108,
    },
    {
      nameBn: 'সানসিল্ক শ্যাম্পু', nameEn: 'Sunsilk Shampoo', slug: 'sunsilk-shampoo',
      descriptionBn: 'সানসিল্ক শ্যাম্পু, চুলের পুষ্টি ও উজ্জ্বলতা', descriptionEn: 'Sunsilk Shampoo, hair nourishment and shine',
      price: 170, originalPrice: 195, unit: 'বোতল', stock: 200, images: '["🧴"]',
      categoryId: categories['personal-care'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.4, reviewCount: 92,
    },
    {
      nameBn: 'পন্ডস ফেস ওয়াশ', nameEn: "Pond's Face Wash", slug: 'ponds-face-wash',
      descriptionBn: 'পন্ডস ফেস ওয়াশ, মুখ পরিষ্কার ও উজ্জ্বলতা', descriptionEn: "Pond's Face Wash, facial cleansing and brightness",
      price: 160, originalPrice: 185, unit: 'টিউব', stock: 180, images: '["✨"]',
      categoryId: categories['personal-care'], brandId: brands['unilever-bd'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 14, rating: 4.5, reviewCount: 118,
    },

    // --- Fresh / BEOIL - Additional ---
    {
      nameBn: 'ফ্রেশ রাইস ব্রান অয়েল', nameEn: 'Fresh Rice Bran Oil', slug: 'fresh-rice-bran-oil',
      descriptionBn: 'ফ্রেশ রাইস ব্রান অয়েল, স্বাস্থ্যকর রান্নার তেল', descriptionEn: 'Fresh Rice Bran Oil, healthy cooking oil',
      price: 210, originalPrice: 235, unit: 'লিটার', stock: 120, images: '["🫙"]',
      categoryId: categories['spices-oil'], brandId: brands['fresh'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.3, reviewCount: 54,
    },

    // --- Teer (তীর) ---
    {
      nameBn: 'তীর আটা', nameEn: 'Teer Atta', slug: 'teer-atta-2kg',
      descriptionBn: 'তীর আটা, রুটি ও পরোটার জন্য উৎকৃষ্ট', descriptionEn: 'Teer Atta, excellent for roti and paratha',
      price: 95, originalPrice: 110, unit: '২ কেজি', stock: 300, images: '["🌾"]',
      categoryId: categories['bakery'], brandId: brands['teer'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 14, rating: 4.5, reviewCount: 198,
    },
    {
      nameBn: 'তীর সুজি', nameEn: 'Teer Suji', slug: 'teer-suji-1kg',
      descriptionBn: 'তীর সুজি, হালুয়া ও পায়েসের জন্য', descriptionEn: 'Teer Suji, for halwa and payesh',
      price: 60, originalPrice: 68, unit: 'কেজি', stock: 220, images: '["🥣"]',
      categoryId: categories['bakery'], brandId: brands['teer'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 86,
    },
    {
      nameBn: 'তীর ডাল', nameEn: 'Teer Dal', slug: 'teer-dal-1kg',
      descriptionBn: 'তীর মসুর ডাল, বিশুদ্ধ ও পরিষ্কার', descriptionEn: 'Teer Masoor Dal, pure and cleaned',
      price: 120, originalPrice: 135, unit: 'কেজি', stock: 250, images: '["🫘"]',
      categoryId: categories['rice-lentils'], brandId: brands['teer'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 92,
    },

    // --- City Group ---
    {
      nameBn: 'সিটি আটা', nameEn: 'City Flour', slug: 'city-flour-2kg',
      descriptionBn: 'সিটি আটা, মিষ্টি ও রুটির জন্য', descriptionEn: 'City Flour, for sweets and roti',
      price: 85, originalPrice: 95, unit: '২ কেজি', stock: 280, images: '["🌾"]',
      categoryId: categories['bakery'], brandId: brands['city-group'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.2, reviewCount: 74,
    },
    {
      nameBn: 'সিটি সুজি', nameEn: 'City Semolina', slug: 'city-semolina-1kg',
      descriptionBn: 'সিটি সুজি, হালুয়া ও পুডিংয়ের জন্য', descriptionEn: 'City Semolina, for halwa and pudding',
      price: 55, originalPrice: 62, unit: 'কেজি', stock: 200, images: '["🥣"]',
      categoryId: categories['bakery'], brandId: brands['city-group'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.1, reviewCount: 48,
    },
    {
      nameBn: 'সিটি চিনি', nameEn: 'City Sugar', slug: 'city-sugar-1kg',
      descriptionBn: 'সিটি চিনি, বিশুদ্ধ ও সাদা', descriptionEn: 'City Sugar, pure and white',
      price: 120, originalPrice: 130, unit: 'কেজি', stock: 350, images: '["🍬"]',
      categoryId: categories['beverages'], brandId: brands['city-group'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 8, rating: 4.2, reviewCount: 65,
    },
    {
      nameBn: 'সিটি ডাল', nameEn: 'City Dal', slug: 'city-dal-1kg',
      descriptionBn: 'সিটি মসুর ডাল, পরিষ্কার ও বাছাই', descriptionEn: 'City Masoor Dal, cleaned and sorted',
      price: 115, originalPrice: 130, unit: 'কেজি', stock: 240, images: '["🫘"]',
      categoryId: categories['rice-lentils'], brandId: brands['city-group'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.2, reviewCount: 56,
    },

    // --- Radhuni (রাধুনী) - Additional ---
    {
      nameBn: 'রাধুনী কারি পাউডার', nameEn: 'Radhuni Curry Powder', slug: 'radhuni-curry-powder',
      descriptionBn: 'রাধুনী কারি পাউডার, তরকারির জন্য', descriptionEn: 'Radhuni Curry Powder, for curry',
      price: 70, originalPrice: 80, unit: '১০০ গ্রাম', stock: 220, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.4, reviewCount: 86,
    },
    {
      nameBn: 'রাধুনী ধনে গুঁড়া', nameEn: 'Radhuni Coriander Powder', slug: 'radhuni-coriander-powder',
      descriptionBn: 'রাধুনী ধনে গুঁড়া, তাজা ও সুগন্ধি', descriptionEn: 'Radhuni Coriander Powder, fresh and aromatic',
      price: 80, originalPrice: 90, unit: '২৫০ গ্রাম', stock: 200, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.3, reviewCount: 74,
    },
    {
      nameBn: 'রাধুনী ফিশ মশলা', nameEn: 'Radhuni Fish Masala', slug: 'radhuni-fish-masala',
      descriptionBn: 'রাধুনী ফিশ মশলা, মাছের তরকারির জন্য', descriptionEn: 'Radhuni Fish Masala, for fish curry',
      price: 65, originalPrice: 75, unit: '১০০ গ্রাম', stock: 180, images: '["🐟"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 13, rating: 4.5, reviewCount: 102,
    },
    {
      nameBn: 'রাধুনী বিরিয়ানি মশলা', nameEn: 'Radhuni Biryani Masala', slug: 'radhuni-biryani-masala',
      descriptionBn: 'রাধুনী বিরিয়ানি মশলা, ঘরোয়া বিরিয়ানির জন্য', descriptionEn: 'Radhuni Biryani Masala, for homemade biryani',
      price: 90, originalPrice: 105, unit: '৫০ গ্রাম', stock: 160, images: '["🍚"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 14, rating: 4.6, reviewCount: 118,
    },
    {
      nameBn: 'রাধুনী কাবাব মশলা', nameEn: 'Radhuni Kebab Masala', slug: 'radhuni-kebab-masala',
      descriptionBn: 'রাধুনী কাবাব মশলা, কাবাব ও ভুনার জন্য', descriptionEn: 'Radhuni Kebab Masala, for kebab and bhuna',
      price: 75, originalPrice: 85, unit: '৫০ গ্রাম', stock: 140, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['radhuni'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 62,
    },

    // --- Shan (শান) ---
    {
      nameBn: 'শান বিরিয়ানি মশলা', nameEn: 'Shan Biryani Masala', slug: 'shan-biryani-masala',
      descriptionBn: 'শান বিরিয়ানি মশলা, প্রিমিয়াম মশলা মিশ্রণ', descriptionEn: 'Shan Biryani Masala, premium spice mix',
      price: 95, originalPrice: 110, unit: '৬০ গ্রাম', stock: 200, images: '["🍚"]',
      categoryId: categories['spices-oil'], brandId: brands['shan'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 14, rating: 4.7, reviewCount: 156,
    },
    {
      nameBn: 'শান হালিম মিক্স', nameEn: 'Shan Haleem Mix', slug: 'shan-haleem-mix',
      descriptionBn: 'শান হালিম মিক্স, ঐতিহ্যবাহী হালিমের জন্য', descriptionEn: 'Shan Haleem Mix, for traditional haleem',
      price: 110, originalPrice: 125, unit: '১০০ গ্রাম', stock: 150, images: '["🥘"]',
      categoryId: categories['spices-oil'], brandId: brands['shan'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.5, reviewCount: 84,
    },
    {
      nameBn: 'শান নিহারি মিক্স', nameEn: 'Shan Nihari Mix', slug: 'shan-nihari-mix',
      descriptionBn: 'শান নিহারি মিক্স, নিহারি রান্নার জন্য', descriptionEn: 'Shan Nihari Mix, for cooking nihari',
      price: 105, originalPrice: 120, unit: '৮০ গ্রাম', stock: 130, images: '["🥘"]',
      categoryId: categories['spices-oil'], brandId: brands['shan'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.4, reviewCount: 72,
    },
    {
      nameBn: 'শান কোরমা মশলা', nameEn: 'Shan Korma Masala', slug: 'shan-korma-masala',
      descriptionBn: 'শান কোরমা মশলা, মুগলাই কোরমার জন্য', descriptionEn: 'Shan Korma Masala, for Mughlai korma',
      price: 90, originalPrice: 100, unit: '৫০ গ্রাম', stock: 170, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['shan'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 10, rating: 4.5, reviewCount: 88,
    },
    {
      nameBn: 'শান কড়াই মশলা', nameEn: 'Shan Karahi Masala', slug: 'shan-karahi-masala',
      descriptionBn: 'শান কড়াই মশলা, কড়াই গোস্তের জন্য', descriptionEn: 'Shan Karahi Masala, for karahi gosht',
      price: 85, originalPrice: 95, unit: '৫০ গ্রাম', stock: 160, images: '["🟫"]',
      categoryId: categories['spices-oil'], brandId: brands['shan'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.4, reviewCount: 76,
    },

    // --- Aarong Dairy - Additional ---
    {
      nameBn: 'আড়ং পনির', nameEn: 'Aarong Paneer', slug: 'aarong-paneer',
      descriptionBn: 'আড়ং পনির, তাজা ও নরম', descriptionEn: 'Aarong Paneer, fresh and soft',
      price: 220, originalPrice: 250, unit: '২৫০ গ্রাম', stock: 80, images: '["🧀"]',
      categoryId: categories['dairy-eggs'], brandId: brands['aarong'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.5, reviewCount: 62,
    },
    {
      nameBn: 'আড়ং ক্রিম', nameEn: 'Aarong Cream', slug: 'aarong-cream',
      descriptionBn: 'আড়ং ফ্রেশ ক্রিম, মিষ্টি ও ডেজার্টে', descriptionEn: 'Aarong Fresh Cream, for sweets and desserts',
      price: 110, originalPrice: 125, unit: '২৫০ মিলি', stock: 90, images: '["🥛"]',
      categoryId: categories['dairy-eggs'], brandId: brands['aarong'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.3, reviewCount: 48,
    },

    // --- Milk Vita (মিল্কভিটা) ---
    {
      nameBn: 'মিল্কভিটা ফুলক্রিম দুধ', nameEn: 'Milk Vita Full Cream Milk', slug: 'milk-vita-full-cream-milk',
      descriptionBn: 'মিল্কভিটা ফুলক্রিম দুধ, খাঁটি ও পুষ্টিকর', descriptionEn: 'Milk Vita Full Cream Milk, pure and nutritious',
      price: 75, originalPrice: 80, unit: 'লিটার', stock: 280, images: '["🥛"]',
      categoryId: categories['dairy-eggs'], brandId: brands['milk-vita'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 6, rating: 4.3, reviewCount: 112,
    },
    {
      nameBn: 'মিল্কভিটা মাখন', nameEn: 'Milk Vita Butter', slug: 'milk-vita-butter',
      descriptionBn: 'মিল্কভিটা মাখন, তাজা ও ক্রিমি', descriptionEn: 'Milk Vita Butter, fresh and creamy',
      price: 170, originalPrice: 190, unit: '২০০ গ্রাম', stock: 100, images: '["🧈"]',
      categoryId: categories['dairy-eggs'], brandId: brands['milk-vita'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.2, reviewCount: 56,
    },
    {
      nameBn: 'মিল্কভিটা ঘি', nameEn: 'Milk Vita Ghee', slug: 'milk-vita-ghee',
      descriptionBn: 'মিল্কভিটা গাওয়া ঘি, খাঁটি ও সুগন্ধি', descriptionEn: 'Milk Vita Cow Ghee, pure and aromatic',
      price: 620, originalPrice: 700, unit: '৫০০ মিলি', stock: 70, images: '["🧈"]',
      categoryId: categories['dairy-eggs'], brandId: brands['milk-vita'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.5, reviewCount: 84,
    },
    {
      nameBn: 'মিল্কভিটা দই', nameEn: 'Milk Vita Yogurt', slug: 'milk-vita-yogurt',
      descriptionBn: 'মিল্কভিটা মিষ্টি দই, ঘন ও সুস্বাদু', descriptionEn: 'Milk Vita Sweet Yogurt, thick and delicious',
      price: 50, originalPrice: 55, unit: 'পিস', stock: 200, images: '["🥣"]',
      categoryId: categories['dairy-eggs'], brandId: brands['milk-vita'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.2, reviewCount: 68,
    },

    // --- Igloo (ইগলু) - Additional ---
    {
      nameBn: 'ইগলু আইসক্রিম ফ্যামিলি প্যাক', nameEn: 'Igloo Ice Cream Family Pack', slug: 'igloo-ice-cream-family-pack',
      descriptionBn: 'ইগলু আইসক্রিম ফ্যামিলি প্যাক, ১ লিটার', descriptionEn: 'Igloo Ice Cream Family Pack, 1 liter',
      price: 280, originalPrice: 320, unit: 'বক্স', stock: 80, images: '["🍦"]',
      categoryId: categories['dairy-eggs'], brandId: brands['igloo'], isOrganic: false, isFeatured: true, isTrending: true,
      discount: 12, rating: 4.6, reviewCount: 98,
    },
    {
      nameBn: 'ইগলু চকবার', nameEn: 'Igloo Chocbar', slug: 'igloo-chocbar',
      descriptionBn: 'ইগলু চকবার, চকলেট আইসক্রিম', descriptionEn: 'Igloo Chocbar, chocolate ice cream',
      price: 40, originalPrice: 45, unit: 'পিস', stock: 250, images: '["🍫"]',
      categoryId: categories['dairy-eggs'], brandId: brands['igloo'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 11, rating: 4.3, reviewCount: 87,
    },
    {
      nameBn: 'ইগলু পোলার', nameEn: 'Igloo Polar', slug: 'igloo-polar',
      descriptionBn: 'ইগলু পোলার, ক্রিমি আইসক্রিম বার', descriptionEn: 'Igloo Polar, creamy ice cream bar',
      price: 25, originalPrice: 30, unit: 'পিস', stock: 300, images: '["🧊"]',
      categoryId: categories['dairy-eggs'], brandId: brands['igloo'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.2, reviewCount: 72,
    },
    {
      nameBn: 'ইগলু কোন', nameEn: 'Igloo Cones', slug: 'igloo-cones',
      descriptionBn: 'ইগলু কোন আইসক্রিম, কুড়মুড়ে কোন', descriptionEn: 'Igloo Cones, crispy cone ice cream',
      price: 35, originalPrice: 40, unit: 'পিস', stock: 200, images: '["🍦"]',
      categoryId: categories['dairy-eggs'], brandId: brands['igloo'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 12, rating: 4.4, reviewCount: 65,
    },

    // --- Lal Qilla (লাল কেল্লা) ---
    {
      nameBn: 'লাল কেল্লা বাসমতি চাল', nameEn: 'Lal Qilla Basmati Rice', slug: 'lal-qilla-basmati-rice',
      descriptionBn: 'লাল কেল্লা বাসমতি চাল, প্রিমিয়াম দীর্ঘ দানা', descriptionEn: 'Lal Qilla Basmati Rice, premium long grain',
      price: 200, originalPrice: 230, unit: 'কেজি', stock: 200, images: '["🍚"]',
      categoryId: categories['rice-lentils'], brandId: brands['lal-qilla'], isOrganic: false, isFeatured: true, isTrending: false,
      discount: 13, rating: 4.7, reviewCount: 142,
    },
    {
      nameBn: 'লাল কেল্লা মিনি বাসমতি', nameEn: 'Lal Qilla Mini Basmati', slug: 'lal-qilla-mini-basmati',
      descriptionBn: 'লাল কেল্লা মিনি বাসমতি চাল, ছোট দানা', descriptionEn: 'Lal Qilla Mini Basmati, short grain',
      price: 170, originalPrice: 195, unit: 'কেজি', stock: 180, images: '["🌾"]',
      categoryId: categories['rice-lentils'], brandId: brands['lal-qilla'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.5, reviewCount: 96,
    },

    // --- Additional Rice Varieties ---
    {
      nameBn: 'কাতারিভোগ চাল', nameEn: 'Kataribhog Rice', slug: 'kataribhog-rice',
      descriptionBn: 'কাতারিভোগ চাল, সুগন্ধি ও মিষ্টি', descriptionEn: 'Kataribhog Rice, aromatic and sweet',
      price: 110, originalPrice: 125, unit: 'কেজি', stock: 200, images: '["🌾"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: true,
      discount: 12, rating: 4.5, reviewCount: 88,
    },
  ];

  // Bulk create products for performance
  const productCount = (await db.product.createMany({ data: productsData })).count;
  console.log(`✅ ${productCount} products created.`);

  // ============================================================
  // Step 4: Create Demo User
  // ============================================================
  console.log('👤 Creating demo user...');

  const demoUser = await db.user.create({
    data: {
      name: 'নিবির হোসেন',
      phone: '01700000000',
      email: 'nibir@amarbazar.com',
      password: 'demo123456',
      role: 'admin',
      address: 'মোহাম্মদপুর, ঢাকা',
      area: 'মোহাম্মদপুর',
      city: 'ঢাকা',
      loyaltyPoints: 500,
    },
  });

  console.log(`✅ Demo user created: ${demoUser.name} (${demoUser.phone})`);

  // ============================================================
  // Step 5: Create Reviews
  // ============================================================
  console.log('⭐ Creating demo reviews...');

  const hilsa = await db.product.findUnique({ where: { slug: 'hilsa-fish' } });
  const mishtiDoi = await db.product.findUnique({ where: { slug: 'sweet-yogurt' } });
  const basmati = await db.product.findUnique({ where: { slug: 'basmati-rice' } });
  const mustardOil = await db.product.findUnique({ where: { slug: 'mustard-oil' } });
  const honey = await db.product.findUnique({ where: { slug: 'honey' } });
  const mango = await db.product.findUnique({ where: { slug: 'mango' } });
  const chinigura = await db.product.findUnique({ where: { slug: 'chinigura-rice' } });
  const frozenParatha = await db.product.findUnique({ where: { slug: 'frozen-paratha' } });

  const reviewsData = [
    {
      userId: demoUser.id,
      productId: hilsa!.id,
      rating: 5,
      comment: 'অসাধারণ ইলিশ! পদ্মার ইলিশের স্বাদ আসলেই আলাদা। ভাজা ইলিশ খেলে মুখে জুড়িয়ে থাকে।',
    },
    {
      userId: demoUser.id,
      productId: mishtiDoi!.id,
      rating: 5,
      comment: 'বগুড়ার দইয়ের কোনো তুলনা হয় না! মিষ্টি ও ঘন দই, ঠিক যেমনটা চেয়েছিলাম।',
    },
    {
      userId: demoUser.id,
      productId: basmati!.id,
      rating: 4,
      comment: 'বাসমতি চাল খুবই ভালো, বিরিয়ানি হয়েছিল দারুণ। তবে দাম একটু বেশি।',
    },
    {
      userId: demoUser.id,
      productId: mustardOil!.id,
      rating: 5,
      comment: 'খাঁটি সরিষার তেল, শুধু এই তেলেই আসল বাঙালি রান্নার স্বাদ আসে!',
    },
    {
      userId: demoUser.id,
      productId: honey!.id,
      rating: 5,
      comment: 'সুন্দরবনের খাঁটি মধু! সকালে এক চামচ মধু খেলে সারাদিন এনার্জি থাকে।',
    },
    {
      userId: demoUser.id,
      productId: mango!.id,
      rating: 5,
      comment: 'হিমসাগর আম অসাধারণ! এত মিষ্টি আম আগে খাইনি।',
    },
    {
      userId: demoUser.id,
      productId: chinigura!.id,
      rating: 4,
      comment: 'চিনিগুঁড়া চালের ভাত খুবই সুগন্ধি, পোলাও বানালে সবাই প্রশংসা করে।',
    },
    {
      userId: demoUser.id,
      productId: frozenParatha!.id,
      rating: 4,
      comment: 'ফ্রোজেন পরোটা খুবই সুবিধাজনক, দ্রুত তৈরি হয় আর স্বাদও ভালো।',
    },
  ];

  for (const review of reviewsData) {
    await db.review.create({ data: review });
  }

  console.log(`✅ ${reviewsData.length} reviews created.`);

  // ============================================================
  // Step 6: Create Coupons
  // ============================================================
  console.log('🎫 Creating coupon codes...');

  const couponsData = [
    {
      code: 'WELCOME10',
      discount: 10,
      discountType: 'percentage',
      minOrder: 200,
      maxDiscount: 100,
      usageLimit: 1000,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date('2026-12-31'),
    },
    {
      code: 'BAZAR50',
      discount: 50,
      discountType: 'flat',
      minOrder: 500,
      maxDiscount: 50,
      usageLimit: 500,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date('2026-12-31'),
    },
    {
      code: 'FIRST20',
      discount: 20,
      discountType: 'percentage',
      minOrder: 300,
      maxDiscount: 150,
      usageLimit: 2000,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date('2026-06-30'),
    },
    {
      code: 'FREEDELIVERY',
      discount: 60,
      discountType: 'flat',
      minOrder: 800,
      maxDiscount: 60,
      usageLimit: 300,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date('2025-12-31'),
    },
  ];

  for (const coupon of couponsData) {
    await db.coupon.create({ data: coupon });
  }

  console.log(`✅ ${couponsData.length} coupons created.`);

  // ============================================================
  // Step 7: Create Bill Payment Demo Data
  // ============================================================
  console.log('💳 Creating bill payment demo data...');

  const billPaymentsData = [
    {
      type: 'bkash_cashout',
      providerNameBn: 'বিকাশ',
      providerNameEn: 'bKash',
      amount: 5000,
      fee: 18.75,
      customerAccount: '01712345678',
      customerName: 'রহিম উদ্দিন',
      status: 'completed',
      userId: demoUser.id,
    },
    {
      type: 'nagad_cashout',
      providerNameBn: 'নগদ',
      providerNameEn: 'Nagad',
      amount: 3000,
      fee: 10.00,
      customerAccount: '01898765432',
      customerName: 'করিম হাসান',
      status: 'completed',
      userId: demoUser.id,
    },
    {
      type: 'dpdc_electric',
      providerNameBn: 'ডিপিডিসি বিদ্যুৎ',
      providerNameEn: 'DPDC Electric',
      amount: 1520,
      fee: 5.00,
      customerAccount: '54-1234-5678',
      customerName: 'নিবির হোসেন',
      status: 'pending',
      userId: demoUser.id,
    },
    {
      type: 'bkash_cashout',
      providerNameBn: 'বিকাশ',
      providerNameEn: 'bKash',
      amount: 10000,
      fee: 37.50,
      customerAccount: '01654321098',
      customerName: 'সাইফুল ইসলাম',
      status: 'pending',
    },
    {
      type: 'nagad_cashout',
      providerNameBn: 'নগদ',
      providerNameEn: 'Nagad',
      amount: 7500,
      fee: 25.00,
      customerAccount: '01911223344',
      customerName: 'জাহিদ হোসেন',
      status: 'completed',
    },
  ];

  for (const bill of billPaymentsData) {
    await db.billPayment.create({ data: bill });
  }

  console.log(`✅ ${billPaymentsData.length} bill payment demo records created.`);

  // ============================================================
  // Final Summary
  // ============================================================
  console.log('\n🎉 Database seeding completed!');
  console.log(`  📂 ${categoriesData.length} categories`);
  console.log(`  🏷️ ${brandsData.length} brands`);
  console.log(`  🛒 ${productCount} products`);
  console.log(`  👤 1 admin user`);
  console.log(`  ⭐ ${reviewsData.length} reviews`);
  console.log(`  🎫 ${couponsData.length} coupons`);
  console.log(`  💳 ${billPaymentsData.length} bill payments`);
  console.log('\n  Admin: phone=01700000000, password=demo123456');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

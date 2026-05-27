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
  await db.product.deleteMany();
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
  // Step 3: Create Products (60+)
  // ============================================================
  console.log('🛒 Creating products...');

  const productsData = [
    // ─── শাকসবজি (Vegetables) ─────────────────────────────
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
      nameBn: 'পেঁপে', nameEn: 'Papaya', slug: 'papaya-vegetable',
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

    // ─── ফলমূল (Fruits) ─────────────────────────────
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

    // ─── মাছ ও মাংস (Fish & Meat) ─────────────────────────────
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

    // ─── চাল ও ডাল (Rice & Lentils) ─────────────────────────────
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

    // ─── মসলা ও তেল (Spices & Oil) ─────────────────────────────
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

    // ─── দুগ্ধ ও ডিম (Dairy & Eggs) ─────────────────────────────
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

    // ─── বেকারি (Bakery) ─────────────────────────────
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

    // ─── পানীয় (Beverages) ─────────────────────────────
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

    // ─── স্ন্যাকস (Snacks) ─────────────────────────────
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

    // ─── পরিষ্কার (Household) ─────────────────────────────
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

    // ─── ব্যক্তিগত যত্ন (Personal Care) ─────────────────────────────
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

    // ─── ফ্রোজেন (Frozen) ─────────────────────────────
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

    // ─── Extra products to reach 60+ ─────────────────────────────
    // More vegetables
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
    // More fruits
    {
      nameBn: 'কলা', nameEn: 'Banana', slug: 'banana',
      descriptionBn: 'পাকা সবরি কলা, পুষ্টিকর ফল', descriptionEn: 'Ripe sabri banana, nutritious fruit',
      price: 50, originalPrice: 60, unit: 'ডজন', stock: 250, images: '["🍌"]',
      categoryId: categories['fruits'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 17, rating: 4.4, reviewCount: 88,
    },
    // More fish & meat
    {
      nameBn: 'গরুর মাংস', nameEn: 'Beef', slug: 'beef',
      descriptionBn: 'তাজা গরুর মাংস, কোরমার জন্য', descriptionEn: 'Fresh beef, great for korma',
      price: 650, originalPrice: 700, unit: 'কেজি', stock: 50, images: '["🥩"]',
      categoryId: categories['fish-meat'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 7, rating: 4.4, reviewCount: 76,
    },
    // More rice & lentils
    {
      nameBn: 'নাজিরশাইল চাল', nameEn: 'Nazirshail Rice', slug: 'nazirshail-rice',
      descriptionBn: 'নাজিরশাইল চাল, খিচুড়ির জন্য উৎকৃষ্ট', descriptionEn: 'Nazirshail rice, excellent for khichuri',
      price: 75, originalPrice: 82, unit: 'কেজি', stock: 350, images: '["🌾"]',
      categoryId: categories['rice-lentils'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 9, rating: 4.3, reviewCount: 102,
    },
    // More dairy
    {
      nameBn: 'পনির', nameEn: 'Paneer', slug: 'paneer',
      descriptionBn: 'তাজা পনির, সালাদ ও তরকারিতে', descriptionEn: 'Fresh paneer, for salad and curry',
      price: 200, originalPrice: 230, unit: '২৫০ গ্রাম', stock: 80, images: '["🧀"]',
      categoryId: categories['dairy-eggs'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 13, rating: 4.5, reviewCount: 56,
    },
    // More spices
    {
      nameBn: 'লবণ', nameEn: 'Salt', slug: 'salt',
      descriptionBn: 'আয়োডিনযুক্ত লবণ', descriptionEn: 'Iodized salt',
      price: 30, originalPrice: 35, unit: 'কেজি', stock: 500, images: '["🧂"]',
      categoryId: categories['spices-oil'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 14, rating: 4.1, reviewCount: 89,
    },
    // More bakery
    {
      nameBn: 'সমুচা', nameEn: 'Samosa', slug: 'samosa',
      descriptionBn: 'তাজা আলু সমুচা, ইফতারের জন্য', descriptionEn: 'Fresh potato samosa, for iftar',
      price: 15, originalPrice: 20, unit: 'পিস', stock: 300, images: '["🔺"]',
      categoryId: categories['bakery'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 25, rating: 4.3, reviewCount: 67,
    },
    // More beverages
    {
      nameBn: 'লাচ্ছি', nameEn: 'Lassi', slug: 'lassi',
      descriptionBn: 'মিষ্টি লাচ্ছি, দই থেকে তৈরি', descriptionEn: 'Sweet lassi, made from yogurt',
      price: 40, originalPrice: 50, unit: 'গ্লাস', stock: 100, images: '["🥛"]',
      categoryId: categories['beverages'], isOrganic: false, isFeatured: false, isTrending: false,
      discount: 20, rating: 4.5, reviewCount: 78,
    },
  ];

  let productCount = 0;
  for (const product of productsData) {
    await db.product.create({ data: product });
    productCount++;
  }

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
      address: 'বনানী, ঢাকা',
      area: 'বনানী',
      city: 'ঢাকা',
      loyaltyPoints: 500,
    },
  });

  console.log(`✅ Demo user created: ${demoUser.name} (${demoUser.phone})`);

  // ============================================================
  // Step 5: Create Reviews
  // ============================================================
  console.log('⭐ Creating demo reviews...');

  // Get some popular products for reviews
  const hilsa = await db.product.findUnique({ where: { slug: 'hilsa-fish' } });
  const mishtiDoi = await db.product.findUnique({ where: { slug: 'sweet-yogurt' } });
  const basmati = await db.product.findUnique({ where: { slug: 'basmati-rice' } });
  const mustardOil = await db.product.findUnique({ where: { slug: 'mustard-oil' } });

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
      expiresAt: new Date('2026-06-30'),
    },
  ];

  for (const coupon of couponsData) {
    await db.coupon.create({ data: coupon });
    console.log(`  ✓ ${coupon.code} - ${coupon.discount}${coupon.discountType === 'percentage' ? '% off' : '৳ off'}`);
  }

  console.log(`✅ ${couponsData.length} coupons created.`);

  // ============================================================
  // Done!
  // ============================================================
  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   📂 Categories: ${categoriesData.length}`);
  console.log(`   🛒 Products:   ${productCount}`);
  console.log(`   👤 Users:      1`);
  console.log(`   ⭐ Reviews:    ${reviewsData.length}`);
  console.log(`   🎫 Coupons:    ${couponsData.length}`);
  console.log('');

  await db.$disconnect();
}

main()
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await db.$disconnect();
    process.exit(1);
  });

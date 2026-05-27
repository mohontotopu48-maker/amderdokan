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
  // Step 3: Create Products (150+)
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
  // Final Summary
  // ============================================================
  console.log('\n🎉 Database seeding completed!');
  console.log(`  📂 ${categoriesData.length} categories`);
  console.log(`  🛒 ${productCount} products`);
  console.log(`  👤 1 admin user`);
  console.log(`  ⭐ ${reviewsData.length} reviews`);
  console.log(`  🎫 ${couponsData.length} coupons`);
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

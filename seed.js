const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://shiple_nazafa1:shiple_nazafa1%40@cluster0.l5mdvyo.mongodb.net/alferoz?retryWrites=true&w=majority";

// Define Schemas again for script use
const ServiceSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  icon: { type: String, default: 'Sparkles' },
  sort_order: Number,
  active: Boolean,
});

const AdminUserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password_hash: String,
});

const SettingsSchema = new mongoose.Schema({
  id: Number,
  site_name: String,
  site_description: String,
  meta_title: String,
  meta_description: String,
  footer_copy: String,
});

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  // Clear existing
  await Service.deleteMany({});
  await AdminUser.deleteMany({});
  await Settings.deleteMany({});

  // 1. Services
  const services = [
    { title: 'تنظيف منازل', description: 'نعتني بأدق تفاصيل منزلك باستخدام أحدث المعدات والمواد الآمنة عالمياً.', image: '/images/home-cleaning.png', active: true, sort_order: 1 },
    { title: 'تنظيف شركات', description: 'بيئة عمل نظيفة ومحفزة للإنتاجية مع خدماتنا المتخصصة للقطاع التجاري.', image: '/images/office-cleaning.png', active: true, sort_order: 2 },
    { title: 'تنظيف بعد التشطيب', description: 'إزالة كاملة لآثار البناء والطلاء وتجهيز المنشأة للسكن الفوري.', image: '/images/transformation.png', active: true, sort_order: 3 },
    { title: 'تنظيف كنب', description: 'تقنيات تنظيف بالبخار تزيل أصعب البقع وتحافظ على جودة الأقمشة.', image: '/images/equipment.png', active: true, sort_order: 4 },
    { title: 'مكافحة الحشرات', description: 'خدمة مكافحة الحشرات باستخدام مواد آمنة وفعالة للقضاء على جميع أنواع الحشرات.', image: '/images/equipment.png', active: true, sort_order: 5 },
  ];
  await Service.insertMany(services);
  console.log('Seeded services.');

  // 2. Admin
  const password_hash = await bcrypt.hash('admin123', 10);
  await AdminUser.create({
    username: 'admin',
    email: 'admin@alferoz.sa',
    password_hash
  });
  console.log('Seeded admin user.');

  // 3. Settings
  await Settings.create({
    id: 1,
    site_name: 'شركة الفيروز لخدمات النظافة',
    site_description: 'نقدم أفضل خدمات التنظيف والتعقيم في المملكة العربية السعودية.',
    meta_title: 'الفيروز لخدمات النظافة | أفضل شركة تنظيف في السعودية',
    meta_description: 'شركة الفيروز لخدمات النظافة - خدمات تنظيف منازل، شركات، فلل، وتعقيم.',
    footer_copy: 'شركة الفيروز لخدمات النظافة. جميع الحقوق محفوظة.',
  });
  console.log('Seeded site settings.');

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

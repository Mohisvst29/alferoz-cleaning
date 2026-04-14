import mongoose, { Schema, model, models } from 'mongoose';

// 1. Service Schema
const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  icon: { type: String, default: 'Sparkles' },
  sort_order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

// 2. Booking Schema
const BookingSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, default: 'الرياض' },
  service_type: { type: String, required: true },
  booking_date: { type: Date, required: true },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
});

// 3. Site Settings Schema
const SettingsSchema = new Schema({
  id: { type: Number, default: 1, unique: true },
  siteName: String,
  logo: String,
  logoSize: { type: Number, default: 120 },
  favicon: String,
  primaryColor: { type: String, default: '#0e7490' },
  secondaryColor: { type: String, default: '#0891b2' },
  bgColor: { type: String, default: '#030b14' },
  fontFamily: { type: String, default: 'cairo' },
  phone: String,
  email: String,
  footerText: String,
  heroTitle: String,
  heroDescription: String,
  heroImage: String,
  heroImage2: String,
  heroImage3: String,
  heroVideo: String,
  // Section images
  aboutImage: String,
  whyUsImage: String,
  ctaImage: String,
  teamImage1: String,
  teamImage2: String,
  teamImage3: String,
  updated_at: { type: Date, default: Date.now },
}, { strict: false }); // strict:false allows saving any field not in schema too

// 4. Testimonial Schema
const TestimonialSchema = new Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, default: 5 },
  city: { type: String, default: 'الرياض' },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

// 5. Contact Schema
const ContactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

// 6. SEO Schema
const SEOSchema = new Schema({
  id: { type: Number, default: 1, unique: true },
  metaTitle: String,
  metaDescription: String,
  keywords: String,
  ogTitle: String,
  ogDescription: String,
  ogImage: String,
  favicon: String,
  updated_at: { type: Date, default: Date.now },
});

// 7. Blog Schema
const ArticleSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  image: { type: String },
  author: { type: String, default: 'Admin' },
  publish_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
});

// 8. Review Schema
const ReviewSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 5 },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

// 9. Media Schema
const MediaSchema = new Schema({
  url: { type: String, required: true },
  name: { type: String },
  created_at: { type: Date, default: Date.now },
});

// 10. Admin User Schema
const AdminUserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

// Export Models
export const Service = models.Service || model('Service', ServiceSchema);
export const Booking = models.Booking || model('Booking', BookingSchema);
export const Settings = models.Settings || model('Settings', SettingsSchema);
export const Testimonial = models.Testimonial || model('Testimonial', TestimonialSchema);
export const Contact = models.Contact || model('Contact', ContactSchema);
export const SEO = models.SEO || model('SEO', SEOSchema);
export const Article = models.Article || model('Article', ArticleSchema);
export const Review = models.Review || model('Review', ReviewSchema);
export const Media = models.Media || model('Media', MediaSchema);
export const AdminUser = models.AdminUser || model('AdminUser', AdminUserSchema);

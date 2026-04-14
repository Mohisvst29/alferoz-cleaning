/*
 * Unified Database Layer - MongoDB Implementation
 */

import dbConnect from './mongodb';
import { 
  Service, Booking, Settings, AdminUser, Testimonial, 
  Contact, SEO, Article, Review, Media 
} from './models';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  const sanitized = JSON.parse(JSON.stringify(obj));
  if (obj._id) sanitized.id = obj._id.toString();
  delete sanitized._id;
  delete sanitized.__v;
  return sanitized;
}

export function getDefaultSettings(): any {
  return {
    id: 1,
    siteName: 'Al Feroz Cleaning',
    phone: '966562185880',
    email: 'info@alferoz.sa',
    primaryColor: '#0ea5e9',
    secondaryColor: '#06b6d4',
    logo: '',
    logoSize: 120,
    favicon: '',
    fontFamily: 'cairo',
    heroTitle: 'شركة الفيروز لخدمات النظافة في السعودية',
    heroDescription: 'خدمات تنظيف احترافية بجودة عالية',
    bgColor: '#030b14',
    footerText: 'جميع الحقوق محفوظة.',
    heroImage: '/images/luxury-house-cleaning.png',
    heroImage2: '',
    heroImage3: '',
    heroVideo: '',
    aboutImage: '',
    whyUsImage: '',
    ctaImage: '',
    teamImage1: '',
    teamImage2: '',
    teamImage3: '',
    updated_at: new Date().toISOString(),
  };
}

export const db = {
  // ── Services ─────────────────────────────────
  services: {
    async getAll(): Promise<any[]> {
      await dbConnect();
      const items = await Service.find().sort({ sort_order: 1 });
      return items.map(toPlain);
    },
    async getActive(): Promise<any[]> {
      await dbConnect();
      const items = await Service.find({ active: true }).sort({ sort_order: 1 });
      return items.map(toPlain);
    },
    async create(data: any): Promise<any> {
      await dbConnect();
      const newItem = await Service.create(data);
      return toPlain(newItem);
    },
    async update(id: string, data: any): Promise<any> {
      await dbConnect();
      const updated = await Service.findByIdAndUpdate(id, data, { new: true });
      return toPlain(updated);
    },
    async delete(id: string): Promise<boolean> {
      await dbConnect();
      const result = await Service.findByIdAndDelete(id);
      return !!result;
    },
    async count(): Promise<number> {
      await dbConnect();
      return await Service.countDocuments();
    }
  },

  // ── Bookings ─────────────────────────────────
  bookings: {
    async getAll(): Promise<any[]> {
      await dbConnect();
      const items = await Booking.find().sort({ created_at: -1 });
      return items.map(toPlain);
    },
    async create(data: any): Promise<any> {
      await dbConnect();
      const newItem = await Booking.create(data);
      return toPlain(newItem);
    },
    async update(id: string, data: any): Promise<any> {
      await dbConnect();
      const updated = await Booking.findByIdAndUpdate(id, data, { new: true });
      return toPlain(updated);
    },
    async count(): Promise<number> {
      await dbConnect();
      return await Booking.countDocuments();
    }
  },

  // ── Testimonials ─────────────────────────────
  testimonials: {
    async getAll(): Promise<any[]> {
      await dbConnect();
      const items = await Testimonial.find().sort({ created_at: -1 });
      return items.map(toPlain);
    },
    async getActive(): Promise<any[]> {
      await dbConnect();
      const items = await Testimonial.find({ active: true }).sort({ created_at: -1 });
      return items.map(toPlain);
    },
    async create(data: any): Promise<any> {
      await dbConnect();
      return toPlain(await Testimonial.create(data));
    },
    async update(id: string, data: any): Promise<any> {
      await dbConnect();
      return toPlain(await Testimonial.findByIdAndUpdate(id, data, { new: true }));
    },
    async delete(id: string): Promise<boolean> {
      await dbConnect();
      return !!(await Testimonial.findByIdAndDelete(id));
    }
  },

  // ── Articles (Blog) ──────────────────────────
  articles: {
    async getAll(): Promise<any[]> {
      await dbConnect();
      const items = await Article.find().sort({ publish_date: -1 });
      return items.map(toPlain);
    },
    async getPublished(): Promise<any[]> {
      await dbConnect();
      const items = await Article.find({ status: 'published' }).sort({ publish_date: -1 });
      return items.map(toPlain);
    },
    async getBySlug(slug: string): Promise<any | null> {
      await dbConnect();
      const item = await Article.findOne({ slug });
      return toPlain(item);
    },
    async create(data: any): Promise<any> {
      await dbConnect();
      const newItem = await Article.create(data);
      return toPlain(newItem);
    },
    async update(id: string, data: any): Promise<any> {
      await dbConnect();
      const updated = await Article.findByIdAndUpdate(id, data, { new: true });
      return toPlain(updated);
    },
    async delete(id: string): Promise<boolean> {
      await dbConnect();
      const result = await Article.findByIdAndDelete(id);
      return !!result;
    },
    async count(): Promise<number> {
      await dbConnect();
      return await Article.countDocuments();
    }
  },

  // ── Reviews ──────────────────────────────────
  reviews: {
    async getAll(): Promise<any[]> {
      await dbConnect();
      const items = await Review.find().sort({ created_at: -1 });
      return items.map(toPlain);
    },
    async getApproved(): Promise<any[]> {
      await dbConnect();
      const items = await Review.find({ approved: true }).sort({ created_at: -1 });
      return items.map(toPlain);
    },
    async create(data: any): Promise<any> {
      await dbConnect();
      return toPlain(await Review.create(data));
    },
    async update(id: string, data: any): Promise<any> {
      await dbConnect();
      return toPlain(await Review.findByIdAndUpdate(id, data, { new: true }));
    },
    async delete(id: string): Promise<boolean> {
      await dbConnect();
      return !!(await Review.findByIdAndDelete(id));
    },
    async count(): Promise<number> {
      await dbConnect();
      return await Review.countDocuments();
    }
  },

  // ── Media ────────────────────────────────────
  media: {
    async getAll(): Promise<any[]> {
      await dbConnect();
      const items = await Media.find().sort({ created_at: -1 });
      return items.map(toPlain);
    },
    async create(data: any): Promise<any> {
      await dbConnect();
      return toPlain(await Media.create(data));
    },
    async delete(id: string): Promise<boolean> {
      await dbConnect();
      return !!(await Media.findByIdAndDelete(id));
    }
  },

  // ── Site Settings ────────────────────────────
  settings: {
    async get(): Promise<any> {
      await dbConnect();
      let s = await Settings.findOne({ id: 1 });
      if (!s) s = await Settings.create(getDefaultSettings());
      return toPlain(s);
    },
    async update(updates: any): Promise<any> {
      await dbConnect();
      // Strip immutable fields
      const { _id, id, __v, ...cleanUpdates } = updates;
      const updated = await Settings.findOneAndUpdate(
        { id: 1 },
        { $set: { ...cleanUpdates, updated_at: new Date() } },
        { new: true, upsert: true, strict: false }
      );
      return toPlain(updated);
    },
    async reset(): Promise<any> {
      await dbConnect();
      await Settings.deleteOne({ id: 1 });
      return await this.get();
    }
  },

  // ── SEO Settings ─────────────────────────────
  seo: {
    async get(): Promise<any> {
      await dbConnect();
      let s = await SEO.findOne({ id: 1 });
      if (!s) s = await SEO.create({
        id: 1,
        metaTitle: "شركة الفيروز لخدمات النظافة في السعودية",
        metaDescription: "أفضل شركة تنظيف ومكافحة حشرات في السعودية",
        keywords: "شركة تنظيف, تنظيف منازل, مكافحة حشرات",
        ogTitle: "Al Feroz Cleaning",
        ogDescription: "Professional cleaning services in Saudi Arabia"
      });
      return toPlain(s);
    },
    async update(updates: any): Promise<any> {
      await dbConnect();
      delete updates._id;
      delete updates.id;
      const updated = await SEO.findOneAndUpdate(
        { id: 1 },
        { ...updates, updated_at: new Date() },
        { new: true, upsert: true }
      );
      return toPlain(updated);
    }
  },

  // ── Contacts ─────────────────────────────────
  contacts: {
    async count(): Promise<number> {
      await dbConnect();
      return await Contact.countDocuments();
    }
  },

  // ── Admin ────────────────────────────────────
  adminUsers: {
    async getAdmin(): Promise<any | null> {
      await dbConnect();
      const admin = await AdminUser.findOne({ username: 'admin' });
      return toPlain(admin);
    },
    async getByUsername(username: string): Promise<any | null> {
      await dbConnect();
      return toPlain(await AdminUser.findOne({ username }));
    },
    async create(data: any): Promise<any> {
      await dbConnect();
      return toPlain(await AdminUser.create(data));
    },
    async update(data: any): Promise<any> {
      await dbConnect();
      return toPlain(await AdminUser.findOneAndUpdate({ username: 'admin' }, data, { new: true }));
    }
  }
};

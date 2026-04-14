import HeroSection from '@/components/home/HeroSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import { db } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Ensure database is seeded
  await seedDatabase();

  const services = await db.services.getActive();
  const testimonials = await db.testimonials.getActive();

  return (
    <>
      <HeroSection />
      <ServicesPreview services={services} />
      <WhyChooseUs />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  );
}

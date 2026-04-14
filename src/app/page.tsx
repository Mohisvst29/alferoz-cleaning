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

  const testimonials = await db.testimonials.getActive();

  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <WhyChooseUs />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  );
}

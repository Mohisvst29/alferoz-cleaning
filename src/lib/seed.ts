import { db } from './db';
import { hashPassword } from './auth';

/**
 * Seeds the database with default data if collections are empty.
 * Called once on first API request.
 */
export async function seedDatabase(): Promise<{ seeded: boolean; message: string }> {
  let seededAny = false;

  // Seed admin user
  const existingAdmin = await db.adminUsers.getByUsername('admin');
  if (!existingAdmin) {
    const hash = await hashPassword('admin123'); // Password acts as "hashed password" placeholder physically
    await db.adminUsers.create({ username: 'admin', email: 'admin@alferoz.sa', password_hash: hash });
    seededAny = true;
  }

  // Seed services
  const services = await db.services.getAll();
  if (services.length === 0) {
    const defaultServices = [
      { title: 'تنظيف منازل', description: 'خدمة تنظيف شاملة للمنازل تشمل جميع الغرف والمطابخ والحمامات مع استخدام أفضل مواد التنظيف والتعقيم. نحرص على كل تفصيلة لنجعل منزلك يلمع نظافة.', icon: '🏠', image: '', sort_order: 1, active: true },
      { title: 'تنظيف شركات', description: 'خدمات تنظيف احترافية للمكاتب والشركات تضمن بيئة عمل نظيفة وصحية. نوفر خطط تنظيف مرنة تناسب جدول عملكم.', icon: '🏢', image: '', sort_order: 2, active: true },
      { title: 'تنظيف بعد التشطيب', description: 'تنظيف متخصص بعد أعمال البناء والتشطيب لإزالة الغبار والأوساخ والبقايا. نعيد لمكانك رونقه الأصلي بعد الأعمال الإنشائية.', icon: '🔨', image: '', sort_order: 3, active: true },
      { title: 'تنظيف كنب', description: 'تنظيف عميق للكنب والأثاث المنجد باستخدام تقنيات البخار والمواد الآمنة. نزيل البقع والروائح ونعيد لأثاثك مظهره الجديد.', icon: '🛋️', image: '', sort_order: 4, active: true },
      { title: 'تنظيف سجاد', description: 'غسيل وتنظيف السجاد بأحدث المعدات والتقنيات لإزالة الأوساخ العميقة والبقع. نحافظ على جودة نسيج سجادك مع ضمان نظافة تامة.', icon: '🧹', image: '', sort_order: 5, active: true },
      { title: 'تعقيم', description: 'خدمات تعقيم شاملة باستخدام مواد معتمدة وآمنة للقضاء على الجراثيم والفيروسات. نوفر بيئة صحية وآمنة لعائلتك وموظفيك.', icon: '🦠', image: '', sort_order: 6, active: true },
      { title: 'تنظيف فلل', description: 'خدمة تنظيف متكاملة للفلل تشمل جميع الطوابق والحدائق والمسابح. فريق متخصص بأحدث المعدات لتنظيف شامل يليق بفيلتك.', icon: '🏰', image: '', sort_order: 7, active: true },
    ];
    for (const s of defaultServices) {
      await db.services.create(s);
    }
    seededAny = true;
  }

  // Seed testimonials
  const testimonials = await db.testimonials.getAll();
  if (testimonials.length === 0) {
    const defaultTestimonials = [
      { name: 'أحمد محمد', text: 'خدمة ممتازة واحترافية عالية. تم تنظيف منزلي بشكل رائع وأنا سعيد جداً بالنتيجة. أنصح الجميع بخدمات الفيروز.', rating: 5, city: 'الرياض', active: true },
      { name: 'سارة العتيبي', text: 'من أفضل شركات التنظيف التي تعاملت معها. فريق محترف ومواعيد دقيقة وأسعار معقولة. شكراً لكم.', rating: 5, city: 'جدة', active: true },
      { name: 'فهد الدوسري', text: 'تعاملت مع شركة الفيروز لتنظيف فيلتي وكانت النتيجة أكثر من ممتازة. العمال محترفون والمواد المستخدمة عالية الجودة.', rating: 5, city: 'الدمام', active: true },
      { name: 'نورة القحطاني', text: 'خدمة تنظيف الكنب كانت رائعة. أصبح الكنب كأنه جديد. أشكر فريق الفيروز على الاحترافية والدقة.', rating: 4, city: 'المدينة المنورة', active: true },
    ];
    for (const t of defaultTestimonials) {
      await db.testimonials.create(t);
    }
    seededAny = true;
  }

  // Initialize settings
  await db.settings.get();
  await db.seo.get();

  return {
    seeded: seededAny,
    message: seededAny ? 'Database seeded with default data' : 'Database already has data',
  };
}

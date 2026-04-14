import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

// GET /api/seed - Seed database with default data
export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في تهيئة قاعدة البيانات', details: String(error) }, { status: 500 });
  }
}

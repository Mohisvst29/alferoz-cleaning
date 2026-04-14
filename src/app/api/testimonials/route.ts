import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// GET /api/testimonials - Public: get active testimonials
export async function GET() {
  try {
    const testimonials = await db.testimonials.getActive();
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'خطأ في جلب التقييمات' }, { status: 500 });
  }
}

// POST /api/testimonials - Admin: create testimonial
export async function POST(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const testimonial = await db.testimonials.create(body);
    return NextResponse.json(testimonial, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في إنشاء التقييم' }, { status: 500 });
  }
}

// PUT /api/testimonials - Admin: update testimonial
export async function PUT(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'معرّف التقييم مطلوب' }, { status: 400 });
    const testimonial = await db.testimonials.update(id, data);
    if (!testimonial) return NextResponse.json({ error: 'التقييم غير موجود' }, { status: 404 });
    return NextResponse.json(testimonial);
  } catch {
    return NextResponse.json({ error: 'خطأ في تحديث التقييم' }, { status: 500 });
  }
}

// DELETE /api/testimonials - Admin: delete testimonial
export async function DELETE(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرّف التقييم مطلوب' }, { status: 400 });
    await db.testimonials.delete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في حذف التقييم' }, { status: 500 });
  }
}

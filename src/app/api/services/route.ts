import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// GET /api/services - Public: get active services
export async function GET() {
  try {
    await dbConnect();
    const services = await db.services.getActive();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Services GET Error:', error);
    return NextResponse.json({ error: 'خطأ في جلب الخدمات' }, { status: 500 });
  }
}

// POST /api/services - Admin: create service
export async function POST(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const service = await db.services.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Services POST Error:', error);
    return NextResponse.json({ error: 'خطأ في إنشاء الخدمة' }, { status: 500 });
  }
}

// PUT /api/services - Admin: update service
export async function PUT(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'معرّف الخدمة مطلوب' }, { status: 400 });
    const service = await db.services.update(id, data);
    if (!service) return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
    return NextResponse.json(service);
  } catch (error) {
    console.error('Services PUT Error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث الخدمة' }, { status: 500 });
  }
}

// DELETE /api/services - Admin: delete service
export async function DELETE(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرّف الخدمة مطلوب' }, { status: 400 });
    const deleted = await db.services.delete(id);
    if (!deleted) return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Services DELETE Error:', error);
    return NextResponse.json({ error: 'خطأ في حذف الخدمة' }, { status: 500 });
  }
}

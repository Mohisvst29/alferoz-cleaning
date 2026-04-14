import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// GET /api/bookings - Admin: get all bookings
export async function GET(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    await dbConnect();
    const bookings = await db.bookings.getAll();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Bookings GET Error:', error);
    return NextResponse.json({ error: 'خطأ في جلب الحجوزات' }, { status: 500 });
  }
}

// POST /api/bookings - Public: create booking
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, phone, city, service_type, booking_date, notes } = body;

    if (!name || !phone || !city || !service_type || !booking_date) {
      return NextResponse.json({ error: 'جميع الحقول المطلوبة يجب ملؤها' }, { status: 400 });
    }

    const booking = await db.bookings.create({
      name,
      phone,
      city,
      service_type,
      booking_date,
      notes: notes || '',
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Bookings POST Error:', error);
    return NextResponse.json({ error: 'خطأ في إنشاء الحجز' }, { status: 500 });
  }
}

// PUT /api/bookings - Admin: update booking status
export async function PUT(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'معرّف الحجز مطلوب' }, { status: 400 });
    const booking = await db.bookings.update(id, data);
    if (!booking) return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 });
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Bookings PUT Error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث الحجز' }, { status: 500 });
  }
}

// DELETE /api/bookings - Admin: delete booking
export async function DELETE(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرّف الحجز مطلوب' }, { status: 400 });
    await db.bookings.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bookings DELETE Error:', error);
    return NextResponse.json({ error: 'خطأ في حذف الحجز' }, { status: 500 });
  }
}

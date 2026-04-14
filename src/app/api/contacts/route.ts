import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// GET /api/contacts - Admin: get all contacts
export async function GET(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const contacts = await db.contacts.getAll();
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: 'خطأ في جلب الرسائل' }, { status: 500 });
  }
}

// POST /api/contacts - Public: submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !message) {
      return NextResponse.json({ error: 'الاسم والرسالة مطلوبان' }, { status: 400 });
    }

    const contact = await db.contacts.create({
      name,
      email: email || '',
      phone: phone || '',
      message,
    });

    return NextResponse.json(contact, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في إرسال الرسالة' }, { status: 500 });
  }
}

// PUT /api/contacts - Admin: mark as read
export async function PUT(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'معرّف الرسالة مطلوب' }, { status: 400 });
    const contact = await db.contacts.update(id, data);
    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: 'خطأ في تحديث الرسالة' }, { status: 500 });
  }
}

// DELETE /api/contacts - Admin: delete contact
export async function DELETE(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرّف الرسالة مطلوب' }, { status: 400 });
    await db.contacts.delete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في حذف الرسالة' }, { status: 500 });
  }
}

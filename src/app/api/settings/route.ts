import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// GET /api/settings - Public: get site settings
export async function GET() {
  try {
    await dbConnect();
    const settings = await db.settings.get();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET Error:', error);
    return NextResponse.json({ error: 'خطأ في جلب الإعدادات' }, { status: 500 });
  }
}

// POST or PUT /api/settings - Admin: update site settings
export async function POST(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const settings = await db.settings.update(body);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings POST Error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث الإعدادات' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// GET /api/seo - Public
export async function GET() {
  try {
    await dbConnect();
    const seo = await db.seo.get();
    return NextResponse.json(seo);
  } catch (error) {
    console.error('SEO GET Error:', error);
    return NextResponse.json({ error: 'خطأ في جلب بيانات SEO' }, { status: 500 });
  }
}

// POST /api/seo - Admin
export async function POST(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const seo = await db.seo.update(body);
    return NextResponse.json(seo);
  } catch (error) {
    console.error('SEO POST Error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث بيانات SEO' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

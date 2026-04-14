import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    // Ensure database is seeded
    await seedDatabase();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const user = await db.adminUsers.getByUsername(username);
    if (!user) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    const token = generateToken(user.id, user.username);

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username },
    });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

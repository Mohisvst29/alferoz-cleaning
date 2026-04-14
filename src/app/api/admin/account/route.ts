import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const admin = await db.adminUsers.getAdmin();
    if (!admin) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({
      username: admin.username,
      email: admin.email,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { username, email, currentPassword, newPassword } = await request.json();

    // 1. Get current admin
    const admin = await db.adminUsers.getAdmin();
    if (!admin) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 2. Verify current password if changing sensitive stuff
    const isPassValid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isPassValid) return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });

    // 3. Prepare updates
    const updates: any = { username, email };
    if (newPassword && newPassword.length >= 8) {
      updates.password_hash = await bcrypt.hash(newPassword, 10);
    } else if (newPassword) {
      return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
    }

    // 4. Update
    await db.adminUsers.update(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

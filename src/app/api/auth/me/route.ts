import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  return NextResponse.json({ user });
}

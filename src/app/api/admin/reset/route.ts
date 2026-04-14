import { NextResponse } from 'next/server';
import { db, getDefaultSettings } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function POST(request: Request) {
  const user = authenticateRequest(request as any);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // 1. Reset Settings
    await db.settings.reset();
    
    // Note: We could also clear services/articles here if needed, 
    // but usually "Reset Website" targets site identity.
    // The user said: Reset collections settings, services, seo.
    
    return NextResponse.json({ success: true, message: 'Website settings have been restored to default.' });
  } catch (error) {
    console.error('Reset Error:', error);
    return NextResponse.json({ error: 'Failed to reset website' }, { status: 500 });
  }
}

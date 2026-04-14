import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // Case 1: JSON request (registering an existing URL, e.g. from Supabase)
    if (contentType.includes('application/json')) {
      const { url, name } = await request.json();
      if (url) {
        await db.media.create({ url, name: name || 'Uploaded File' });
        return NextResponse.json({ url });
      }
    }

    // Case 2: FormData request (Base64 fallback)
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Check if total size (with overhead) might exceed MongoDB limit
    if (buffer.length > 12 * 1024 * 1024) { // ~12MB raw buffer becomes ~16MB Base64
       return NextResponse.json({ error: 'File too large for database storage' }, { status: 413 });
    }

    const mimeType = file.type || 'image/png';
    const url = `data:${mimeType};base64,${buffer.toString('base64')}`;

    await db.media.create({
      url,
      name: file.name
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Upload Error:', error);
    // Handle specific Next.js/Vercel size errors if they appear here
    if (error.message?.includes('too large') || error.code === 'ENTITY_TOO_LARGE') {
      return NextResponse.json({ error: 'Payload too large. Use Supabase for files > 4MB.' }, { status: 413 });
    }
    return NextResponse.json({ error: 'Failed to upload file. ' + (error.message || '') }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Instead of saving to Vercel's read-only file system,
    // convert it to a Base64 string so it can be saved in MongoDB
    const mimeType = file.type || 'image/png';
    const url = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Also save to Media collection for the Media Library
    await db.media.create({
      url,
      name: file.name
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// GET /api/articles - Public (published) or Private (all)
export async function GET(request: NextRequest) {
  const admin = authenticateRequest(request);
  try {
    await dbConnect();
    const articles = admin ? await db.articles.getAll() : await db.articles.getPublished();
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST /api/articles - Admin: create
export async function POST(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const body = await request.json();
    const article = await db.articles.create(body);
    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error('Article POST Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create article' }, { status: 500 });
  }
}

// PUT /api/articles - Admin: update
export async function PUT(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const article = await db.articles.update(id, data);
    if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Article PUT Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update article' }, { status: 500 });
  }
}

// DELETE /api/articles?id=... - Admin: delete
export async function DELETE(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const deleted = await db.articles.delete(id);
    if (!deleted) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Article DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete article' }, { status: 500 });
  }
}

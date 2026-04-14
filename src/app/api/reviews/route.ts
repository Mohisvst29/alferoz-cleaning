import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// GET /api/reviews - Public (approved) or Private (all)
export async function GET(request: NextRequest) {
  const admin = authenticateRequest(request);
  try {
    const reviews = admin ? await db.reviews.getAll() : await db.reviews.getApproved();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews - Public (submit)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const review = await db.reviews.create(body);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

// PUT /api/reviews - Admin (approve/hide)
export async function PUT(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, ...data } = await request.json();
    const updated = await db.reviews.update(id, data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

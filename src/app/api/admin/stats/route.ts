import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const user = authenticateRequest(request as any);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [bookings, services, reviews, articles] = await Promise.all([
      db.bookings.count(),
      db.services.count(),
      db.reviews.count(),
      db.articles.count()
    ]);

    return NextResponse.json({
      total_bookings: bookings,
      total_services: services,
      total_reviews: reviews,
      total_articles: articles
    });
  } catch (error) {
    console.error('Stats Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

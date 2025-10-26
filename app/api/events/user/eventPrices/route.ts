import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Fetch event category prices; optional query param ?event_id=123 to filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('event_id');

    // join with categories table to get canonical category_name
    let query = db('event_category_prices')
      .leftJoin('categories', 'event_category_prices.category_id', 'categories.id')
      .select(
        'event_category_prices.id',
        'event_category_prices.event_id',
        'event_category_prices.category_id',
        // prefer the name from categories table; fallback to event_category_prices.category_name if categories.category_name is null
        db.raw('COALESCE(categories.category_name, event_category_prices.category_name) as category_name'),
        'event_category_prices.price',
        'event_category_prices.earlybird_registration_price',
        'event_category_prices.spot_registration_price'
      )
      .orderBy('event_category_prices.id', 'asc');

    if (eventId) {
      query = query.where('event_id', eventId);
    }

    const rows = await query;
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching event category prices:', error);
    return NextResponse.json({ error: 'Failed to fetch event category prices', details: error?.message }, { status: 500 });
  }
}

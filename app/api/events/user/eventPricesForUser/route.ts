import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET /api/events/user/eventPricesForUser?user_id=123&event_ids=1,2,3
// Returns computed price per event for the given user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const eventIdsParam = searchParams.get('event_ids');

    if (!userId) {
      return NextResponse.json({ error: 'user_id query parameter is required' }, { status: 400 });
    }

    const eventIds = eventIdsParam ? eventIdsParam.split(',').map((v) => Number(v)).filter(Boolean) : undefined;

    // Fetch user details (category) from user_details table
    const userDetails = await db('user_details').where('user_id', userId).first();

    // Fetch event base prices and earlybird dates
    let eventsQuery = db('events_data').select('id', 'event_price', 'earlybird_registration_date');
    if (Array.isArray(eventIds) && eventIds.length > 0) eventsQuery = eventsQuery.whereIn('id', eventIds);
    const events = await eventsQuery;

    // Fetch category price rows and the canonical category name from categories table
    let pricesQuery = db('event_category_prices')
      .leftJoin('categories', 'event_category_prices.category_id', 'categories.id')
      .select(
        'event_category_prices.id',
        'event_category_prices.event_id',
        'event_category_prices.category_id',
        db.raw('COALESCE(categories.category_name, event_category_prices.category_name) as category_name'),
        'event_category_prices.price',
        'event_category_prices.earlybird_registration_price',
        'event_category_prices.spot_registration_price'
      );
    if (Array.isArray(eventIds) && eventIds.length > 0) pricesQuery = pricesQuery.whereIn('event_category_prices.event_id', eventIds);
    const priceRows = await pricesQuery;

    // Group price rows by event_id
    const priceMap: Record<number, any[]> = {};
    for (const r of priceRows) {
      const eid = Number(r.event_id);
      if (!priceMap[eid]) priceMap[eid] = [];
      // normalize category_name to string
      r.category_name = r.category_name != null ? String(r.category_name) : null;
      priceMap[eid].push(r);
    }

    const now = Date.now();

    const results = events.map((ev: any) => {
      const eid = Number(ev.id);
      const basePrice = Number(ev.event_price) || 0;
      const ebDate = ev.earlybird_registration_date ? new Date(ev.earlybird_registration_date).getTime() : null;
      const rows = priceMap[eid] || [];

      let computedPrice = basePrice;
      let reason = 'base';
      let matchedCategoryId: number | null = null;
      let matchedCategoryName: string | null = null;

      if (userDetails) {
        const userCatText = userDetails.category != null ? String(userDetails.category).toLowerCase() : null;
        const userCatId = (userDetails.category_id != null) ? Number(userDetails.category_id) : null;

  // Find best matching price row: prefer category_id match, then name match
  let matched: any = null;
        if (userCatId) {
          matched = rows.find((r) => Number(r.category_id) === userCatId);
        }
        if (!matched && userCatText) {
          matched = rows.find((r) => r.category_name && String(r.category_name).toLowerCase() === userCatText);
        }

        if (matched) {
          matchedCategoryId = matched.category_id ? Number(matched.category_id) : null;
          matchedCategoryName = matched.category_name ?? null;

          // earlybird price if applicable and available
          if (ebDate && now < ebDate && matched.earlybird_registration_price) {
            const p = Number(matched.earlybird_registration_price);
            if (!isNaN(p)) {
              computedPrice = p;
              reason = 'earlybird';
            }
          }

          // fallback to category price
          if (reason === 'base' && matched.price != null) {
            const p = Number(matched.price);
            if (!isNaN(p)) {
              computedPrice = p;
              reason = 'category';
            }
          }
        }
      }

      // final fallback remains basePrice
      return {
        event_id: eid,
        computed_price: computedPrice,
        reason,
        matchedCategoryId,
        matchedCategoryName,
        base_price: basePrice,
        earlybird_registration_date: ev.earlybird_registration_date || null,
      };
    });

    return NextResponse.json({ data: results });
  } catch (error: any) {
    console.error('Error computing user-specific event prices:', error);
    return NextResponse.json({ error: 'Failed to compute prices', details: error?.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // If query param "list=events" is passed → return all events for dropdown
    const listType = searchParams.get('list');

    if (listType === 'events') {
      const events = await db('events_data')
        .select('id', 'event_title')
        .orderBy('event_start_date', 'desc');

      return NextResponse.json({
        success: true,
        data: events,
      });
    }

    // Otherwise — default enrolled events list (with pagination + filters)
    const user = searchParams.get('user') || '';
    const event = searchParams.get('event') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const offset = (page - 1) * limit;

    // Base query
    let baseQuery = db('payment_history as p')
      .join('users as u', 'p.user_id', 'u.id')
      .join('events_data as e', 'p.event_id', 'e.id')
      .where('p.payment_status', 'SUCCESS');

    // Filters
    if (user) baseQuery = baseQuery.andWhereILike('u.name', `%${user}%`);
    if (event) {
      if (!isNaN(Number(event))) {
        baseQuery = baseQuery.andWhere('e.id', Number(event));
      } else {
        baseQuery = baseQuery.andWhereILike('e.event_title', `%${event}%`);
      }
    }

    // Total count for pagination
    const [{ count }] = await baseQuery.clone().count('* as count');

    // Paginated results
    const results = await baseQuery
      .select(
        'u.id as user_id',  
        'u.name as user_name',
        'e.slug as event_slug',  
        'e.event_title as event_name',
        'e.id as event_id',
        'e.event_start_date as event_date',
        'p.payment_status'
      )
      .orderBy('p.created_date', 'desc')
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: { total: parseInt(count, 10) || 0, page, limit },
    });

  } catch (error) {
    console.error("Error fetching enrolled events:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enrolled events", error },
      { status: 500 }
    );
  }
}

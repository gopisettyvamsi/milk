import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// ✅ GET /api/admin/payment-history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user') || '';
    const event = searchParams.get('event') || '';
    const status = searchParams.get('status') || '';
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const listType = searchParams.get('list');

    // ✅ 1️⃣ If listing events for dropdown
    if (listType === 'events') {
      const events = await db('events_data').select('id', 'event_title');
      return NextResponse.json({ success: true, data: events });
    }

    const offset = (page - 1) * limit;

    // ✅ 2️⃣ Base query for payment data
    let baseQuery = db('payment_history as p')
      .join('users as u', 'p.user_id', 'u.id')
      .leftJoin('events_data as e', 'p.event_id', 'e.id')
      .select(
        'p.payment_id',
        'u.id as user_id',
        'u.name as user_name',
        'e.id as event_id',
        'e.event_title as event_name',
        'e.event_start_date as event_date',
        'p.order_id',
        'p.transaction_id',
        'p.amount',
        'p.payment_status',
        'p.created_date'
      )
      .orderBy('p.created_date', 'desc');

    // ✅ 3️⃣ Apply filters
    if (user.trim()) baseQuery = baseQuery.whereILike('u.name', `%${user}%`);
if (event.trim()) {
  // Match by event_id instead of title
  baseQuery = baseQuery.where('e.id', event);
}

if (status.trim()) {
  baseQuery = baseQuery.where('p.payment_status', status);
}

    if (fromDate && toDate) baseQuery = baseQuery.whereBetween('p.created_date', [fromDate, toDate]);
    else if (fromDate) baseQuery = baseQuery.where('p.created_date', '>=', fromDate);
    else if (toDate) baseQuery = baseQuery.where('p.created_date', '<=', toDate);

    // ✅ 4️⃣ Count total rows
    const totalCountRow = await baseQuery
      .clone()
      .clearSelect()
      .clearOrder()
      .count({ total: 'p.payment_id' })
      .first();
    const total = Number(totalCountRow?.total || 0);

    // ✅ 5️⃣ Paginate and fetch
    const results = await baseQuery.limit(limit).offset(offset);

    // ✅ 6️⃣ Compute totals
    const totalRevenueRow = await db('payment_history')
      .where('payment_status', 'SUCCESS')
      .sum({ revenue: 'amount' })
      .first();
    const totalRevenue = Number(totalRevenueRow?.revenue || 0);

    const pageRevenue = results
      .filter((r) => r.payment_status === 'SUCCESS')
      .reduce((acc, r) => acc + Number(r.amount), 0);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: { page, limit, total },
      totals: { totalRevenue, pageRevenue },
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch payment history',
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

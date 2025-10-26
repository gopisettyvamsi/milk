import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import db from '@/lib/db';
import { authOptions } from '@/app/auth';

export async function GET(req: NextRequest) {

            const searchParams = req.nextUrl.searchParams;
      const countOnly = searchParams.get("count"); 
        if (countOnly === "true") {
      const [{ total }] = await db("payment_history").count("* as total");
      return NextResponse.json({ success: true, count: Number(total) });
    }
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Get user id
    const user = await db('users')
      .select('id')
      .where('email', userEmail)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all events user is enrolled in (SUCCESS payments)
    const enrolledEvents = await db('payment_history as ph')
      .join('events_data as e', 'ph.event_id', 'e.id')
      .where({
        'ph.user_id': user.id,
        'ph.payment_status': 'SUCCESS'
      })
      .select(
        'e.id',
        'e.slug',
        'e.event_title as title',
        'e.event_category as category',
        'e.event_start_date as date',
        'e.event_end_date',
        'e.event_start_time as start_time',
        'e.event_end_time as end_time',
        'e.event_location as location',
        'e.event_price as price',
        'e.event_image as image'
      )
      .orderBy('ph.created_date', 'desc');

    return NextResponse.json(enrolledEvents);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch enrolled events' }, { status: 500 });
  }
}

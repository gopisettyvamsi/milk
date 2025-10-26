import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import db from "@/lib/db";
import { authOptions } from '@/app/auth';

// GET - Fetch single event by slug + category-wise prices including earlybird & spot prices
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const userEmail = session?.user?.email || null;
    console.log('=== DEBUG START ===');
    console.log('Requested slug:', slug);
    console.log('User email:', userEmail);

    // Fetch event details with latest updated fields
    const event = await db('events_data')
      .select(
        'id',
        'event_title',
        'slug',
        'event_description',
        'event_image',
        'event_location',
        'event_category',
        'event_start_date',
        'event_end_date',
        'event_start_time',
        'event_end_time',
        'created_at',
        'updated_at',
        'event_price',
        'earlybird_registration_date'
      )
      .where('slug', slug)
      .first();

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    console.log('Event found:', event.event_title, 'Event ID:', event.id);

    // ✅ Fetch category-based prices from event_category_prices joined with categories
    const categoryPrices = await db('event_category_prices as ecp')
      .join('categories as c', 'ecp.category_id', 'c.id')
      .select(
        'ecp.category_id',
        'c.category_name',
        'ecp.price',
        'ecp.earlybird_registration_price',
        'ecp.spot_registration_price'
      )
      .where('ecp.event_id', event.id);

    console.log('Category-based pricing:', categoryPrices);

    // Optional: enrollment logic if userEmail is available
    let paymentRecord = null;
    if (userEmail) {
      const user = await db('users')
        .where('email', userEmail)
        .select('id', 'email')
        .first();

      if (user) {
        paymentRecord = await db('payment_history')
          .where({
            user_id: user.id,
            event_id: event.id,
            payment_status: 'SUCCESS'
          })
          .select('payment_id', 'payment_status', 'transaction_id', 'amount')
          .first();
      }
    }

    const isEnrolled = !!paymentRecord;

    const responseData = {
      ...event,
      category_prices: categoryPrices, // now includes all price fields
      isEnrolled,
    };

    console.log('User enrollment status:', isEnrolled ? 'Enrolled ✅' : 'Not enrolled ❌');
    console.log('=== DEBUG END ===');

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('💥 Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

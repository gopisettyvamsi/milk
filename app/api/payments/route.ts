// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const data = await db('payment_history')
      .join('events_data', 'payment_history.event_id', '=', 'events_data.id')
      .join('users', 'payment_history.user_id', '=', 'users.id')
      .select(
        'payment_history.payment_id',
        'payment_history.user_id',
        'payment_history.event_id',
        'payment_history.order_id',
        'payment_history.transaction_id',
        'payment_history.payment_status',
        'payment_history.amount',
        'payment_history.created_date',
        'events_data.event_title',
        'users.name as user_name',
        'users.email as user_email'
      ) 
      .orderBy('payment_history.created_date', 'desc')
      .orderBy('payment_history.payment_id', 'desc'); 
    
    return NextResponse.json(data); 
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json({ error: 'Error fetching payment history' }, { status: 500 });
  }
}

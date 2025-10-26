import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET - Fetch all events
export async function GET() {
    try {
        const events = await db('events_data')
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
                'earlybird_registration_date',
                'created_at',
                'event_price'
            ) .orderBy("id", "desc");

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}



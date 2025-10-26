import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET - Fetch all events
export async function GET(req:NextRequest) {
      const searchParams = req.nextUrl.searchParams;
      const countOnly = searchParams.get("count"); 
    try {
    if (countOnly === "true") {
      const [{ total }] = await db("events_data").count("* as total");
      return NextResponse.json({ success: true, count: Number(total) });
    }
        const events = await db('events_data')
            .select(
                'id',
                'event_title',
                'event_description',
                'event_image',
                'event_location',
                'event_category',
                'event_start_date',
                'event_end_date',
                'event_start_time',   
                'event_end_time',    
                'created_at'
            )  .orderBy("id", "desc"); 

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Entered POST request to /api/events');
        const formData = await request.formData();
        const event_title = formData.get('event_title') as string;
        const event_description = formData.get('event_description') as string;
        const event_location = formData.get('event_location') as string;
        const event_start_date = formData.get('event_start_date') as string;
        const event_end_date = formData.get('event_end_date') as string;
        const event_price = formData.get('event_price') as unknown as number;
        const slug = formData.get('slug') as string;
  
        const event_start_time = formData.get('event_start_time') as string;
        const event_end_time = formData.get('event_end_time') as string;

        const event_category = formData.get('event_category') as string;
        const imageFile = formData.get('image') as File | null;

        // Validation
        // if (!event_title || !event_description || !event_location || !event_category) {
        //     return NextResponse.json(
        //         { error: 'Missing required fields: event_title, event_description, event_location, and event_category are required' },
        //         { status: 400 }
        //     );
        // }

        let imagePath = '';

        // Handle image upload
        if (imageFile && imageFile.size > 0) {
            if (!imageFile.type.startsWith('image/')) {
                return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
            }

            if (imageFile.size > 5 * 1024 * 1024) {
                return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
            }

            try {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = path.extname(imageFile.name);
                const filename = `event-${uniqueSuffix}${ext}`;
                const uploadDir = path.join(process.cwd(), 'public', 'event_images');
                await mkdir(uploadDir, { recursive: true });
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const filePath = path.join(uploadDir, filename);
                await writeFile(filePath, buffer);
                imagePath = `/event_images/${filename}`;
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
            }
        }

        // Create new event
        const newEvent = {
            event_title: event_title.trim(),
            event_description: event_description,
            event_image: imagePath,
            event_location: event_location.trim(),
            event_start_date: event_start_date || null,
            event_end_date: event_end_date || null,
            event_start_time: event_start_time || null,  
            event_end_time: event_end_time || null,
            event_category: event_category.trim(),
            created_at: new Date().toISOString().split('T')[0],
            slug: slug,
            event_price: event_price || 0,


        };

const [insertedId] = await db('events_data').insert(newEvent);

const createdEvent = await db('events_data')
    .select(
        'id',
        'event_title',
        'event_description',
        'event_image',
        'event_location',
        'event_category',
        'event_start_date',
        'event_end_date',
        'event_start_time',
        'event_end_time',
        'created_at',
        'slug',
        'event_price',
    )
    .where('id', insertedId)  
    .first();


        return NextResponse.json(createdEvent, { status: 201 });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}

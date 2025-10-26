import { NextRequest, NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";
import db from "@/lib/db"; // ensure you have prisma or your DB client configured

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const eventtitle = formData.get("eventtitle") as string;
    const eventimage = formData.get("eventimage") as string; // uploaded or stored path
    const eventlocation = formData.get("eventlocation") as string;
    const eventcategory = formData.get("eventcategory") as string;
    const eventdate = formData.get("eventdate") as string;
    const eventstarttime = formData.get("eventstarttime") as string;
    const eventendtime = formData.get("eventendtime") as string;
    const eventprice = formData.get("eventprice") as string;

    if (!eventtitle) {
      return NextResponse.json({ error: "Event title is required." }, { status: 400 });
    }

    // ✅ Step 1: Generate description using ChatGroq
    const chat = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY!,
      model: "llama-3.3-70b-versatile",
    });

    const prompt = `Write a compelling event description for the titled event "${eventtitle}", targeted at business owners and professionals.
Do not repeat the event title in the first sentence.
Maintain a professional tone and highlight the event’s value, key takeaways, and why it matters to the target audience.
Structure the content in a minimum of 4 paragraphs, focusing on benefits, relevance, and any unique features (e.g., expert speakers, workshops, networking opportunities).

At the end, include a final section clearly marked as:
"Key Details: <list or brief summary of date, location, registration info, or format>"`;

    const result = await chat.invoke(prompt);
    const fullContent = result.content as string;

    // ✅ Step 2: Fix image path before storing
    const BASE_URL = "https://storage.edvenswatech.com/storage/seekvens-blogs";
    let finalImageUrl = eventimage;

    if (eventimage && !eventimage.startsWith("http")) {
      finalImageUrl = `${BASE_URL}${eventimage.replace("/event_images", "")}`;
    }

    // ✅ Step 3: Store in DB
    const newEvent = await db.events.create({
      data: {
        event_title: eventtitle,
        slug: eventtitle.toLowerCase().replace(/\s+/g, "-"),
        event_description: fullContent,
        event_image: finalImageUrl,
        event_location: eventlocation || "To be announced",
        event_category: eventcategory || "General",
        event_date: eventdate || null,
        event_start_date: eventdate ? new Date(eventdate) : null,
        event_end_date: eventdate ? new Date(eventdate) : null,
        event_start_time: eventstarttime || null,
        event_end_time: eventendtime || null,
        event_price: eventprice ? Number(eventprice) : 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });

  } catch (error) {
    console.error("Error generating or saving event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}


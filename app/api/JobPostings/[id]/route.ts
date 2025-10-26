
import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Ensure id is treated as a string
) {
    try {
        const { id } = await params; 

        const blog = await db('job_postings_data')
            .select('*')
            .where('id', id)
            .first();

        if (!blog) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
}
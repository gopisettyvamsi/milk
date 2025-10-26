import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";




export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> } // params is now a Promise
) {
    try {
        const { slug } = await params; // Await the params Promise

        const blog = await db('blogs_data')
            .select('id', 'blog_title', 'slug','blog_content', 'blog_image', 'blog_cateogry', 'created_at')
            .where('slug', slug)
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

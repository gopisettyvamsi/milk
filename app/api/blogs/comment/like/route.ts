import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; // Your Knex.js database connection

export async function POST(request: NextRequest) {
  try {
    const { comment_id, user_id } = await request.json();

    if (!comment_id || !user_id) {
      return NextResponse.json(
        { error: 'Comment ID and User ID are required' },
        { status: 400 }
      );
    }

    // Check if comment exists and is not deleted
    const commentCheck = await db('comment_data')
      .where('id', comment_id)
      .where('is_deleted', 0)
      .first();

    if (!commentCheck) {
      return NextResponse.json(
        { error: 'Comment not found or has been deleted' },
        { status: 404 }
      );
    }

    // Check if user already liked this comment
    const existingLike = await db('comment_likes')
      .where('user_id', user_id)
      .where('comment_id', comment_id)
      .first();

    if (existingLike) {
      return NextResponse.json(
        { error: 'You have already liked this comment' },
        { status: 400 }
      );
    }

    // Start transaction
    await db.transaction(async (trx) => {
      try {
        // Add like record
        await trx('comment_likes').insert({
          user_id: user_id,
          comment_id: comment_id,
          created_at: new Date()
        });

        // Update likes count in comment_data
        await trx('comment_data')
          .where('id', comment_id)
          .increment('likes_count', 1);

        // No need to manually commit - Knex handles it
      } catch (error) {
        // Transaction will automatically rollback
        throw error;
      }
    });

    // Get updated likes count
    const updatedComment = await db('comment_data')
      .select('likes_count')
      .where('id', comment_id)
      .first();

    return NextResponse.json({
      success: true,
      likes_count: updatedComment?.likes_count || 0,
      has_liked: true
    });

  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const comment_id = searchParams.get('comment_id');
    const user_id = searchParams.get('user_id');

    if (!comment_id || !user_id) {
      return NextResponse.json(
        { error: 'Comment ID and User ID are required' },
        { status: 400 }
      );
    }

    let deletedLike = false;

    // Start transaction
    await db.transaction(async (trx) => {
      try {
        // Remove like record
        const deleteResult = await trx('comment_likes')
          .where('user_id', user_id)
          .where('comment_id', comment_id)
          .del();

        if (deleteResult === 0) {
          throw new Error('Like not found');
        }

        deletedLike = true;

        // Update likes count in comment_data (ensure it doesn't go below 0)
        await trx('comment_data')
          .where('id', comment_id)
          .decrement('likes_count', 1);

      } catch (error) {
        // Transaction will automatically rollback
        throw error;
      }
    });

    if (!deletedLike) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      );
    }

    // Get updated likes count
    const updatedComment = await db('comment_data')
      .select('likes_count')
      .where('id', comment_id)
      .first();

    return NextResponse.json({
      success: true,
      likes_count: updatedComment?.likes_count || 0,
      has_liked: false
    });

  } catch (error) {
    console.error('Error unliking comment:', error);
    if (error.message === 'Like not found') {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET like status for a specific comment and user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const comment_id = searchParams.get('comment_id');
    const user_id = searchParams.get('user_id');

    if (!comment_id || !user_id) {
      return NextResponse.json(
        { error: 'Comment ID and User ID are required' },
        { status: 400 }
      );
    }

    // Check if user liked this comment
    const like = await db('comment_likes')
      .where('user_id', user_id)
      .where('comment_id', comment_id)
      .first();

    // Get likes count and check if comment exists
    const comment = await db('comment_data')
      .select('likes_count')
      .where('id', comment_id)
      .where('is_deleted', 0)
      .first();

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      has_liked: !!like, // Convert to boolean
      likes_count: comment.likes_count || 0
    });

  } catch (error) {
    console.error('Error fetching like status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
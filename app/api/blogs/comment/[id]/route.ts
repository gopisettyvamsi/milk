import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 GET Request - Received id:', id);
    
    const contentId = Number(id);
    
    console.log('🔍 GET Request - Parsed contentId:', contentId);
    
    if (!contentId || isNaN(contentId)) {
      return NextResponse.json({ 
        error: "Invalid Content ID",
        received: id,
        type: typeof id
      }, { status: 400 });
    }

    // Check if content exists
    const contentExists = await db("blogs_data").where("id", contentId).first();
    if (!contentExists) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Get current user ID from query params for like status
    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get('user_id');
    const numericUserId = currentUserId ? Number(currentUserId) : null;

    // Fetch comments with user data and like counts
    const comments = await db("comment_data")
      .select(
        "comment_data.*",
        "users.name as user_name",
        "users.role as user_role",
        "users.email as user_email",
        // Count total likes for each comment
        db.raw('(SELECT COUNT(*) FROM comment_likes WHERE comment_likes.comment_id = comment_data.id) as likes_count'),
        // Check if current user liked this comment
        numericUserId ? 
          db.raw(`(SELECT COUNT(*) FROM comment_likes WHERE comment_likes.comment_id = comment_data.id AND comment_likes.user_id = ?) > 0 as has_liked`, [numericUserId])
          : db.raw('false as has_liked')
      )
      .leftJoin("users", "comment_data.user_id", "users.id")
      .where("comment_data.blog_id", contentId)
      .where("comment_data.is_deleted", 0)
      .orderBy([
        {
          column: db.raw(
            "CASE WHEN comment_data.parent_id IS NULL THEN comment_data.id ELSE comment_data.parent_id END"
          ),
        },
        { column: "comment_data.created_at", order: "asc" },
      ]);

    // Structure comments into main comments and replies
    const mainComments = comments.filter((c) => c.parent_id === null);
    const replies = comments.filter((c) => c.parent_id !== null);

    const structuredComments = mainComments.map((comment) => ({
      id: comment.id,
      comment: comment.comment,
      user_id: comment.user_id,
      user_name: comment.user_name || 'Unknown User',
      user_role: comment.user_role || 'user',
      created_at: comment.created_at,
      parent_id: comment.parent_id,
      content_author_id: contentId,
      likes: comment.likes_count || 0, // Use the calculated likes_count
      has_liked: Boolean(comment.has_liked), // Convert to boolean
      is_deleted: comment.is_deleted || 0,
      replies: replies
        .filter((reply) => reply.parent_id === comment.id)
        .map(reply => ({
          id: reply.id,
          comment: reply.comment,
          user_id: reply.user_id,
          user_name: reply.user_name || 'Unknown User',
          user_role: reply.user_role || 'user',
          created_at: reply.created_at,
          parent_id: reply.parent_id,
          content_author_id: contentId,
          likes: reply.likes_count || 0, // Use the calculated likes_count
          has_liked: Boolean(reply.has_liked), // Convert to boolean
          is_deleted: reply.is_deleted || 0,
          replies: []
        }))
    }));

    console.log(`Found ${structuredComments.length} main comments with ${replies.length} total replies (non-deleted only)`);

    return NextResponse.json({ 
      success: true,
      comments: structuredComments 
    });
    
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments: " + error.message }, 
      { status: 500 }
    );
  }
}

// PUT - Update comment (User can edit own posts, Admin can edit own posts only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id);
    const body = await req.json();
    
    const { comment: newComment, user_id } = body;

    // Validation
    if (!commentId || isNaN(commentId)) {
      return NextResponse.json({ error: 'Valid Comment ID is required' }, { status: 400 });
    }

    if (!newComment?.trim()) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
    }

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const numericUserId = Number(user_id);
    if (isNaN(numericUserId)) {
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

    // Get user info
    const user = await db('users')
      .where('id', numericUserId)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the existing comment
    const existingComment = await db('comment_data')
      .where('id', commentId)
      .first();

    if (!existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Authorization check
    const isCommentOwner = existingComment.user_id === numericUserId;

    // Users can only edit their own comments
    if (!isCommentOwner) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' }, 
        { status: 403 }
      );
    }

    // Update comment
    const updateResult = await db('comment_data')
      .where('id', commentId)
      .update({
        comment: newComment.trim(),
        updated_at: new Date(),
      });

    if (updateResult === 0) {
      return NextResponse.json(
        { error: 'Comment update failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment updated successfully"
    });

  } catch (error: any) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete comment (User can delete own posts, Admin can delete all posts)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id);
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    // Validation
    if (!commentId || isNaN(commentId)) {
      return NextResponse.json({ error: 'Valid Comment ID is required' }, { status: 400 });
    }

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const numericUserId = Number(user_id);
    if (isNaN(numericUserId)) {
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

    // Get user info
    const user = await db('users')
      .where('id', numericUserId)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the existing comment
    const existingComment = await db('comment_data')
      .where('id', commentId)
      .first();

    if (!existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Authorization check
    const isAdmin = user.role === 'admin';
    const isCommentOwner = existingComment.user_id === numericUserId;

    // Users can only delete their own comments
    // Admins can delete any comment (including others')
    if (!isCommentOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this comment' }, 
        { status: 403 }
      );
    }

    // Soft delete - Update is_deleted to 1 instead of actual deletion
    const result = await db('comment_data')
      .where('id', commentId)
      .update({
        is_deleted: 1,
        updated_at: new Date(),
      });

    if (result === 0) {
      return NextResponse.json({ error: 'Comment not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error: any) {
    console.error('Error soft deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' }, 
      { status: 500 }
    );
  }
}
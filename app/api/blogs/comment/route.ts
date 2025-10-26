import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, comment, content_id, parent_id } = body;

    if (!user_id || !comment || !content_id) {
      return NextResponse.json(
        { error: "user_id, content_id, and comment are required" },
        { status: 400 }
      );
    }

    const numericContentId = Number(content_id);
    const numericUserId = Number(user_id);
    const numericParentId = parent_id ? Number(parent_id) : null;

    // Verify blog exists
    const blog = await db("blogs_data").where("id", numericContentId).first();
    if (!blog) return NextResponse.json({ error: "Content not found" }, { status: 404 });

    // Verify user exists
    const user = await db("users").where("id", numericUserId).first();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // If reply, verify parent comment exists and belongs to same blog
    if (numericParentId) {
      const parentComment = await db("comment_data").where("id", numericParentId).first();
      if (!parentComment) return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      if (parentComment.blog_id !== numericContentId)
        return NextResponse.json({ error: "Parent comment does not belong to this content" }, { status: 400 });
    }

    // Insert new comment
    const [newCommentId] = await db("comment_data").insert({
      comment: comment.trim(),
      blog_id: numericContentId,
      user_id: numericUserId,
      parent_id: numericParentId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Fetch created comment with user info
    const createdComment = await db("comment_data")
      .select(
        "comment_data.*",
        "users.id as user_id",
        "users.name as user_name",
        "users.role as user_role"
      )
      .leftJoin("users", "comment_data.user_id", "users.id")
      .where("comment_data.id", newCommentId)
      .first();

    return NextResponse.json(
      { message: "Comment created successfully", comment: createdComment },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment", details: error.message },
      { status: 500 }
    );
  }
}


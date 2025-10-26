import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth.config";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      event_id, 
      question, 
      type, 
      options, 
      is_required, 
      sort_order 
    } = await request.json();

    // Validation
    if (!event_id || !question || !type) {
      return NextResponse.json(
        { error: 'event_id, question, and type are required fields' },
        { status: 400 }
      );
    }

    // Validate question type
    const validTypes = ['text', 'textarea', 'radio', 'checkbox'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid question type' },
        { status: 400 }
      );
    }

    // Convert options array to comma-separated string
    let optionsString: string | null = null;
    if (options && Array.isArray(options) && options.length > 0) {
      optionsString = options.map((opt: string) => opt.trim()).join(',');
    }
    
    // Insert data
    const insertData: any = {
      event_id,
      question: question.trim(),
      type,
      is_required: is_required ? 1 : 0,
      sort_order: sort_order || 0
    };

    if (optionsString) {
      insertData.options = optionsString;
    }

    // Insert and get the inserted ID
    const [insertedId] = await db('event_questions').insert(insertData);

    // Fetch the complete question with auto-increment ID
    const createdQuestion = await db('event_questions')
      .where('id', insertedId)
      .first();

    if (!createdQuestion) {
      throw new Error('Failed to retrieve created question');
    }

    // Format response
    const formattedQuestion = {
      id: createdQuestion.id,
      event_id: createdQuestion.event_id,
      question: createdQuestion.question,
      type: createdQuestion.type,
      options: createdQuestion.options ? 
        createdQuestion.options.split(',').map((opt: string) => opt.trim()) : 
        [],
      is_required: Boolean(createdQuestion.is_required),
      sort_order: createdQuestion.sort_order,
      created_at: createdQuestion.created_at,
      updated_at: createdQuestion.updated_at
    };

    return NextResponse.json({ 
      success: true,
      message: 'Question created successfully',
      data: formattedQuestion
    }, { status: 201 });

  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json(
      { error: 'Failed to create question' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get id from query params (not route params)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    // Check if question exists
    const existing = await db("event_questions")
      .where({ id })
      .first();

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Soft delete: update isdeleted = 1
    await db("event_questions")
      .where({ id })
      .update({
        isdeleted: 1,
        updated_at: new Date()
      });

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully"
    });
  } catch (error) {
    console.error("Delete question error:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get event_id from query params
    const { searchParams } = new URL(request.url);
    const event_id = searchParams.get("event_id");

    if (!event_id) {
      return NextResponse.json({ error: "event_id is required" }, { status: 400 });
    }

    // Fetch all non-deleted questions for this event
    const questions = await db("event_questions")
      .where({ event_id, isdeleted: 0 })
      .orderBy("sort_order", "asc");

    const formatted = questions.map((q: any) => ({
      id: q.id,
      event_id: q.event_id,
      question: q.question,
      type: q.type,
      options: q.options
        ? q.options.split(",").map((opt: string) => opt.trim())
        : [],
      is_required: Boolean(q.is_required),
      sort_order: q.sort_order,
      created_at: q.created_at,
      updated_at: q.updated_at,
    }));

    return NextResponse.json({
      success: true,
      message: "Questions fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Fetch questions error:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    const { event_id, question, type, options, is_required, sort_order } = body;

    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    // Check if question exists
    const existing = await db("event_questions")
      .where({ id, isdeleted: 0 })
      .first();

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Update question
    await db("event_questions")
      .where({ id })
      .update({
        event_id,
        question: question.trim(),
        type,
        options: options && options.length > 0 ? options.join(",") : null,
        is_required: is_required ? 1 : 0,
        sort_order: sort_order || 0,
        updated_at: new Date(),
      });

    // Fetch the updated question
    const updatedQuestion = await db("event_questions")
      .where({ id })
      .first();

    const formatted = {
      id: updatedQuestion.id,
      event_id: updatedQuestion.event_id,
      question: updatedQuestion.question,
      type: updatedQuestion.type,
      options: updatedQuestion.options
        ? updatedQuestion.options.split(",").map((opt: string) => opt.trim())
        : [],
      is_required: Boolean(updatedQuestion.is_required),
      sort_order: updatedQuestion.sort_order,
      created_at: updatedQuestion.created_at,
      updated_at: updatedQuestion.updated_at,
    };

    return NextResponse.json({
      success: true,
      message: "Question updated successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Update question error:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}
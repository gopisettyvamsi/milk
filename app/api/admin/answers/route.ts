import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth.config";
import db from "@/lib/db";
 
// ✅ Create new answer or update existing one
export async function POST(request: NextRequest) {
      try {
            console.log("🎯 API CALL: POST /api/admin/answers");
 
            const session = await getServerSession(authOptions);
            console.log("🔐 Session check:", session?.user?.email ?? "No session");
 
            if (!session?.user?.email) {
                  console.log("❌ Unauthorized access attempt");
                  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
 
            const body = await request.json();
            console.log("📦 Request body received:", body);
 
            const { user_id, event_id, question_id, answer } = body;
 
            if (!user_id || !event_id || !question_id) {
                  console.log("❌ Missing required fields:", { user_id, event_id, question_id });
                  return NextResponse.json(
                        { error: "user_id, event_id, and question_id are required" },
                        { status: 400 }
                  );
            }
 
            // ✅ Check if answer already exists
            const existing = await db("user_event_answers")
                  .where({ user_id, event_id, question_id })
                  .first();
            console.log("🔍 Existing answer found:", existing);
 
            let resultId;
 
            if (existing) {
                  console.log("✏️ Updating existing answer...");
                  await db("user_event_answers")
                        .where({ user_id, event_id, question_id })
                        .update({
                              answer: answer ?? "",
                              updated_at: new Date(),
                        });
                  resultId = existing.id;
            } else {
                  console.log("🆕 Inserting new answer...");
                  const [insertedId] = await db("user_event_answers").insert({
                        user_id,
                        event_id,
                        question_id,
                        answer: answer ?? "",
                        created_at: new Date(),
                        updated_at: new Date(),
                  });
                  resultId = insertedId;
            }
 
            const savedAnswer = await db("user_event_answers")
                  .where({ id: resultId })
                  .first();
            console.log("✅ Saved answer:", savedAnswer);
 
            return NextResponse.json(
                  {
                        success: true,
                        message: existing ? "Answer updated successfully" : "Answer added successfully",
                        data: savedAnswer,
                  },
                  { status: 201 }
            );
      } catch (error) {
            console.error("❌ Create/Update answer error:", error);
            return NextResponse.json(
                  { error: "Failed to save answer" },
                  { status: 500 }
            );
      } finally {
            console.log("🏁 POST /api/admin/answers completed");
      }
}
 
// ✅ Fetch answers by user and event
export async function GET(request: NextRequest) {
      try {
            console.log("🎯 API CALL: GET /api/admin/answers");
 
            const session = await getServerSession(authOptions);
            console.log("🔐 Session check:", session?.user?.email ?? "No session");
 
            if (!session?.user?.email) {
                  console.log("❌ Unauthorized access attempt");
                  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
 
            const { searchParams } = new URL(request.url);
            const user_id = searchParams.get("user_id");
            const event_id = searchParams.get("event_id");
 
            console.log("📥 GET params:", { user_id, event_id });
 
            if (!user_id || !event_id) {
                  console.log("❌ Missing GET parameters");
                  return NextResponse.json(
                        { error: "user_id and event_id are required" },
                        { status: 400 }
                  );
            }
 
            const answers = await db("user_event_answers")
                  .where({ user_id, event_id })
                  .orderBy("created_at", "asc");
 
            console.log("✅ Fetched answers:", answers);
 
            return NextResponse.json({
                  success: true,
                  message: "answers fetched successfully",
                  data: answers,
            });
      } catch (error) {
            console.error("❌ Fetch answers error:", error);
            return NextResponse.json(
                  { error: "Failed to fetch answers" },
                  { status: 500 }
            );
      } finally {
            console.log("🏁 GET /api/admin/answers completed");
      }
}
 
// ✅ Update a specific answer (by ID)
export async function PUT(request: NextRequest) {
      try {
            console.log("🎯 API CALL: PUT /api/admin/answers");
 
            const session = await getServerSession(authOptions);
            console.log("🔐 Session check:", session?.user?.email ?? "No session");
 
            if (!session?.user?.email) {
                  console.log("❌ Unauthorized access attempt");
                  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
 
            const { searchParams } = new URL(request.url);
            const id = searchParams.get("id");
            console.log("📥 PUT param id:", id);
 
            if (!id) {
                  console.log("❌ Answer ID is missing");
                  return NextResponse.json({ error: "Answer ID is required" }, { status: 400 });
            }
 
            const { answer } = await request.json();
            console.log("📦 New answer value:", answer);
 
            const existing = await db("user_event_answers").where({ id }).first();
            console.log("🔍 Existing answer:", existing);
 
            if (!existing) {
                  console.log("❌ Answer not found");
                  return NextResponse.json({ error: "Answer not found" }, { status: 404 });
            }
 
            await db("user_event_answers")
                  .where({ id })
                  .update({
                        answer: answer ?? "",
                        updated_at: new Date(),
                  });
 
            const updated = await db("user_event_answers").where({ id }).first();
            console.log("✅ Updated answer:", updated);
 
            return NextResponse.json({
                  success: true,
                  message: "Answer updated successfully",
                  data: updated,
            });
      } catch (error) {
            console.error("❌ Update answer error:", error);
            return NextResponse.json({ error: "Failed to update answer" }, { status: 500 });
      } finally {
            console.log("🏁 PUT /api/admin/answers completed");
      }
}
 
// ✅ Delete a specific answer
export async function DELETE(request: NextRequest) {
      try {
            console.log("🎯 API CALL: DELETE /api/admin/answers");
 
            const session = await getServerSession(authOptions);
            console.log("🔐 Session check:", session?.user?.email ?? "No session");
 
            if (!session?.user?.email) {
                  console.log("❌ Unauthorized access attempt");
                  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
 
            const { searchParams } = new URL(request.url);
            const id = searchParams.get("id");
            console.log("📥 DELETE param id:", id);
 
            if (!id) {
                  console.log("❌ Answer ID is missing");
                  return NextResponse.json({ error: "Answer ID is required" }, { status: 400 });
            }
 
            const existing = await db("user_event_answers").where({ id }).first();
            console.log("🔍 Existing answer:", existing);
 
            if (!existing) {
                  console.log("❌ Answer not found");
                  return NextResponse.json({ error: "Answer not found" }, { status: 404 });
            }
 
            await db("user_event_answers").where({ id }).del();
            console.log("✅ Answer deleted successfully");
 
            return NextResponse.json({
                  success: true,
                  message: "Answer deleted successfully",
            });
      } catch (error) {
            console.error("❌ Delete answer error:", error);
            return NextResponse.json({ error: "Failed to delete answer" }, { status: 500 });
      } finally {
            console.log("🏁 DELETE /api/admin/answers completed");
      }
}
 
 
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ Use Knex syntax (no db.query)
    const rows = await db("users")
      .select("profile")
      .where("email", session.user.email)
      .limit(1);

    const profileCompleted = rows.length > 0 ? rows[0].profile : 0;

    return NextResponse.json({ profileCompleted });
  } catch (error) {
    console.error("Error fetching profile status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

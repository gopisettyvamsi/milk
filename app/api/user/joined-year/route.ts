// app/api/user/joined-year/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db"; // your knex/db instance
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user row
    const user = await db("users")
      .where("email", session.user.email)
      .first("id", "created_at");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user joined year:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

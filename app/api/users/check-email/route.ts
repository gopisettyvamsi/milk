import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withProtection } from "@/utils/withProtection";

export const GET = withProtection(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const user = await db("users").where("email", email).first();

    return NextResponse.json({
      exists: !!user,
    });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
});

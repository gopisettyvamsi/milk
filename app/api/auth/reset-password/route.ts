import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // 1. Find user with valid token
    const user = await db("users").where({ reset_token: token }).first();
    if (!user || new Date(user.reset_expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired reset link." },
        { status: 400 }
      );
    }

    // 2. Hash new password
    const hashed = await bcrypt.hash(password, 10);

    // 3. Update password + clear reset fields
    await db("users")
      .where({ id: user.id })
      .update({
        password: hashed,
        reset_token: null,
        reset_expires_at: null,
        updated_at: db.fn.now(),
      });

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

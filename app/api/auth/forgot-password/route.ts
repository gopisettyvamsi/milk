import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";
import { renderEmailTemplate, sendEmail } from "@/lib/email-service";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Check if user exists
    const user = await db("users").where({ email }).first();
    if (!user) {
      return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
    }

    // 2. Generate token + expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    // 3. Save into user row
    await db("users")
      .where({ email })
      .update({
        reset_token: token,
        reset_expires_at: expiry,
        updated_at: db.fn.now(),
      });

    // 4. Build reset link
    const resetLink = `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.APP_URL || "https://edvenswa.ai"
    }/reset-password?token=${token}`;

    // 5. Render email templates
    const html = await renderEmailTemplate("resetPassword", {
      name: user.name || "User",
      resetLink,
    });

    const text = await renderEmailTemplate("resetPassword.txt", {
      name: user.name || "User",
      resetLink,
    });

    // 6. Send email
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html,
      text,
    });

    return NextResponse.json({ message: "Reset email sent!" });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

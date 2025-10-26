// app/api/register/route.ts
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import db from "@/lib/db"; 
import { renderEmailTemplate, sendEmail } from "@/lib/email-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // check duplicate email
    const existing = await db("users").where({ email }).first();
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // generate & hash password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user_uuid = uuidv4();
    const fullName = `${firstName} ${lastName}`;
    const now = new Date();

    // insert user
    await db("users").insert({
      user_uuid,
      email,
      name: fullName,
      phone_number: phone || null,     
      password: hashedPassword,
      role: "user",
      is_active: 1,
      created_at: now,
      updated_at: now,
    });

    // ------------------------------
    // 📧 Send emails using templates
    // ------------------------------

    // doctor user email
    const userHtml = await renderEmailTemplate("doctor-user", {
      name: fullName,
      email,
      tempPassword,
      phone,
    });

    await sendEmail({
      to: email,
      subject: "Welcome to KAGOF - Your Login Credentials",
      html: userHtml,
    });

    // admin notification email
    const adminHtml = await renderEmailTemplate("doctor-admin", {
      name: fullName,
      email,
      phone,
    });

    await sendEmail({
      to: "admin@edvenswa.aiii", // change if you want another recipient
      subject: "New Doctor Registered",
      html: adminHtml,
    });

    return NextResponse.json({
      message: "User registered successfully & emails sent",
      email,
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

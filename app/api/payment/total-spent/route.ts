import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth"; // Import your NextAuth auth options

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const globalSum = searchParams.get("global"); // ✅ if ?global=true, calculate total for all users

    // ✅ If global=true → sum all successful payments across all users
    if (globalSum === "true") {
      const [{ total_amount }] = await db("payment_history")
        .where("payment_status", "SUCCESS")
        .sum({ total_amount: "amount" });

      return NextResponse.json({
        success: true,
        scope: "global",
        total_amount: Number(total_amount) || 0,
      });
    }

    // 🧩 Otherwise, preserve your existing per-user logic
    // Step 1: Retrieve the session using NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Step 2: Find the user by email to get the user_id
    const user = await db("users").where("email", userEmail).first();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user_id = user.id; // Now you have the user_id

    // Step 3: Query the payment_history table to sum the total spent for the user with successful payments
    const result = await db("payment_history")
      .sum("amount as totalSpent")
      .where("user_id", user_id)
      .andWhere("payment_status", "SUCCESS");

    const totalSpent = Number(result[0]?.totalSpent) || 0;

    // Step 4: Return per-user total
    return NextResponse.json({
      success: true,
      scope: "user",
      user_id,
      totalSpent,
    });
  } catch (error: any) {
    console.error("Error fetching total spent:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

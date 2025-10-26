// app/api/dashboard/frequency/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { Session } from "next-auth";
import { withProtection } from "@/utils/withProtection";
// import db from "@/lib/db";
import clientPromise from '@/lib/mongodb';

export const GET = withProtection(
  async (_req: NextRequest) => {
    try {
      // Skip database operations during build time
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ success: true, data: [] });
      }

      const client = await clientPromise;
      const db = client.db("your_database_name");
      
      const frequencyStats = await db.collection("aprrequestlogs").aggregate([
        {
          $group: {
            _id: "$paymentFrequency",
            count: { $sum: 1 },
            totalAmount: { $sum: "$loanAmount" },
            totalFinanceCharge: { $sum: "$financeCharge" },
            averageAPR: { $avg: "$APR" }
          }
        }
      ]).toArray();

      return NextResponse.json(frequencyStats);
    } catch (error) {
      console.error("Error fetching frequency data:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch data" },
        { status: 500 }
      );
    }
  }
);

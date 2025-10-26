// app/api/dashboard/trends/route.ts
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
      
      const trends = await db.collection("aprrequestlogs").aggregate([
        {
          $sort: { timestamp: 1 }
        },
        {
          $group: {
            _id: {
              $dateToString: { 
                format: "%Y-%m-%d", 
                date: "$timestamp" 
              }
            },
            averageAPR: { $avg: "$APR" },
            totalRequests: { $sum: 1 },
            successfulRequests: {
              $sum: { $cond: ["$response", 1, 0] }
            },
            averageLoanAmount: { $avg: "$loanAmount" }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]).toArray();

      return NextResponse.json(trends);
    } catch (error) {
      console.error("Error fetching trends data:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch data" },
        { status: 500 }
      );
    }
  }
);
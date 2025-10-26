import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { withProtection } from "@/utils/withProtection";
// import db from "@/lib/db";
import clientPromise from '@/lib/mongodb';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/auth';

// Define the request interface
interface APRRequest {
  paymentFrequency: string;
  loanAmount: number;
  financeCharge: number;
  response: boolean;
  APR: number;
  timestamp: Date;
  AccountID?: string;
}

// Define stats interface
interface FrequencyStats {
  count: number;
  totalAmount: number;
  totalFinanceCharge: number;
}

// Define the frequency type
type FrequencyType = 'Monthly' | 'SemiMonthly' | 'Weekly' | 'BiWeekly';

// Define the stats record type
type StatsRecord = Record<FrequencyType, FrequencyStats>;

// Define aggregate data interface
interface AggregateData {
  totalRequests: number;
  successfulRequests: number;
  averageAPR: number;
  frequencyStats: StatsRecord;
  requests: APRRequest[];
}

export const GET = withProtection(
  async (req: NextRequest, session: Session) => {
    try {
      // Skip database operations during build time
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ success: true, data: [] });
      }

      const client = await clientPromise;
      const db = client.db("aprrequests");
      
      // Build query based on user role
      const query: { AccountID?: string } = {};
      if (session.user.role !== 'admin') {
        query.AccountID = session.user.account_id;
      }

      // Get all APR requests
      const aprRequests = await db
        .collection<APRRequest>("aprrequestlogs")
        .find(query)
        .sort({ timestamp: -1 })
        .toArray();

      // Initialize statistics with type safety
      const stats: StatsRecord = {
        Monthly: { count: 0, totalAmount: 0, totalFinanceCharge: 0 },
        SemiMonthly: { count: 0, totalAmount: 0, totalFinanceCharge: 0 },
        Weekly: { count: 0, totalAmount: 0, totalFinanceCharge: 0 },
        BiWeekly: { count: 0, totalAmount: 0, totalFinanceCharge: 0 }
      };

      // Map to convert payment frequency strings to FrequencyType
      const frequencyMap: Record<string, FrequencyType> = {
        'Monthly': 'Monthly',
        'Semi-Monthly': 'SemiMonthly',
        'SemiMonthly': 'SemiMonthly',
        'Weekly': 'Weekly',
        'Bi-Weekly': 'BiWeekly',
        'BiWeekly': 'BiWeekly'
      };

      aprRequests.forEach(request => {
        // Skip if paymentFrequency is undefined
        if (!request.paymentFrequency) {
          console.warn('Found request with undefined paymentFrequency:', request._id);
          return;
        }

        // Clean and convert the frequency string
        const rawFrequency = request.paymentFrequency.replace('-', '');
        const frequency = frequencyMap[rawFrequency];

        if (frequency && frequency in stats) {
          stats[frequency].count += 1;
          stats[frequency].totalAmount += request.loanAmount || 0;
          stats[frequency].totalFinanceCharge += request.financeCharge || 0;
        } else {
          console.warn('Unknown frequency type:', request.paymentFrequency);
        }
      });

      // Calculate aggregate data with safety checks
      const validRequests = aprRequests.filter(req => req.APR !== undefined && !isNaN(req.APR));
      const averageAPR = validRequests.length > 0
        ? validRequests.reduce((acc, req) => acc + (req.APR || 0), 0) / validRequests.length
        : 0;

      const aggregateData: AggregateData = {
        totalRequests: aprRequests.length,
        successfulRequests: aprRequests.filter(req => req.response).length,
        averageAPR,
        frequencyStats: stats,
        requests: aprRequests
      };

      return NextResponse.json(aggregateData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch data" },
        { status: 500 }
      );
    }
  }
);
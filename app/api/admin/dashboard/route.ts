import { NextResponse } from 'next/server';
import db from '@/lib/db';


export async function GET() {
  try {
    // Get basic stats
    const [basicStats] = await db.raw(`
      SELECT
        COUNT(*) as totalShareholders,
        SUM(shares) as totalShares,
        ROUND(AVG(shares), 2) as averageShares,
        COUNT(DISTINCT category) as categories
      FROM shareholders
    `);

    // Get monthly trends
    const [monthlyTrends] = await db.raw(`
      SELECT 
        DATE_FORMAT(date, '%b') as month,
        COUNT(*) as shareholders,
        SUM(shares) as shares
      FROM shareholders
      WHERE date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(date, '%b')
      ORDER BY DATE_FORMAT(date, '%b') DESC
      LIMIT 6
    `);

        // Get monthly trends
     const [monthlyShares] = await db.raw(`
          SELECT 
            DATE_FORMAT(date, '%b') as month,
            COUNT(*) as shareholders,
            SUM(shares) as shares
          FROM shareholders
          WHERE date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
          GROUP BY DATE_FORMAT(date, '%b')
          ORDER BY DATE_FORMAT(date, '%b') DESC
          LIMIT 6
        `);

        // monthly Shares Distribution
        const [monthlySharesDistribution] = await db.raw(`
           SELECT   DATE_FORMAT(date, '%b') as month,
  COUNT(DISTINCT id) as totalShareholders, SUM(shares) as totalShares, AVG(shares) as averageShares,
            MIN(shares) as minShares,
            MAX(shares) as maxShares
  FROM shareholders_db.shareholders 
   WHERE date >= DATE_SUB(date, INTERVAL 6 MONTH)  
   GROUP BY DATE_FORMAT(date, '%b')  ORDER BY DATE_FORMAT(date, '%b') ASC
        `);
    // Get category distribution
    const [categoryDistribution] = await db.raw(`
      SELECT 
        depository_type as name,
        COUNT(*) as value,
        ROUND((COUNT(*) / (SELECT COUNT(*) FROM shareholders) * 100), 2) as percentage
      FROM shareholders
      GROUP BY depository_type
      ORDER BY value DESC
    `);

    // Get recent activity
    const recentActivity = await db('shareholders')
      .select('holder', 'shares', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(5);

    // Get month-over-month changes
    const [monthlyChanges] = await db.raw(`
      SELECT
        (
          (SELECT COUNT(*) FROM shareholders 
           WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
          /
          (SELECT COUNT(*) FROM shareholders 
           WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH)
           AND created_at < DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
          - 1
        ) * 100 as shareholderChange,
        (
          (SELECT SUM(shares) FROM shareholders 
           WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
          /
          (SELECT SUM(shares) FROM shareholders 
           WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH)
           AND created_at < DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
          - 1
        ) * 100 as sharesChange,
        (
          (SELECT AVG(shares) FROM shareholders 
           WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
          /
          (SELECT AVG(shares) FROM shareholders 
           WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH)
           AND created_at < DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
          - 1
        ) * 100 as averageChange
    `);

    return NextResponse.json({
      success: true,
      data: {
        stats: basicStats[0],
        monthlyTrends,
        monthlyShares,
        monthlySharesDistribution,
        categoryDistribution,
        recentActivity,
        monthlyChanges: monthlyChanges[0]
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
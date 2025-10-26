import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";

export async function POST( req: NextRequest ) {
  try {
    const { doc_type } = await req.json();
    const docs = await db('investor_docs').where('doc_type',doc_type).select().orderBy('id', 'desc');
    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch docs' }, { status: 500 });
  }
}

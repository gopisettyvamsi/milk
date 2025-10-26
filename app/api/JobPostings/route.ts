// 1. Create API routes under `/app/api/jobs/route.ts` for GET, POST, PUT, DELETE
// 2. Replace mockJobs with actual fetch
// 3. Use Knex.js or your DB client for queries

// Example `route.ts` using Next.js API routes and Knex (adjust paths as needed)

import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET() {
  try {
    const jobs = await db('job_postings_data').select();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data);
    const [id] = await db('job_postings_data').insert({
      job_title: data.job_title,
      job_description: data.job_description,
      job_location: data.job_location,
      job_type: data.job_type,
      salary_range: data.salary_range,
      department: data.department,
      posted_date: new Date().toISOString().split('T')[0],
      contact_email: data.contact_email || null,
      post_startdate: data.post_startdate,
      post_enddate: data.post_enddate,
    });
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add job' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data);
    await db('job_postings_data')
      .where({ id: data.id })
      .update({
        job_title: data.job_title,
        job_description: data.job_description,
        job_location: data.job_location,
        job_type: data.job_type,
        salary_range: data.salary_range,
        department: data.department,
        posted_date: data.posted_date || new Date().toISOString().split('T')[0],
        contact_email: data.contact_email || null,
        post_startdate: data.post_startdate,
        post_enddate: data.post_enddate,
      });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    await db('job_postings_data').where({ id: data.id }).del();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}

// Then update your React code to fetch and interact with these endpoints
// Replace the mockJobs in `fetchJobs` with:
// const response = await fetch('/api/jobs');
// const jobs = await response.json();
// setJobs(jobs);

// For handleSubmit, POST or PUT based on `editingJob`
// For handleDelete, call DELETE with job id

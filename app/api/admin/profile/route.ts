// app/api/admin/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
//import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { getServerSession } from 'next-auth/next';
//import { authOptions } from '../../auth/[...nextauth]/route';
import { authOptions } from '@/app/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json();

    // Get current user
    const user = await db('users')
      .where('email', session.user.email)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('user',user);

    // Update user data
    await db('users')
      .where('id', user.id)
      .update({ 
        name,
        email
      });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: { name, email }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' }, 
      { status: 500 }
    );
  }
}
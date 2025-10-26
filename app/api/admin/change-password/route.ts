// app/api/admin/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
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

    const { currentPassword, newPassword } = await request.json();

    const user = await db('users')
      .where('email', session.user.email)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db('users')
      .where('id', user.id)
      .update({ password: hashedPassword });

    return NextResponse.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' }, 
      { status: 500 }
    );
  }
}
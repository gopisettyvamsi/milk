import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/auth';
import { Session } from 'next-auth';

type Handler = (req: NextRequest, session: Session, ...args: any[]) => Promise<NextResponse>;

export function withProtection(handler: Handler) {
  return async function (req: NextRequest, ...args: any[]) {
    try {
      const session = await getServerSession(authOptions);

      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      return handler(req, session, ...args);
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
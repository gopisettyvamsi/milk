import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import type { AuthOptions} from 'next-auth';
// import type { JWT } from 'next-auth/jwt';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

interface DBUser {
  id: number;
  email: string;
  name: string;
  role: string;
  password: string;
  is_active: boolean;
  created_at: string;
  account_id: string;
  status: string;
  profile: number; // ✅ Added
}

// Extend next-auth types to include our custom fields
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    is_active: boolean;
    created_at: string;
    account_id: string;
    status: string;
    profile: number; // ✅ Added
  }
  
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    email: string;
    name: string;
    role: string;
    is_active: boolean;
    created_at: string;
    account_id: string;
    status: string;
    profile: number; // ✅ Added
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '30d';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await db('users')
            .where('email', credentials.email.toLowerCase().trim())
            .first() as DBUser | undefined;

          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          const tokenPayload: JWTPayload = {
            userId: user.id.toString(),
            email: user.email,
            role: user.role,
            name: user.name
          };

          const token = jwt.sign(tokenPayload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
          });

          (await cookies()).set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            is_active: user.is_active,
            created_at: user.created_at,
            account_id: user.account_id,
            status: user.status,
            profile: user.profile || 0, 
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.is_active = user.is_active;
        token.created_at = user.created_at;
        token.account_id = user.account_id;
        token.status = user.status;
        token.profile = user.profile || 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.userId;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.is_active = token.is_active;
        session.user.created_at = token.created_at;
        session.user.account_id = token.account_id;
        session.user.status = token.status;
      }
      return session;
    }
  },
  events: {
    async signOut() {
      (await cookies()).delete('auth-token');
    }
  }
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const validateToken = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth-token');

  if (!token) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const payload = verifyToken(token.value);
  if (!payload) {
    (await cookies()).delete('auth-token');
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return payload;
};
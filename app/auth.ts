import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { AuthOptions } from 'next-auth';

interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  account_id: string;
  password?: string;
  status: string;
  profile: number; // Add profile field
}

declare module 'next-auth' {
  interface User extends Omit<CustomUser, 'password'> {
    email: string;
    name: string;
  }
  interface Session {
    user: User;
    expires: string;
   
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends Omit<CustomUser, 'password'> {
    iat: number;
    exp: number;
    jti: string;
   
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db('users')
            .where('email', credentials.email)
            .first();

          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            is_active: user.is_active,
            created_at: user.created_at,
            account_id: user.account_id,
            status: user.status,
            profile: user.profile || 0 // Add profile field with default
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google' && profile?.email) {
        try {
          console.log("Google OAuth - Email:", profile.email);

          // 1. Lookup user in DB
          let dbUser = await db("users").where("email", profile.email).first();
          let isNewUser = false;
          
          // 2. If not found → insert new user with profile = 0
          if (!dbUser) {
            console.log("Google OAuth - User not found, creating new user with profile = 0");
            isNewUser = true;

            const [newUserId] = await db("users").insert({
              email: profile.email,
              name: profile.name || profile.email.split("@")[0],
              role: "user",
              is_active: 1,
              profile: 0 // New users get profile = 0
            });

            // Re-query the full user record
            dbUser = await db("users").where("id", newUserId).first();
          } else {
            console.log("Google OAuth - Existing user found, profile:", dbUser.profile);
          }

          // 3. Attach DB values to NextAuth user object
          user.id = dbUser.id.toString();
          user.role = dbUser.role;
          user.is_active = dbUser.is_active;
          user.created_at = dbUser.created_at;
          user.profile = dbUser.profile || 0;
          user.account_id = dbUser.account_id;
          user.status = dbUser.status;

          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in - update token with user data
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          is_active: user.is_active,
          created_at: user.created_at,
          account_id: user.account_id,
          status: user.status,
          profile: (user as any).profile || 0,
          
        };
      }



      return {
        ...token,
        role: token.role || 'user',
        is_active: token.is_active || false,
        created_at: token.created_at || new Date().toISOString(),
        account_id: token.account_id || '',
        status: token.status || 'active',
        profile: token.profile || 0,
        
      };
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role,
          is_active: token.is_active,
          created_at: token.created_at,
          account_id: token.account_id,
          status: token.status,
          profile: token.profile || 0
        };
        

      }
      
      console.log("Session created:", {
        userId: session?.user?.id,
        profile: session?.user?.profile,
    
      });
      
      return session;
    }
  }
};
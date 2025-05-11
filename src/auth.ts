import NextAuth, { type NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { db } from '@/db';
import {
	accounts,
	sessions,
	users,
	verificationTokens
} from '@/db/schema/users';

export const authOptions = {
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens
	}),
	providers: [
		GitHub({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET
		})
	],
	secret: process.env.NEXT_PUBLIC_SECRET,
	callbacks: {
		session: ({ session, user }) => {
			session.user.id = user.id;

			return session;
		}
	}
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authOptions);

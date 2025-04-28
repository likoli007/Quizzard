import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

import { db } from '@/db';
import { type User, users } from '@/db/schema/user';

export const getLoggedInUser = async (): Promise<User | null> => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.isLoggedIn, true))
		.limit(1)
		.get();

	return user ?? null;
};

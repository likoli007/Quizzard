'use server';

import { z } from 'zod';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { type User } from '@/db/schema/user';
import { users } from '@/db/schema/user';

const loginFormValidator = z.object({
	username: z.string().min(1, { message: 'Username is required' }),
	password: z.string().min(1, { message: 'Password is required' })
});

export const loginAction = async (input: {
	username: string;
	password: string;
}): Promise<User> => {
	const { username, password } = loginFormValidator.parse(input);

	const existing = await db
		.select()
		.from(users)
		.where(and(eq(users.username, username), eq(users.password, password)))
		.get();

	if (!existing) {
		throw new Error('Invalid username or password');
	}

	// just in case
	await db
		.update(users)
		.set({ isLoggedIn: false })
		.where(eq(users.isLoggedIn, true));

	await db
		.update(users)
		.set({ isLoggedIn: true })
		.where(eq(users.id, existing.id));

	return { ...existing, isLoggedIn: true };
};

export const logoutAction = async (): Promise<void> => {
	await db
		.update(users)
		.set({ isLoggedIn: false })
		.where(eq(users.isLoggedIn, true));
};

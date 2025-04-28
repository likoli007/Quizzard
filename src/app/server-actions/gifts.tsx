'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { createGiftValidator, gifts } from '@/db/schema/gift';

export const updateDeliveredStatus = async (
	id: number,
	delivered: boolean
): Promise<void> => {
	await db.update(gifts).set({ delivered }).where(eq(gifts.id, id));
};

export const createGiftAction = async (input: {
	name: string;
	description?: string;
	price: number;
	createdBy: string;
}) => {
	const { name, description, price, createdBy } = createGiftValidator.parse({
		...input,
		createdBy: input.createdBy
	});

	await db.insert(gifts).values({
		name,
		description,
		price,
		createdBy,
		delivered: false
	});
};

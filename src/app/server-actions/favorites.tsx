'use server';

import { v4 as uuid } from 'uuid';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { favorites } from '@/db/schema/favorites';

const toggleFavorite = async (topicId: string, userId: string) => {
	const [existing] = await db
		.select()
		.from(favorites)
		.where(and(eq(favorites.topicId, topicId), eq(favorites.userId, userId)));

	if (existing) {
		await db.delete(favorites).where(eq(favorites.id, existing.id));
	} else {
		await db.insert(favorites).values({
			id: uuid(),
			topicId,
			userId
		});
	}

	revalidatePath('/topics');
	revalidatePath(`/topics/${topicId}`);
};

export default toggleFavorite;

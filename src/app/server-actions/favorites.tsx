'use server';

import { v4 as uuid } from 'uuid';
import { db } from '@/db';
import { favorites } from '@/db/schema/favorites';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(topicId: string, userId: string) {
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
}

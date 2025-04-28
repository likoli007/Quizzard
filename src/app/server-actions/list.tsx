'use server';

import { db } from '@/db';
import { gifts } from '@/db/schema/gift';

export const getGifts = async () =>
	await db.select().from(gifts).orderBy(gifts.id).all();

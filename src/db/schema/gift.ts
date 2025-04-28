import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

import { users } from './user';

export const gifts = sqliteTable('gifts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description'),
	price: integer('price').notNull(),
	delivered: integer('delivered', { mode: 'boolean' }).notNull().default(false),
	createdBy: integer('created_by')
		.notNull()
		.references(() => users.id)
});

export const giftsRelations = relations(gifts, ({ one }) => ({
	user: one(users, {
		fields: [gifts.createdBy],
		references: [users.id]
	})
}));

export type Gift = typeof gifts.$inferSelect;

export const createGiftValidator = z.object({
	name: z.string().min(3),
	description: z.string().max(25).optional(),
	price: z.number(),
	createdBy: z.coerce.number()
});

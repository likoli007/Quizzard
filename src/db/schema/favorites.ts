import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

import { topics } from './topics';
import { users } from './users';

export const favorites = sqliteTable('favorites', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	topicId: text('topic_id')
		.notNull()
		.references(() => topics.id),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
	topic: one(topics, { fields: [favorites.topicId], references: [topics.id] }),
	user: one(users, { fields: [favorites.userId], references: [users.id] })
}));

export type Favorite = typeof favorites.$inferSelect;

import 'server-only';
import { sql, sum, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { users } from '@/db/schema/users';
import { quizAttempts } from '@/db/schema/quizAttempts';

export const getUsersByTotalPoints = async () => {
	const rows = await db
		.select({
			id: users.id,
			name: users.name ?? users.email,
			score: sum(quizAttempts.score).as('totalPoints') ?? 0
		})
		.from(users)
		.leftJoin(quizAttempts, eq(users.id, quizAttempts.userId))
		.groupBy(users.id)
		.orderBy(desc(sql`totalPoints`));

	return rows.map(r => ({
		id: r.id,
		name: r.name ?? 'Anonymous',
		score: Number(r.score ?? 0)
	}));
};

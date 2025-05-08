import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: [
		'./src/db/schema/favorites.ts',
		'./src/db/schema/questions.ts',
		'./src/db/schema/quizKeys.ts',
		'./src/db/schema/quizzes.ts',
		'./src/db/schema/topics.ts',
		'./src/db/schema/users.ts',
		'./src/db/schema/userPrefs.ts',
		'./src/db/schema/quizAnswers.ts',
		'./src/db/schema/quizAttempts.ts'
	],
	out: './drizzle',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		authToken: process.env.AUTH_TOKEN!
	}
});

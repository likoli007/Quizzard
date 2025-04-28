import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: ['./src/db/schema/user.ts', './src/db/schema/gift.ts'],
	out: './drizzle',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		authToken: process.env.AUTH_TOKEN!
	}
});

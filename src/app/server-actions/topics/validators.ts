import { z } from 'zod';

export const updateTopicValidator = z.object({
	id: z.string(),
	title: z.string().min(1),
	description: z.string().optional(),
	content: z.string(),
	category: z.string(),
	readTime: z.coerce.number().int()
});

export const createTopicValidator = z.object({
	title: z.string().min(1),
	description: z.string().optional(),
	content: z.string(),
	category: z.string(),
	readTime: z.coerce.number().int(),
	userId: z.string(),
	publishedAt: z.string().optional()
});

import { z } from 'zod';

export const tfQuestionSchema = z.object({
	type: z.literal('TF'),
	questionText: z.string().min(1, 'Required'),
	answer: z.boolean()
});

export const mcQuestionSchema = z.object({
	type: z.literal('MC'),
	questionText: z.string().min(1, 'Required'),
	// TODO: this should be an array, but i couldn't get it to work yet
	// options: z.array(z.string()).min(2, 'Fill at least two options'),
	options: z
		.tuple([z.string(), z.string(), z.string(), z.string()])
		.refine(arr => arr.filter(s => s.trim() !== '').length >= 2, {
			message: 'Fill at least two options'
		}),
	answer: z.coerce.number().int().min(0, 'Pick a valid index')
});

export const questionSchema = z.discriminatedUnion('type', [
	tfQuestionSchema,
	mcQuestionSchema
]);

const createQuizPartSchema = z.object({
	associatedTopicId: z.string().uuid(),
	quizTitle: z.string().min(1),
	quizDescription: z.string().optional(),
	timeLimit: z.coerce.number().int().positive(),
	questions: z.array(questionSchema).min(1)
});

export const createQuizSchema = createQuizPartSchema;

export type CreateTopicQuizInput = z.infer<typeof createQuizSchema>;

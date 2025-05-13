import { Topic } from '@/db/schema/topics';

export type TopicQuizPreview = {
	id: string;
	title: string;
	description: string | null;
	timeLimit: number;
	createdAt: string;
	updatedAt: string;
};

export type TopicWithAuthor = Topic & {
	authorName: string | null;
};

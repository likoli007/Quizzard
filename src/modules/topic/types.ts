export type Topic = {
	id: string;
	title: string;
	description?: string | null;
	content: string;
	category: string;
};

export type TopicQuizPreview = {
	id: string;
	title: string;
	description: string | null;
	timeLimit: number;
	createdAt: string;
	updatedAt: string;
};

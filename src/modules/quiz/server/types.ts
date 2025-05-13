export type QuizWithDetails = {
	id: string;
	title: string;
	description: string | null;
	timeLimit: number;
	topicId: string;
	userId: string | null;
	createdAt: string;
	updatedAt: string;

	attempts: Array<{
		id: string;
		userId: string;
		quizId: string;
		score: number;
		timeSpent: number;
		startedAt: string;
		completedAt: string | null;
	}>;

	trueFalseQuestions?: Array<{
		id: string;
		quizId: string;
		questionText: string;
		order: number;
		createdAt: string;
		updatedAt: string;
	}>;

	multipleChoiceQuestions?: Array<{
		id: string;
		quizId: string;
		questionText: string;
		order: number;
		options: string[];
		createdAt: string;
		updatedAt: string;
	}>;
};

export type AnswerKey = Record<string, boolean | number>;

export type QuizWithDetailsAndAnswers = QuizWithDetails & {
	answers: AnswerKey;
};

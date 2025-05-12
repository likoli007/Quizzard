import { redirect, notFound } from 'next/navigation';

import { auth } from '@/auth';
import { getQuizDetailsWithoutAttempts } from '@/modules/quiz/server/query';
import { getTopicsByUserId } from '@/modules/topic/server/query';
import { TopicQuizForm } from '@/modules/quiz/components/create-quiz-form/create-quiz-form';

const EditQuizPage = async ({ params }: { params: { id: string } }) => {
	const session = await auth();
	if (!session?.user?.id) {
		redirect('/auth/login');
	}

	const quiz = await getQuizDetailsWithoutAttempts(
		params.id,
		session.user!.id as string
	);
	if (!quiz) notFound();

	const topics = await getTopicsByUserId(session.user!.id as string);

	const tfQuestions = quiz.trueFalseQuestions?.map(q => ({
		type: 'TF' as const,
		questionText: q.questionText,
		answer: false
	}));

	const mcQuestions = quiz.multipleChoiceQuestions?.map(q => ({
		type: 'MC' as const,
		questionText: q.questionText,
		options: [...q.options, '', '', '', ''].slice(0, 4) as [
			string,
			string,
			string,
			string
		],
		answer: 0
	}));
	const questions = [...(tfQuestions ?? []), ...(mcQuestions ?? [])];

	const initialData = {
		associatedTopicId: quiz.topicId,
		quizTitle: quiz.title,
		quizDescription: quiz.description ?? '',
		timeLimit: quiz.timeLimit,
		questions
	};

	return (
		<TopicQuizForm
			mode="edit"
			userId={session.user!.id as string}
			topics={topics}
			initialData={{ id: quiz.id, ...initialData }}
		/>
	);
};

export default EditQuizPage;

import { notFound } from 'next/navigation';

import { getTopic } from '@/modules/topic/server/query';
import TopicDetail from '@/modules/topic/components/detail/topic-detail';
import { getTopicQuizzes } from '@/modules/quiz/server/query';

const TopicDetailPage = async ({
	params
}: {
	params: Promise<{ id: string }>;
}) => {
	const topic = await getTopic((await params).id);
	const quizzes = await getTopicQuizzes(topic.id);

	if (!topic) return notFound();

	return <TopicDetail topic={topic} quizzes={quizzes} />;
};

export default TopicDetailPage;

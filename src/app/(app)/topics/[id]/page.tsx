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
	if (!topic) return notFound();
	const quizzes = await getTopicQuizzes(topic.id);

	return <TopicDetail topic={topic} quizzes={quizzes} />;
};

export default TopicDetailPage;

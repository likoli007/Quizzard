import { notFound } from 'next/navigation';

import { getTopic } from '@/modules/topic/server/query';
import TopicDetail from '@/modules/topic/detail/topic-detail';

const TopicDetailPage = async ({
	params
}: {
	params: Promise<{ id: string }>;
}) => {
	const topic = await getTopic((await params).id);

	if (!topic) return notFound();

	return <TopicDetail topic={topic} />;
};

export default TopicDetailPage;

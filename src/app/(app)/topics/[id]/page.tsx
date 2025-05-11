import { notFound } from 'next/navigation';

import { getTopic } from '@/modules/topic/server/query';
import TopicDetail from '@/modules/topic/detail/topic-detail';

export default async function TopicDetailPage({
	params
}: {
	params: { id: string };
}) {
	const topic = await getTopic(await params.id);

	if (!topic) return notFound();

	return <TopicDetail topic={topic} />;
}

'use server';

import { PageHeading } from '@/components/common/page-heading';
import { getTopic } from '@/modules/topic/server/query';
import { BackButton } from '@/components/common/back-button';
import { getUsersByTopicPoints } from '@/modules/leaderboard/server/query';
import StickyLeaderboard from '@/modules/leaderboard/components/StickyLeaderboard';

type LeaderboardPageProps = {
	params: Promise<{ id: string }>;
};

const LeaderboardPage = async ({ params }: LeaderboardPageProps) => {
	const topic = await getTopic((await params).id);

	const leaders = await getUsersByTopicPoints(topic.id);

	return (
		<div className="container mx-auto space-y-6 px-4 py-12">
			<BackButton text="Return to Topic" href={`/topics/${topic.id}`} />
			<PageHeading
				heading={`Leaderboard for ${topic.title}`}
				subheading="Who’s on top?"
			/>
			<StickyLeaderboard leaders={leaders} />
		</div>
	);
};

export default LeaderboardPage;

'use server';

import Link from 'next/link';

import { PageHeading } from '@/components/common/page-heading';
import { mockLeaders } from '@/lib/mockData';
import StickyLeaderboard from '@/components/leaderboard/StickyLeaderboard';
import { getTopic } from '@/app/server-actions/topics';

type LeaderboardPageProps = {
	params: { id: string };
};

const LeaderboardPage = async ({ params }: LeaderboardPageProps) => {
	const topic = await getTopic(params.id);

	return (
		<div className="container mx-auto space-y-6 px-4 py-12">
			<Link
				href={`/topics/${topic.id}`}
				className="bg-primary hover:bg-primary/80 rounded-lg px-4 py-2 text-white"
			>
				Return to Topic
			</Link>
			<PageHeading
				heading={`Leaderboard for ${topic.title}`}
				subheading="Who’s on top?"
			/>
			<StickyLeaderboard leaders={mockLeaders} />
		</div>
	);
};

export default LeaderboardPage;

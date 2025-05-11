'use server';

import Link from 'next/link';

import { PageHeading } from '@/components/common/page-heading';
import { mockLeaders } from '@/lib/mockData';
import StickyLeaderboard from '@/components/leaderboard/StickyLeaderboard';
import { getTopic } from '@/modules/topic/server/query';
import { ArrowLeft } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';

type LeaderboardPageProps = {
	params: { id: string };
};

const LeaderboardPage = async ({ params }: LeaderboardPageProps) => {
	const topic = await getTopic(params.id);

	return (
		<div className="container mx-auto space-y-6 px-4 py-12">
			<BackButton text="Return to Topic" href={`/topics/${topic.id}`} />
			<PageHeading
				heading={`Leaderboard for ${topic.title}`}
				subheading="Who’s on top?"
			/>
			<StickyLeaderboard leaders={mockLeaders} />
		</div>
	);
};

export default LeaderboardPage;

'use client';

import { useSession } from 'next-auth/react';

import { PageHeading } from '@/components/common/page-heading';
import { mockLeaders } from '@/lib/mockData';
import StickyLeaderboard from '@/components/leaderboard/StickyLeaderboard';

const LeaderboardPage = () => {
	const { data: session } = useSession();
	const userId = session?.user?.id;

	return (
		<div className="container mx-auto space-y-6 px-4 py-12">
			<PageHeading heading="Leaderboard" subheading="Who’s on top?" />
			<StickyLeaderboard leaders={mockLeaders} currentUserId={userId} />
		</div>
	);
};

export default LeaderboardPage;

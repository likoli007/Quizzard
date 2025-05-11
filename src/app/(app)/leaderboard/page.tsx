'use client';

import { PageHeading } from '@/components/common/page-heading';
import { mockLeaders } from '@/lib/mockData';
import StickyLeaderboard from '@/components/leaderboard/StickyLeaderboard';

const LeaderboardPage = () => (
	<div className="container mx-auto space-y-6 px-4 py-12">
		<PageHeading heading="Leaderboard" subheading="Who’s on top?" />
		<StickyLeaderboard leaders={mockLeaders} />
	</div>
);

export default LeaderboardPage;

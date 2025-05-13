import { PageHeading } from '@/components/common/page-heading';
import StickyLeaderboard from '@/components/leaderboard/StickyLeaderboard';
import { getUsersByTotalPoints } from '@/app/server-actions/leaderboard';

const LeaderboardPage = async () => {
	const leaders = await getUsersByTotalPoints();

	return (
		<div className="container mx-auto space-y-6 px-4 py-12">
			<PageHeading heading="Leaderboard" subheading="Who’s on top?" />
			<StickyLeaderboard leaders={leaders} />
		</div>
	);
};

export default LeaderboardPage;

'use client';

import { useEffect, useRef, useState } from 'react';
import { Medal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PageHeading } from '@/components/common/page-heading';
import { LeaderboardCard } from '@/components/leaderboard/LeaderboardCard';

const mockLeaders = Array.from({ length: 50 }, (_, i) => ({
	id: i + 1,
	name: `User${i + 1}`,
	score: Math.floor(Math.random() * 1000)
}));

const currentUserId = 17;

const LeaderboardPage = () => {
	const sortedLeaders = mockLeaders.toSorted((a, b) => b.score - a.score);
	const currentUser = sortedLeaders.find(u => u.id === currentUserId);
	const currentUserPlace =
		sortedLeaders.findIndex(u => u.id === currentUserId) + 1;

	const currentUserRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [stickyCardPosition, setStickyCardPosition] = useState<
		'top' | 'bottom' | 'hidden'
	>('bottom');

	const getMedal = (place: number) => {
		if (place > 3) return null;
		const colors = ['text-yellow-500', 'text-gray-400', 'text-orange-500'];
		return <Medal className={cn('h-5 w-5', colors[place - 1])} />;
	};

	const updateFooterPosition = () => {
		const container = containerRef.current;
		const currentCard = currentUserRef.current;
		if (!container || !currentCard) return;

		const containerRect = container.getBoundingClientRect();
		const cardRect = currentCard.getBoundingClientRect();

		if (
			cardRect.top >= containerRect.top &&
			cardRect.bottom <= containerRect.bottom
		) {
			setStickyCardPosition('hidden');
		} else if (cardRect.bottom > containerRect.bottom) {
			setStickyCardPosition('bottom');
		} else if (cardRect.top < containerRect.top) {
			setStickyCardPosition('top');
		}
	};

	useEffect(() => {
		updateFooterPosition();
		const container = containerRef.current;
		if (!container) return;

		container.addEventListener('scroll', updateFooterPosition);
		window.addEventListener('resize', updateFooterPosition);

		return () => {
			container.removeEventListener('scroll', updateFooterPosition);
			window.removeEventListener('resize', updateFooterPosition);
		};
	}, []);

	return (
		<div className="container mx-auto space-y-6 px-4 py-12">
			<PageHeading heading="Leaderboard" subheading="Who’s on top this week?" />

			<div className="relative max-h-[600px] overflow-hidden rounded-xl border">
				<div
					ref={containerRef}
					className="hide-scrollbar max-h-[600px] space-y-2 overflow-y-auto p-2 pb-20"
				>
					{sortedLeaders.map((leader, index) => {
						const isCurrent = leader.id === currentUserId;
						return (
							<LeaderboardCard
								key={leader.id}
								ref={isCurrent ? currentUserRef : undefined}
								place={index + 1}
								name={leader.name}
								score={leader.score}
								getMedal={getMedal}
								isCurrent={isCurrent}
							/>
						);
					})}
				</div>

				{currentUser && stickyCardPosition !== 'hidden' && (
					<div
						className={cn(
							'pointer-events-none absolute right-0 left-0 p-2',
							stickyCardPosition === 'top' ? 'top-0' : 'bottom-0'
						)}
					>
						<LeaderboardCard
							place={currentUserPlace}
							name={currentUser.name}
							score={currentUser.score}
							getMedal={getMedal}
							isCurrent
							className="border-primary bg-muted p-3 shadow-lg"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default LeaderboardPage;

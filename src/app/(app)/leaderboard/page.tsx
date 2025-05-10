'use client';

import { useEffect, useRef, useState } from 'react';
import { Medal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PageHeading } from '@/components/common/page-heading';

const mockLeaders = Array.from({ length: 50 }, (_, i) => ({
	id: i + 1,
	name: `User${i + 1}`,
	score: Math.floor(Math.random() * 1000)
}));

const currentUserId = 17;

const LeaderboardPage = () => {
	const sortedLeaders = mockLeaders.sort((a, b) => b.score - a.score);
	const currentUser = sortedLeaders.find(u => u.id === currentUserId);
	const currentUserPlace =
		sortedLeaders.findIndex(u => u.id === currentUserId) + 1;

	const currentUserRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [footerPosition, setFooterPosition] = useState<
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
			// card fully visible in container viewport
			setFooterPosition('hidden');
		} else if (cardRect.bottom > containerRect.bottom) {
			// card completely below
			setFooterPosition('bottom');
		} else if (cardRect.top < containerRect.top) {
			// card completely above
			setFooterPosition('top');
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
				{/* Scrollable leaderboard */}
				<div
					ref={containerRef}
					className="hide-scrollbar max-h-[600px] space-y-2 overflow-y-auto p-2 pb-20"
				>
					{sortedLeaders.map((leader, index) => {
						const isCurrent = leader.id === currentUserId;
						return (
							<div
								key={leader.id}
								ref={isCurrent ? currentUserRef : null}
								className={cn(
									'flex items-center justify-between rounded-xl border p-4 shadow-sm',
									isCurrent && 'border-primary bg-muted'
								)}
							>
								{/* Left: place + medal */}
								<div className="flex w-24 items-center gap-2">
									<span className="w-5 text-right font-medium">
										{index + 1}
									</span>
									{getMedal(index + 1)}
								</div>

								{/* Center: username */}
								<div className="flex-1 text-center font-medium">
									{leader.name}
								</div>

								{/* Right: score */}
								<Badge>{leader.score} pts</Badge>
							</div>
						);
					})}
				</div>

				{/* Sticky footer */}
				{currentUser && footerPosition !== 'hidden' && (
					<div
						className={cn(
							'pointer-events-none absolute right-0 left-0 p-2',
							footerPosition === 'top' ? 'top-0' : 'bottom-0'
						)}
					>
						<div className="border-primary bg-muted flex items-center justify-between rounded-xl border p-3 shadow-lg">
							<div className="flex w-24 items-center gap-2">
								<span className="w-5 text-right font-medium">
									{currentUserPlace}
								</span>
								{getMedal(currentUserPlace)}
							</div>
							<div className="flex-1 text-center font-medium">
								{currentUser.name}
							</div>
							<Badge>{currentUser.score} pts</Badge>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default LeaderboardPage;

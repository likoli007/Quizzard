'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Medal } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { LeaderboardCard } from '@/components/leaderboard/LeaderboardCard';

type StickyLeaderboardProps = {
	leaders: { id: string; name: string; score: number }[];
};

const StickyLeaderboard = ({ leaders }: StickyLeaderboardProps) => {
	const { data: session } = useSession();
	const currentUserId = session?.user?.id;
	const sortedLeaders = leaders.toSorted((a, b) => b.score - a.score);
	const currentUser = currentUserId
		? sortedLeaders.find(u => u.id === currentUserId)
		: null;
	const currentUserPlace = currentUser
		? sortedLeaders.findIndex(u => u.id === currentUserId) + 1
		: null;

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

	const updateStickyCardPosition = useCallback(() => {
		if (!currentUser) return;
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
	}, [currentUser]);

	useEffect(() => {
		updateStickyCardPosition();
		const container = containerRef.current;
		if (!container) return;

		container.addEventListener('scroll', updateStickyCardPosition);
		window.addEventListener('resize', updateStickyCardPosition);

		return () => {
			container.removeEventListener('scroll', updateStickyCardPosition);
			window.removeEventListener('resize', updateStickyCardPosition);
		};
	}, [updateStickyCardPosition]);

	return (
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

			{currentUser && currentUserPlace && stickyCardPosition !== 'hidden' && (
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
	);
};

export default StickyLeaderboard;

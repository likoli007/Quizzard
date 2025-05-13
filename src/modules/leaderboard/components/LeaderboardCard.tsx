'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type LeaderboardCardProps = {
	place: number;
	name: string;
	score: number;
	getMedal: (rank: number) => React.ReactNode;
	isCurrent?: boolean;
	className?: string;
};
export const LeaderboardCard = forwardRef<HTMLDivElement, LeaderboardCardProps>(
	({ place, name, score, getMedal, isCurrent, className }, ref) => (
		<div
			ref={ref}
			className={cn(
				'flex items-center justify-between rounded-xl border p-4 shadow-sm',
				isCurrent && 'border-primary bg-muted',
				className
			)}
		>
			<div className="flex w-24 items-center gap-2">
				<span className="w-5 text-right font-medium">{place}</span>
				{getMedal(place)}
			</div>
			<div className="flex-1 text-center font-medium">{name}</div>
			<Badge>{score} pts</Badge>
		</div>
	)
);

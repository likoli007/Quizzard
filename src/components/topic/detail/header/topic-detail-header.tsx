'use client';

import { Clock, Calendar, Star, StarOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TopicDetailHeaderDate from './status/topic-detail-header-date';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TopicDetailHeaderProps {
	title: string;
	category: string;
	readTime: string;
	publishedAt: string;
	updatedAt: string;
	userId: string | null;
}

export default function TopicDetailHeader({
	title,
	category,
	readTime,
	publishedAt,
	updatedAt,
	userId
}: TopicDetailHeaderProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const toggleFavorite = () => setIsFavorite(f => !f);

	return (
		<div className="mb-8">
			<div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
				<Button
					variant="outline"
					onClick={toggleFavorite}
					className="flex items-center gap-2"
				>
					{isFavorite ? (
						<Star className="h-4 w-4" color="#FFBF00" fill="#FFBF00" />
					) : (
						<Star className="h-4 w-4" />
					)}
				</Button>
			</div>

			<div className="mb-8 flex flex-wrap gap-4">
				<Badge>{category}</Badge>
				<div className="text-muted-foreground flex items-center gap-1 text-sm">
					<Clock className="h-4 w-4" />
					<span>{readTime} min read</span>
				</div>
				<div className="flex items-center gap-4">
					<TopicDetailHeaderDate
						text="Published"
						date={publishedAt}
						icon={<Calendar className="h-4 w-4" />}
					/>
					{updatedAt != publishedAt && (
						<TopicDetailHeaderDate text="Updated" date={updatedAt} />
					)}
				</div>
				<div className="text-muted-foreground text-sm">
					By: {userId ?? 'Unknown'}
				</div>
			</div>
		</div>
	);
}

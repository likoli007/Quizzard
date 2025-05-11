'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TopicCard {
	id: string;
	title: string;
	description?: string | null;
	content: string;
	category: string;
	readTime: string;
}

interface TopicCardProps {
	topic: TopicCard;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
	const [isFavorite, setIsFavorite] = useState(false);
	const toggleFavorite = () => setIsFavorite(f => !f);
	return (
		<Card className="flex flex-col">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div>
						<CardTitle>{topic.title}</CardTitle>
						{topic.description && (
							<CardDescription>{topic.description}</CardDescription>
						)}
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={toggleFavorite}
					>
						{isFavorite ? (
							<Star className="h-4 w-4" color="#FFBF00" fill="#FFBF00" />
						) : (
							<Star className="h-4 w-4" />
						)}
						<span className="sr-only">Favorite</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="flex-grow">
				<div className="mb-4 flex items-center gap-2">
					<Badge>{topic.category}</Badge>
					<span className="text-muted-foreground text-xs">
						{topic.readTime} min read
					</span>
				</div>
			</CardContent>
			<CardFooter>
				<Button asChild className="w-full">
					<Link href={`/topics/${topic.id}`}>Read Article</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

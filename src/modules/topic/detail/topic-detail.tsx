'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Topic } from '@/db/schema/topics';
import TopicDetailHeader from './header/topic-detail-header';
import TopicDetailFooter from './footer/topic-detail-footer';

interface TopicDetailProps {
	topic: Topic;
}

export default function TopicDetail({ topic }: TopicDetailProps) {
	return (
		<div className="container mx-auto px-4 py-8">
			<Button variant="ghost" asChild className="mb-4">
				<Link href="/topics" className="flex items-center gap-2">
					<ArrowLeft className="h-4 w-4" />
					Back to Topics
				</Link>
			</Button>

			<TopicDetailHeader
				id={topic.id}
				title={topic.title}
				category={topic.category}
				readTime={topic.readTime}
				publishedAt={topic.publishedAt}
				updatedAt={topic.updatedAt}
				userId={topic.userId}
			/>

			<article
				className="prose prose-lg dark:prose-invert mb-12 max-w-none"
				dangerouslySetInnerHTML={{ __html: topic.content }}
			/>

			<TopicDetailFooter id={topic.id} />
		</div>
	);
}

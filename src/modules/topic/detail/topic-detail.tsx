'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Topic } from '@/db/schema/topics';

import TopicDetailHeader from './header/topic-detail-header';
import TopicDetailFooter from './footer/topic-detail-footer';
import { BackButton } from '@/components/common/back-button';

type TopicDetailProps = {
	topic: Topic;
};
const TopicDetail = ({ topic }: TopicDetailProps) => (
	<div className="container mx-auto px-4 py-8">
		<BackButton text="Back to Topics" href="/topics" />

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

export default TopicDetail;

'use client';

import { useSession } from 'next-auth/react';

import type { Topic } from '@/db/schema/topics';
import { BackButton } from '@/components/common/back-button';

import { type TopicQuizPreview } from '../types';

import TopicDetailHeader from './header/topic-detail-header';
import TopicDetailFooter from './footer/topic-detail-footer';
import { QuizCard } from './quiz-card/quiz-card';

type TopicDetailProps = {
	topic: Topic;
	quizzes: TopicQuizPreview[];
};
const TopicDetail = ({ topic, quizzes }: TopicDetailProps) => {
	const { data: session } = useSession();
	const currentUserId = session?.user?.id;
	const isOwner = currentUserId === topic.userId;

	return (
		<div className="container mx-auto px-4 py-8">
			<BackButton text="Back to Topics" href="/topics" />

			<TopicDetailHeader topic={topic} />

			<article
				className="prose prose-lg dark:prose-invert mb-12 max-w-none"
				dangerouslySetInnerHTML={{ __html: topic.content }}
			/>

			<section className="space-y-6">
				{quizzes.length > 0 ? (
					quizzes.map(quiz => (
						<QuizCard key={quiz.id} quiz={quiz} isOwner={isOwner} />
					))
				) : (
					<p className="text-muted-foreground text-center">
						No quizzes have been created for this topic yet.
					</p>
				)}
			</section>

			<TopicDetailFooter id={topic.id} />
		</div>
	);
};

export default TopicDetail;

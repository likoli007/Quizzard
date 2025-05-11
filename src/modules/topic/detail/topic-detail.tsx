'use client';

import type { Topic } from '@/db/schema/topics';

import TopicDetailHeader from './header/topic-detail-header';
import TopicDetailFooter from './footer/topic-detail-footer';
import { BackButton } from '@/components/common/back-button';
import { QuizCard } from './quiz-card/quiz-card';
import { TopicQuizPreview } from '../types';

type TopicDetailProps = {
	topic: Topic;
	quizzes: TopicQuizPreview[];
};
export default function TopicDetail({ topic, quizzes }: TopicDetailProps) {
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
					quizzes.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)
				) : (
					<p className="text-muted-foreground text-center">
						No quizzes have been created for this topic yet.
					</p>
				)}
			</section>

			<TopicDetailFooter id={topic.id} />
		</div>
	);
}

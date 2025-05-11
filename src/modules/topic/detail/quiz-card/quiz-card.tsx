'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TopicQuizPreview } from '../../types';

type QuizCardProps = { quiz: TopicQuizPreview };

export function QuizCard({ quiz }: QuizCardProps) {
	return (
		<Card className="w-full">
			<CardContent className="flex flex-row items-center justify-between">
				<div className="flex flex-col gap-2">
					<p className="text-lg">{quiz.title}</p>
					{quiz.description && (
						<p className="text-muted-foreground text-md line-clamp-2 break-words text-ellipsis">
							{quiz.description}
						</p>
					)}
					<p className="text-muted-foreground text-sm">
						Time limit: {quiz.timeLimit} min
					</p>
				</div>
				<div className="flex flex-col items-center justify-center gap-2">
					<Button asChild variant="default">
						<Link href={`/quiz/${quiz.id}`}>Take Quiz</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

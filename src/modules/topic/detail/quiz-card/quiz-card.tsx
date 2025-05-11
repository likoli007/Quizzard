'use client';

import Link from 'next/link';
import { Delete } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { type TopicQuizPreview } from '../../types';

import { DeleteQuizButton } from './quiz-delete-button';

type QuizCardProps = { quiz: TopicQuizPreview; isOwner: boolean };

export const QuizCard = ({ quiz, isOwner }: QuizCardProps) => (
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
				{isOwner && (
					<Button asChild variant="outline">
						<Link href={`/quiz/${quiz.id}/edit`}>Edit</Link>
					</Button>
				)}

				{isOwner && <DeleteQuizButton quizId={quiz.id} />}

				<Button asChild variant="default">
					<Link href={`/quiz/${quiz.id}`}>Take Quiz</Link>
				</Button>
			</div>
		</CardContent>
	</Card>
);

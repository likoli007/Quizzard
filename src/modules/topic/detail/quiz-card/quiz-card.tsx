'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { type TopicQuizPreview } from '../../types';

import { DeleteButton } from '@/components/common/delete-button';
import { deleteQuiz } from '@/app/server-actions/quizzes';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type QuizCardProps = { quiz: TopicQuizPreview; isOwner: boolean };

export const QuizCard = ({ quiz, isOwner }: QuizCardProps) => {
	const [isPending, start] = useTransition();
	const router = useRouter();

	const handleDelete = () =>
		start(async () => {
			await deleteQuiz(quiz.id, quiz.topicId);
			router.refresh();
		});

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
						Time limit: {quiz.timeLimit / 60} min
					</p>
				</div>
				<div className="flex flex-col items-center justify-center gap-2">
					{isOwner && (
						<Button asChild variant="outline" className="w-full">
							<Link href={`/quiz/${quiz.id}/edit`}>Edit</Link>
						</Button>
					)}

					{isOwner && (
						<DeleteButton
							title="Delete quiz"
							description="Are you sure you want to delete this quiz?"
							deleteAction={handleDelete}
						>
							<Button variant="destructive" className="w-full">
								Delete
							</Button>
						</DeleteButton>
					)}

					<Button asChild variant="default" className="w-full">
						<Link href={`/quiz/${quiz.id}`}>Take Quiz</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

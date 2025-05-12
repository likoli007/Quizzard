'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction
} from '@/components/ui/alert-dialog';
import { deleteQuiz } from '@/app/server-actions/quizzes';

type Props = {
	quizId: string;
};

export const DeleteQuizButton = ({ quizId }: Props) => {
	const router = useRouter();
	const [isPending, start] = useTransition();

	const handleDelete = () =>
		start(async () => {
			await deleteQuiz(quizId);
			router.refresh();
		});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" disabled={isPending}>
					{isPending ? 'Deleting…' : 'Delete'}
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete quiz?</AlertDialogTitle>
					<AlertDialogDescription>
						This action permanently removes the quiz and cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} disabled={isPending}>
						Yes, delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

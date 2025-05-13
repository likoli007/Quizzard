'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

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

type DeleteButtonProps = React.PropsWithChildren<{
	children: React.ReactNode;
	title: string;
	description: string;
	cancel?: string;
	confirm?: string;
	deleteAction: () => void;
}>;

export const DeleteButton = ({
	children,
	title,
	description,
	cancel,
	confirm,
	deleteAction
}: DeleteButtonProps) => {
	const router = useRouter();
	const [isPending, start] = useTransition();

	const handleDelete = () =>
		start(async () => {
			deleteAction();
			router.refresh();
		});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>
						{cancel || 'Cancel'}
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} disabled={isPending}>
						{confirm || 'Yes, delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

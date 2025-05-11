'use client';

import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { CreateTopicForm } from '../../create-form/topic-create-form';
import { useRouter } from 'next/navigation';
import { Topic } from '@/db/schema/topics';

type TopicDetailUpdateDialogProps = {
	topic: Topic;
	open: boolean;
	setIsEditOpen: (open: boolean) => void;
	onSubmitAction?: () => void;
};

export const TopicDetailUpdateDialog = ({
	topic,
	open,
	setIsEditOpen,
	onSubmitAction
}: TopicDetailUpdateDialogProps) => {
	const router = useRouter();
	return (
		<Dialog open={open} onOpenChange={setIsEditOpen}>
			<DialogContent className="max-h-10/12 overflow-y-scroll">
				<DialogHeader>
					<DialogTitle>Edit Topic</DialogTitle>
				</DialogHeader>
				<CreateTopicForm
					userId={topic.userId!}
					topic={topic}
					onSubmitAction={onSubmitAction}
				/>
				<DialogClose asChild>
					<Button variant="ghost" className="mt-4">
						Close
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
};

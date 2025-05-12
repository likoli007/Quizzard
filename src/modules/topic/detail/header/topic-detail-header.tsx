import { Calendar, Clock, Edit2, Medal, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import TopicDetailHeaderDate from './status/topic-detail-header-date';
import { toast } from 'sonner';
import { deleteTopic } from '@/app/server-actions/topics/topics';
import { useRouter } from 'next/navigation';
import type { Topic } from '@/db/schema/topics';
import { TopicDetailUpdateDialog } from '../update-dialog/topic-detail-update-dialog';
import { DeleteButton } from '@/components/common/delete-button';

type TopicDetailHeaderProps = {
	topic: Topic;
};

export default ({ topic }: TopicDetailHeaderProps) => {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const toggleFavorite = () => setIsFavorite(f => !f);
	const router = useRouter();

	const handleDelete = async () => {
		try {
			await deleteTopic(topic.id);
			toast.success('Topic deleted');
			router.push('/topics');
		} catch (err: any) {
			// toast.error('Failed to delete');
			toast.error(err.message);
		}
	};

	return (
		<>
			<div className="mb-8">
				<div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
					<h1 className="text-3xl font-bold md:text-4xl">{topic.title}</h1>
					<div className="flex space-x-2">
						<Link href={`${topic.id}/leaderboard`}>
							<Button variant="outline" className="items-center gap-2">
								<Medal className="h-4 w-4" />
							</Button>
						</Link>
						<Button
							variant="outline"
							className="items-center gap-2"
							onClick={() => {
								setIsEditOpen(true);
							}}
						>
							<Edit2 className="h-4 w-4" />
						</Button>

						<DeleteButton
							title="Delete topic"
							description="Are you sure you want to delete this topic?"
							deleteAction={handleDelete}
						>
							<Button variant="destructive" className="flex items-center gap-2">
								<Trash2 className="h-4 w-4" />
							</Button>
						</DeleteButton>
						<Button
							variant="outline"
							onClick={toggleFavorite}
							className="flex items-center gap-2"
						>
							{isFavorite ? (
								<Star className="h-4 w-4" color="#FFBF00" fill="#FFBF00" />
							) : (
								<Star className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				<div className="mb-8 flex flex-wrap gap-4">
					<Badge>{topic.category}</Badge>
					<div className="text-muted-foreground flex items-center gap-1 text-sm">
						<Clock className="h-4 w-4" />
						<span>{topic.readTime} min read</span>
					</div>
					<div className="flex items-center gap-4">
						<TopicDetailHeaderDate
							text="Published"
							date={topic.publishedAt}
							Icon={Calendar}
						/>
						{topic.updatedAt !== topic.publishedAt && (
							<TopicDetailHeaderDate text="Updated" date={topic.updatedAt} />
						)}
					</div>
					<div className="text-muted-foreground text-sm">
						By: {topic.userId ?? 'Unknown'}
					</div>
				</div>
			</div>
			<TopicDetailUpdateDialog
				topic={topic}
				open={isEditOpen}
				setIsEditOpen={setIsEditOpen}
				onSubmitAction={() => {
					setIsEditOpen(false);
				}}
			/>
		</>
	);
};

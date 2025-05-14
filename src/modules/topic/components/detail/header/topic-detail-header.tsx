import { Calendar, Clock, Edit2, Medal, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { deleteTopic } from '@/app/server-actions/topics/topics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Topic } from '@/db/schema/topics';
import { DeleteButton } from '@/components/common/delete-button';
import { useSession } from 'next-auth/react';
import TopicDetailHeaderDate from './status/topic-detail-header-date';

type TopicWithAuthor = Topic & {
	authorName: string | null;
};

type TopicDetailHeaderProps = {
	topic: TopicWithAuthor;
};

export default ({ topic }: TopicDetailHeaderProps) => {
	const [isFavorite, setIsFavorite] = useState(false);
	const toggleFavorite = () => setIsFavorite(f => !f);
	const router = useRouter();
	const { data: session } = useSession();

	const handleDelete = async () => {
		try {
			await deleteTopic(topic.id);
			toast.success('Topic deleted');
			router.push('/topics');
		} catch (err: any) {
			toast.error('Failed to delete');
		}
	};

	return (
		<div className="mb-8">
			<div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<h1 className="text-3xl font-bold md:text-4xl">{topic.title}</h1>
				<div className="flex space-x-2">
					<Link href={`${topic.id}/leaderboard`}>
						<Button variant="outline" className="items-center gap-2">
							<Medal className="h-4 w-4" />
						</Button>
					</Link>

					<Link href={`${topic.id}/edit`}>
						<Button variant="outline" className="items-center gap-2">
							<Edit2 className="h-4 w-4" />
						</Button>
					</Link>
					{session?.user?.id === topic.userId && (
						<>
							<Link href={`${topic.id}/edit`}>
								<Button variant="outline" className="items-center gap-2">
									<Edit2 className="h-4 w-4" />
								</Button>
							</Link>

							<DeleteButton
								title="Delete topic"
								description="Are you sure you want to delete this topic?"
								deleteAction={handleDelete}
							>
								<Button
									variant="destructive"
									className="flex items-center gap-2"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</DeleteButton>
						</>
					)}
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
				{topic.category && <Badge>{topic.category}</Badge>}
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
					By: {topic.authorName ?? 'Unknown'}
				</div>
			</div>
		</div>
	);
};

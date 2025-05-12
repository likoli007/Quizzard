import Link from 'next/link';

import { PageHeading } from '@/components/common/page-heading';
import { Button } from '@/components/ui/button';
import { getTopics } from '@/modules/topic/server/query';
import { TopicCard } from '@/modules/topic/card/topic-card';
import { auth } from '@/auth';
import { getFavoriteTopicIds } from '@/app/server-actions/topics/topics';

const TopicsPage = async () => {
	const allTopics = await getTopics();
	const session = await auth();
	let userId = null;

	if (session?.user?.id !== undefined) {
		userId = session.user.id as string;
	}

	let favoriteIds: Set<string> | null = null;
	if (userId) {
		favoriteIds = await getFavoriteTopicIds(userId);
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<PageHeading
				heading="Browse Topics"
				subheading="Explore our collection of educational topics and expand your
					knowledge."
			/>
			<div className="mb-8 flex flex-wrap gap-4">
				{session?.user && (
					<Button asChild size="lg">
						<Link href="/create">+ Add topic</Link>
					</Button>
				)}
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{allTopics.map(topic => (
					<TopicCard
						key={topic.id}
						topic={topic}
						userId={userId}
						isInitiallyFavorite={
							favoriteIds ? favoriteIds.has(topic.id) : false
						}
					/>
				))}
			</div>
		</div>
	);
};

export default TopicsPage;

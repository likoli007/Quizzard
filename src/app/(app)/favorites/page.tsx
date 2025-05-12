import { redirect } from 'next/navigation';

import { TopicCard } from '@/modules/topic/card/topic-card';
import { getFavoriteTopics } from '@/modules/topic/server/query';
import { auth } from '@/auth';

const FavoritesPage = async () => {
	const session = await auth();

	if (!session) {
		redirect('/auth/login');
	}

	if (session.user?.id === undefined) {
		redirect('/auth/login');
	}

	const userId = session.user.id as string;

	const allTopics = await getFavoriteTopics(userId);

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-8 flex flex-col items-center justify-center space-y-4 text-center">
				<h1 className="text-4xl font-bold tracking-tight">Your Favorites</h1>
				<p className="text-muted-foreground max-w-[700px] text-lg">
					Access your saved articles and topics in one place.
				</p>
			</div>

			{allTopics.length === 0 ? (
				<p className="text-muted-foreground text-center">
					You haven’t favorited any topics yet! Explore our collection and add
					your favorites!
				</p>
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{allTopics.map(topic => (
						<TopicCard
							key={topic.id}
							topic={topic}
							userId={userId}
							isInitiallyFavorite
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default FavoritesPage;

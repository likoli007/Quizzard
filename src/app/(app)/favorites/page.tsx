import { TopicCard } from '@/modules/topic/card/topic-card';
import { getTopics } from '@/modules/topic/server/query';

export default async function FavoritesPage() {
	const allTopics = await getTopics();

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-8 flex flex-col items-center justify-center space-y-4 text-center">
				<h1 className="text-4xl font-bold tracking-tight">Your Favorites</h1>
				<p className="text-muted-foreground max-w-[700px] text-lg">
					Access your saved articles and topics in one place.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{allTopics.map(topic => (
					<TopicCard key={topic.id} topic={topic} />
				))}
			</div>
		</div>
	);
}

// app/topics/page.tsx
import Link from 'next/link';

import { PageHeading } from '@/components/common/page-heading';
import { Button } from '@/components/ui/button';
import { getTopics } from '@/modules/topic/server/query';
import { TopicCard } from '@/modules/topic/card/topic-card';

const TopicsPage = async () => {
	const allTopics = await getTopics();

	return (
		<div className="container mx-auto px-4 py-12">
			<PageHeading
				heading="Browse Topics"
				subheading="Explore our collection of educational topics and expand your
					knowledge."
			/>
			<div className="mb-8 flex flex-wrap gap-4">
				<Button asChild size="lg">
					<Link href="/create">+ Add topic</Link>
				</Button>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{allTopics.map(topic => (
					<TopicCard key={topic.id} topic={topic} />
				))}
			</div>
		</div>
	);
};

export default TopicsPage;

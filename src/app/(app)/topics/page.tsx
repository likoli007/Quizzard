// app/topics/page.tsx
import { getTopics } from '@/app/server-actions/topics';
import { TopicCard } from '@/components/topic/card/topic-card';
import { PageHeading } from '@/components/common/page-heading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function TopicsPage() {
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
					<Link href={`/topics/create`}>+ Add topic</Link>
				</Button>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{allTopics.map(topic => (
					<TopicCard key={topic.id} topic={topic} />
				))}
			</div>
		</div>
	);
}

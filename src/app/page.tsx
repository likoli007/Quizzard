import { HomeCard } from '@/components/home/card/home-card';
import { homeCards } from '@/components/home/home-cards';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Home = () => (
	<div className="container mx-auto px-4 py-12">
		<div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
			<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
				Quizzard Platform
			</h1>
			<p className="text-muted-foreground max-w-[700px] text-lg">
				Learn new topics, create quizzes, and test your knowledge in a fun and
				interactive way.
			</p>
			<div className="mt-6 flex flex-wrap justify-center gap-4">
				<Button asChild size="lg">
					<Link href="/topics">Browse Topics</Link>
				</Button>
				<Button asChild variant="outline" size="lg">
					<Link href="/create">Create Quiz</Link>
				</Button>
			</div>
		</div>

		<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{homeCards.map(card => (
				<HomeCard
					key={card.title}
					Icon={card.Icon}
					title={card.title}
					description={card.subtitle}
					content={card.content}
					linkHref={card.linkHref}
					linkLabel={card.linkLabel}
				/>
			))}
		</div>
	</div>
);

export default Home;

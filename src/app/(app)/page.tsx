'use client';

import Link from 'next/link';

import { HomeCard } from '@/modules/home/components/card/home-card';
import { homeCards } from '@/modules/home/home-cards';
import { Button } from '@/components/ui/button';
import { Vortex } from '@/components/ui/vortex';

const Home = () => (
	<div className="mx-auto h-screen w-[calc(100%-4rem)] overflow-hidden rounded-md bg-gray-200">
		<Vortex
			backgroundColor="#E5E7EB"
			rangeY={800}
			particleCount={200}
			rangeRadius={5}
			rangeSpeed={5}
			className="flex h-full w-full flex-col items-center justify-center px-2 py-4 md:px-10"
		>
			<div className="container mx-auto px-4 py-12">
				<div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Quizzard Platform
					</h1>
					<p className="text-muted-foreground max-w-[700px] text-lg">
						Learn new topics, create quizzes, and test your knowledge in a fun
						and interactive way.
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
		</Vortex>
	</div>
);

export default Home;

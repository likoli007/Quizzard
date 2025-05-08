// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import {
// 	ArrowLeft,
// 	Star,
// 	StarOff,
// 	Clock,
// 	Calendar,
// 	Share2
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// // Mock data for a single topic
// const topicData = {
// 	id: '1',
// 	title: 'Introduction to Marine Biology',
// 	content: `
//     <h2>The Fascinating World of Marine Biology</h2>
//     <p>Marine biology is the scientific study of organisms that live in saltwater environments such as oceans, seas, and estuaries. It involves understanding the biology of marine species, their behaviors and interactions with the environment, and the chemistry of the oceans.</p>

//     <h3>The Importance of Oceans</h3>
//     <p>Oceans cover more than 70% of Earth's surface and contain about 97% of Earth's water. They play a crucial role in regulating the Earth's climate, generating oxygen, and providing food and resources for humans and countless other species.</p>

//     <h3>Marine Ecosystems</h3>
//     <p>Marine ecosystems are among the largest and most diverse on Earth. They include:</p>
//     <ul>
//       <li><strong>Coral Reefs:</strong> Often called the "rainforests of the sea," coral reefs are home to approximately 25% of all marine species.</li>
//       <li><strong>Mangrove Forests:</strong> These coastal ecosystems provide breeding grounds for many marine species and protect coastlines from erosion.</li>
//       <li><strong>Deep Sea:</strong> The deep sea remains one of the least explored areas on Earth, with new species being discovered regularly.</li>
//       <li><strong>Open Ocean:</strong> The pelagic zone is home to many migratory species, from tiny plankton to massive whales.</li>
//     </ul>

//     <h3>Marine Biodiversity</h3>
//     <p>The oceans are home to an incredible diversity of life, from microscopic plankton to the largest animal on Earth, the blue whale. Scientists estimate that between 700,000 and 1 million species live in the oceans, with many more yet to be discovered.</p>

//     <h3>Threats to Marine Ecosystems</h3>
//     <p>Marine ecosystems face numerous threats, including:</p>
//     <ul>
//       <li>Climate change and ocean acidification</li>
//       <li>Overfishing and destructive fishing practices</li>
//       <li>Plastic pollution and other forms of marine debris</li>
//       <li>Habitat destruction and coastal development</li>
//       <li>Oil spills and chemical pollution</li>
//     </ul>

//     <h3>Conservation Efforts</h3>
//     <p>Marine biologists work to understand and protect marine ecosystems through research, conservation initiatives, and public education. Marine protected areas, sustainable fishing practices, and pollution reduction efforts are all important strategies for preserving ocean health.</p>

//     <h2>Conclusion</h2>
//     <p>Marine biology offers a window into an extraordinary world that remains largely unexplored. By studying marine life and ecosystems, we can better understand and protect these vital environments for future generations.</p>
//   `,
// 	category: 'Science',
// 	publishedDate: 'March 15, 2023',
// 	readTime: '10 min',
// 	author: 'Dr. Jane Smith',
// 	hasQuiz: true
// };

// export default function TopicDetailPage({
// 	params
// }: {
// 	params: { id: string };
// }) {
// 	const [isFavorited, setIsFavorited] = useState(false);

// 	const toggleFavorite = () => {
// 		setIsFavorited(!isFavorited);
// 		// In a real app, you would save this to a database or local storage
// 	};

// 	return (
// 		<div className="container mx-auto px-4 py-8">
// 			<div className="mb-8">
// 				<Button variant="ghost" asChild className="mb-4">
// 					<Link href="/topics" className="flex items-center gap-2">
// 						<ArrowLeft className="h-4 w-4" />
// 						Back to Topics
// 					</Link>
// 				</Button>

// 				<div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
// 					<h1 className="text-3xl font-bold md:text-4xl">{topicData.title}</h1>
// 					<Button
// 						variant="outline"
// 						onClick={toggleFavorite}
// 						className="flex items-center gap-2"
// 					>
// 						{isFavorited ? (
// 							<>
// 								<StarOff className="h-4 w-4" />
// 								Remove from Favorites
// 							</>
// 						) : (
// 							<>
// 								<Star className="h-4 w-4" />
// 								Add to Favorites
// 							</>
// 						)}
// 					</Button>
// 				</div>

// 				<div className="mb-8 flex flex-wrap gap-4">
// 					<Badge className="text-sm">{topicData.category}</Badge>
// 					<div className="text-muted-foreground flex items-center gap-1 text-sm">
// 						<Clock className="h-4 w-4" />
// 						<span>{topicData.readTime} read</span>
// 					</div>
// 					<div className="text-muted-foreground flex items-center gap-1 text-sm">
// 						<Calendar className="h-4 w-4" />
// 						<span>Published: {topicData.publishedDate}</span>
// 					</div>
// 					<div className="text-muted-foreground text-sm">
// 						By: {topicData.author}
// 					</div>
// 				</div>
// 			</div>

// 			<div
// 				className="prose prose-lg dark:prose-invert mb-12 max-w-none"
// 				dangerouslySetInnerHTML={{ __html: topicData.content }}
// 			/>

// 			<div className="flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
// 				<div className="flex gap-2">
// 					<Button variant="outline" size="sm">
// 						<Share2 className="mr-2 h-4 w-4" />
// 						Share Article
// 					</Button>
// 				</div>
// 				{topicData.hasQuiz && (
// 					<Button asChild size="lg">
// 						<Link href={`/quiz/${topicData.id}`}>Take Quiz</Link>
// 					</Button>
// 				)}
// 			</div>
// 		</div>
// 	);
// }
// app/topics/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getTopic } from '@/app/server-actions/topics';
import TopicDetail from '@/components/topic/detail/topic-detail';

export default async function TopicDetailPage({
	params
}: {
	params: { id: string };
}) {
	const topic = await getTopic(await params.id);

	if (!topic) return notFound();

	return <TopicDetail topic={topic} />;
}

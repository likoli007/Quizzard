import Link from 'next/link';
import { Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { type QuizWithQuestionsCount } from '../../server/types';

type QuizCardProps = {
	quiz: QuizWithQuestionsCount;
};

export const QuizCard = ({ quiz }: QuizCardProps) => (
	<Card key={quiz.id} className="flex flex-col">
		<CardHeader>
			<CardTitle>{quiz.title}</CardTitle>
		</CardHeader>

		<CardContent className="flex-1 space-y-2">
			{quiz.description && (
				<p className="text-muted-foreground text-sm">{quiz.description}</p>
			)}
			<div className="flex flex-wrap gap-2">
				<Badge variant="outline">
					<Clock className="h-4 w-4" /> {quiz.timeLimit}s
				</Badge>
				<Badge variant="outline">TF: {quiz.tfCount}</Badge>
				<Badge variant="outline">MC: {quiz.mcCount}</Badge>
			</div>
		</CardContent>

		<CardFooter className="pt-4">
			<Link href={`/quiz/${quiz.id}`} className="w-full">
				<Button asChild size="sm" className="w-full">
					<span>Start Quiz</span>
				</Button>
			</Link>
		</CardFooter>
	</Card>
);

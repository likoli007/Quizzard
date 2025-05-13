import { BarChart, BookOpen, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatDate, formatDateWithTime } from '@/components/utils/date';
import { type QuizAttempt } from '@/db/schema/quizAttempts';
import { getTopic } from '@/modules/topic/server/query';
import { QuizWithDetails } from '@/modules/quiz/server/types';
import { auth } from '@/auth';

type QuizHistoryCard = {
	quiz: QuizWithDetails;
	quizAttempt: QuizAttempt;
	totalQuestions: number;
};

export const QuizHistoryCard = async ({
	quiz,
	quizAttempt,
	totalQuestions
}: QuizHistoryCard) => {
	const topic = await getTopic(quiz.topicId);
	const percentage = Math.round((quizAttempt.score / totalQuestions) * 100);
	const isPassing = percentage >= 60;
	return (
		<Card key={quiz.id}>
			<CardHeader>
				<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
					<div>
						<CardTitle>{quiz.title}</CardTitle>
						<CardDescription className="mt-1 flex items-center gap-1">
							<BookOpen className="h-3 w-3" />
							{topic.title}
						</CardDescription>
					</div>
					<Badge variant={isPassing ? 'default' : 'destructive'}>
						{percentage}% Score
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-col justify-between gap-4 sm:flex-row">
					<div className="text-muted-foreground flex items-center gap-2 text-sm">
						<Calendar className="h-4 w-4" />
						<span>
							{formatDate(quizAttempt.startedAt)} at{' '}
							{formatDateWithTime(quizAttempt.startedAt)}
						</span>
					</div>
					<div className="text-muted-foreground flex items-center gap-2 text-sm">
						<Clock className="h-4 w-4" />
						<span>Time spent: {quizAttempt.timeSpent}</span>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>
							Score: {quizAttempt.score}/{totalQuestions}
						</span>
						<span>{percentage}%</span>
					</div>
					<Progress value={percentage} className="h-2" />
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-4 sm:flex-row">
				<Button asChild variant="outline" className="w-full sm:w-auto">
					<Link href={`/topics/${quiz.topicId}`}>Review Topic</Link>
				</Button>
				<Button asChild variant="outline" className="w-full sm:w-auto">
					<Link
						href={`/quiz/${quiz.id}/results?score=${quizAttempt.score}&total=${totalQuestions}`}
					>
						<BarChart className="mr-2 h-4 w-4" />
						View Results
					</Link>
				</Button>
				<Button asChild className="w-full sm:w-auto">
					<Link href={`/quiz/${quiz.id}`}>Try Again</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

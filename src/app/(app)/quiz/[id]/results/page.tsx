import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { quizAnswers } from '@/db/schema/quizAnswers';
import { getQuizWithDetailsAndAnswers } from '@/modules/quiz/server/query';
import { PageHeading } from '@/components/common/page-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	type QuizQuestionType,
	type QuizWithDetailsAndAnswers
} from '@/modules/quiz/server/types';
import { auth } from '@/auth';
import { QuizResultCard } from '@/modules/quiz/components/results/card/quiz-results-card';

type ResultsPageProps = { params: Promise<{ id: string }> };

const QuizResultsPage = async ({ params }: ResultsPageProps) => {
	const quizId = (await params).id;

	const session = await auth();
	if (!session?.user?.id) redirect('/auth/login');

	const quiz: QuizWithDetailsAndAnswers | undefined =
		await getQuizWithDetailsAndAnswers(quizId);
	if (!quiz) return notFound();
	if (quiz.attempts.length === 0) {
		return (
			<div className="container mx-auto px-4 py-12">
				<PageHeading
					heading="No Attempts Yet"
					subheading="Take this quiz to see results."
				/>
				<Link href={`/quiz/${quizId}`}>
					<Button>Start Quiz</Button>
				</Link>
			</div>
		);
	}

	const latest = quiz.attempts[0];

	const rows = await db
		.select({
			questionId: quizAnswers.questionId,
			selectedAnswer: quizAnswers.selectedAnswer,
			isCorrect: quizAnswers.isCorrect
		})
		.from(quizAnswers)
		.where(eq(quizAnswers.quizAttemptId, latest.id));

	const answerMap = Object.fromEntries(
		rows.map(r => [
			r.questionId,
			{ selected: r.selectedAnswer, isCorrect: r.isCorrect }
		])
	);

	const tfQs = quiz.trueFalseQuestions ?? [];
	const mcQs = quiz.multipleChoiceQuestions ?? [];
	const totalQuestions = rows.length;
	const correctCount = quiz.attempts[0].score;
	const pct = totalQuestions
		? Math.round((correctCount / totalQuestions) * 100)
		: 0;

	const items = [
		...tfQs.map(q => ({
			type: 'TF' as QuizQuestionType,
			q,
			options: undefined
		})),
		...mcQs.map(q => ({
			type: 'MC' as QuizQuestionType,
			q,
			options: Array.isArray(q.options) ? q.options : JSON.parse(q.options)
		}))
	].sort((a, b) => a.q.order - b.q.order);

	return (
		<div className="container mx-auto space-y-8 px-4 py-12">
			<PageHeading
				heading={`Results: ${quiz.title}`}
				subheading={`You got ${correctCount}/${totalQuestions} (${pct}%)`}
			/>

			<div className="flex flex-wrap gap-2">
				<Badge variant="outline">Correct: {correctCount}</Badge>
				<Badge variant="outline">Total: {totalQuestions}</Badge>
				<Badge variant="outline">Percent: {pct}%</Badge>
				<Badge variant="outline">Time: {latest.timeSpent}s</Badge>
			</div>

			<div className="space-y-6">
				{items.map(({ type, q, options }, idx) => {
					const ans = answerMap[q.id] ?? { selected: null, isCorrect: false };
					const correctVal =
						type === 'TF'
							? (quiz.answers[q.id] as boolean)
							: (quiz.answers[q.id] as number);

					return (
						<QuizResultCard
							key={q.id}
							index={idx}
							type={type}
							quizId={quizId}
							topicId={quiz.topicId}
							questionText={q.questionText}
							userAnswer={ans}
							correctValue={correctVal}
							options={options}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default QuizResultsPage;

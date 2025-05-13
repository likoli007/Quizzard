import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

import { db } from '@/db';
import { quizAnswers } from '@/db/schema/quizAnswers';
import { getQuizWithDetailsAndAnswers } from '@/modules/quiz/server/query';
import { PageHeading } from '@/components/common/page-heading';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type QuizWithDetailsAndAnswers } from '@/modules/quiz/server/types';
import { auth } from '@/auth';

type ResultsPageProps = { params: { id: string } };

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
				{[
					...tfQs.map(q => ({ type: 'TF' as const, q })),
					...mcQs.map(q => ({ type: 'MC' as const, q }))
				]
					.sort((a, b) => a.q.order - b.q.order)
					.map((item, idx) => {
						const q = item.q;
						const ans = answerMap[q.id] ?? { selected: -1, isCorrect: false };

						if (item.type === 'TF') {
							const correctIdx = quiz.answers?.[q.id] === true ? 1 : 0;

							return (
								<Card key={q.id}>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle>{`Q${idx + 1}. ${q.questionText}`}</CardTitle>
											{ans.selected !== -1 ? (
												ans.isCorrect ? (
													<CheckCircle className="text-green-500" />
												) : (
													<XCircle className="text-red-500" />
												)
											) : (
												<MinusCircle className="text-gray-400" />
											)}
										</div>
									</CardHeader>

									<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div>
											<p className="mb-1 text-sm font-semibold">Your Answer</p>
											<Badge
												variant={
													ans.selected !== -1
														? ans.isCorrect
															? 'default'
															: 'secondary'
														: 'outline'
												}
											>
												{ans.selected === 1
													? 'True'
													: ans.selected === 0
														? 'False'
														: 'No Answer'}
											</Badge>
										</div>
										<div>
											<p className="mb-1 text-sm font-semibold">
												Correct Answer
											</p>
											<Badge variant="default">
												{correctIdx === 1 ? 'True' : 'False'}
											</Badge>
										</div>
									</CardContent>
								</Card>
							);
						}

						if (item.type === 'MC') {
							const correctIdx = (quiz.answers?.[q.id] as number) ?? -1;
							const mc = q as (typeof mcQs)[number];

							const opts: string[] = (() => {
								if (Array.isArray(mc.options)) return mc.options;

								if (typeof mc.options === 'string') {
									try {
										return JSON.parse(mc.options);
									} catch {
										return (mc.options as string)
											.split(',')
											.map(s => s.trim())
											.filter(Boolean);
									}
								}
								return [];
							})();

							const userAnswer =
								ans.selected !== null ? opts[ans.selected] : 'No Answer';
							const correctAnswer = opts[correctIdx];

							return (
								<Card key={q.id}>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle>{`Q${idx + 1}. ${q.questionText}`}</CardTitle>
											{ans.selected !== -1 ? (
												ans.isCorrect ? (
													<CheckCircle className="text-green-500" />
												) : (
													<XCircle className="text-red-500" />
												)
											) : (
												<MinusCircle className="text-gray-400" />
											)}
										</div>
									</CardHeader>

									<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div>
											<p className="mb-1 text-sm font-semibold">Your Answer</p>
											<Badge
												variant={
													ans.selected !== -1
														? ans.isCorrect
															? 'default'
															: 'secondary'
														: 'outline'
												}
											>
												{userAnswer}
											</Badge>
										</div>
										<div>
											<p className="mb-1 text-sm font-semibold">
												Correct Answer
											</p>
											<Badge variant="default">{correctAnswer}</Badge>
										</div>
									</CardContent>
								</Card>
							);
						}
					})}
			</div>

			<CardFooter className="flex gap-4">
				<Link href={`/quiz/${quizId}`}>
					<Button>Retry Quiz</Button>
				</Link>
				<Link href={`/topics/${quiz.topicId}`}>
					<Button variant="outline">Back to Topic</Button>
				</Link>
			</CardFooter>
		</div>
	);
};

export default QuizResultsPage;

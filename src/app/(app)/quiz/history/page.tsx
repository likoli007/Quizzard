import { redirect } from 'next/navigation';

import { QuizHistoryStatisticCard } from '@/modules/quiz/components/history/statistic-card/quiz-history-statistic-card';
import { getUserQuizzesWithDetails } from '@/modules/quiz/server/query';
import { QuizHistoryCard } from '@/modules/quiz/components/history/card/quiz-history-card';
import { auth } from '@/auth';

const QuizHistoryPage = async () => {
	const session = await auth();

	if (!session?.user?.id) {
		redirect('/auth/login');
	}

	const userId = session.user.id;
	const queryLimit = 4;

	const quizzes = await getUserQuizzesWithDetails(userId, queryLimit);

	const historyEntries = quizzes
		.flatMap(quiz => {
			const totalQuestions =
				(quiz.trueFalseQuestions?.length ?? 0) +
				(quiz.multipleChoiceQuestions?.length ?? 0);

			return quiz.attempts.map(attempt => ({ quiz, attempt, totalQuestions }));
		})
		.sort(
			(a, b) =>
				new Date(b.attempt.startedAt).getTime() -
				new Date(a.attempt.startedAt).getTime()
		);

	const totalQuizzes = historyEntries.length;
	const totalQuestions = historyEntries.reduce(
		(sum, entry) => sum + entry.totalQuestions,
		0
	);
	const totalCorrect = historyEntries.reduce(
		(sum, entry) => sum + entry.attempt.score,
		0
	);
	const averageScore = totalQuestions
		? Math.round((totalCorrect / totalQuestions) * 100)
		: 0;

	const quizStatCards = [
		{ title: 'Total Quizzes Taken', content: `${totalQuizzes}` },
		{ title: 'Average Score', content: `${averageScore}%` },
		{ title: 'Total Questions Answered', content: `${totalQuestions}` }
	];

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
				<h1 className="text-4xl font-bold tracking-tight">Quiz History</h1>
				<p className="text-muted-foreground max-w-[700px] text-lg">
					Track your progress and review your past quiz results.
				</p>
			</div>

			<div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
				{quizStatCards.map((card, idx) => (
					<QuizHistoryStatisticCard
						key={idx}
						title={card.title}
						content={card.content}
					/>
				))}
			</div>

			<h2 className="mb-6 text-2xl font-bold">Recent Quizzes</h2>

			<div className="space-y-6">
				{historyEntries.map(({ quiz, attempt, totalQuestions }) => (
					<QuizHistoryCard
						key={attempt.id}
						quiz={quiz}
						quizAttempt={attempt}
						totalQuestions={totalQuestions}
					/>
				))}
			</div>
		</div>
	);
};

export default QuizHistoryPage;

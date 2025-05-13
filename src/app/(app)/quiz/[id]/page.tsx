import { notFound, redirect } from 'next/navigation';

import { getQuizWithDetails } from '@/modules/quiz/server/query';
import QuizPageClient from '@/modules/quiz/components/QuizPageClient';
import { PageHeading } from '@/components/common/page-heading';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/auth';

type QuizPageProps = {
	params: Promise<{ id: string }>;
};

export default async function QuizPage({ params }: QuizPageProps) {
	const { id } = await params;
	const quiz = await getQuizWithDetails(id);
	if (!quiz) return notFound();

	const session = await auth();

	if (!session?.user?.id) {
		redirect('auth/login');
	}

	const userId = session.user.id;

	return (
		<div className="container mx-auto space-y-8 px-4 py-12">
			<PageHeading
				heading={quiz.title}
				subheading={quiz.description ?? undefined}
			/>

			<div className="flex flex-wrap items-center gap-4">
				<Badge variant="outline">Time limit: {quiz.timeLimit}s</Badge>
				<Badge variant="secondary">
					{quiz.trueFalseQuestions?.length ?? 0} TF &amp;{' '}
					{quiz.multipleChoiceQuestions?.length ?? 0} MC questions
				</Badge>
			</div>

			<Card className="p-6">
				<QuizPageClient quiz={quiz} userId={userId} />
			</Card>
		</div>
	);
}

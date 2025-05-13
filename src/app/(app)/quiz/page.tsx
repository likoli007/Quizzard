import { getAllQuizzes } from '@/modules/quiz/server/query';
import { PageHeading } from '@/components/common/page-heading';
import { QuizCard } from '@/modules/quiz/components/card/quiz-card';

export default async function QuizIndexPage() {
	const all = await getAllQuizzes();

	return (
		<div className="container mx-auto space-y-8 px-4 py-12">
			<PageHeading
				heading="All Quizzes"
				subheading="Browse and start any quiz you like."
			/>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{all.map(q => (
					<QuizCard quiz={q} />
				))}
			</div>
		</div>
	);
}

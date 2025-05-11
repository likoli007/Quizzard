import { notFound } from 'next/navigation';
import { getQuizWithDetails } from '@/modules/quiz/server/query';
import QuizPageClient from '@/modules/quiz/components/QuizPageClient';
import { PageHeading } from '@/components/common/page-heading';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;
  const quiz = await getQuizWithDetails(id);
  if (!quiz) return notFound();

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
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
        <QuizPageClient quiz={quiz} />
      </Card>
    </div>
  );
}

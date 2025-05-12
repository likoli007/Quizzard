import Link from 'next/link';
import { getAllQuizzes } from '@/modules/quiz/server/query';
import { PageHeading } from '@/components/common/page-heading';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function QuizIndexPage() {
  const all = await getAllQuizzes();

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <PageHeading
        heading="All Quizzes"
        subheading="Browse and start any quiz you like."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {all.map(q => (
          <Card key={q.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{q.title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-2">
              {q.description && (
                <p className="text-sm text-muted-foreground">
                  {q.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">⏱ {q.timeLimit}s</Badge>
                <Badge variant="outline">
                  TF: {q.trueFalseCount}
                </Badge>
                <Badge variant="outline">
                  MC: {q.multipleChoiceCount}
                </Badge>
              </div>
            </CardContent>

            <CardFooter className="pt-4">
              <Link href={`/quiz/${q.id}`} className="w-full">
                <Button asChild size="sm" className="w-full">
                  <span>Start Quiz</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

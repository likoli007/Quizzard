'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { QuizWithDetails } from '../server/types';
import { createQuizAttempt } from '@/app/server-actions/quiz/attempt';
import { submitQuizAnswer } from '@/app/server-actions/quiz/answer';

type Props = { quiz: QuizWithDetails; userId: string };

export default function QuizPageClient({ quiz, userId }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, boolean | number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(quiz.timeLimit);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (questionId: string, value: boolean | number) => {
    setAnswers(a => ({ ...a, [questionId]: value }));
  };
  const handleSubmit = async () => {
    const { attemptId } = await createQuizAttempt({
      quizId: quiz.id,
      userId: userId
    });
  
    await Promise.all(
      Object.entries(answers).map(([questionId, answer]) =>
        submitQuizAnswer({
          quizId: quiz.id,
          attemptId,
          questionId,
          answer,
        })
      )
    );
  
    router.push(`/quiz/${quiz.id}/results`);
  };

  const tfCount = quiz.trueFalseQuestions?.length ?? 0;
  const mcCount = quiz.multipleChoiceQuestions?.length ?? 0;
  const total = tfCount + mcCount;
  const answered = Object.keys(answers).length;
  const pctDone = total ? Math.round((answered / total) * 100) : 0;

  function ChoiceCard({
    onClick,
    selected,
    children,
    fluid = false
  }: {
    onClick(): void;
    selected: boolean;
    children: React.ReactNode;
    fluid?: boolean;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          fluid ? 'flex-1 text-center' : 'inline-block',
          'min-w-[6rem] rounded-md border px-3 py-1.5 text-sm transition-transform',
          selected
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:bg-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary active:scale-95'
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <Badge variant="outline">⏱ {timeLeft}s</Badge>
        <Badge variant="outline">
          {answered}/{total} answered
        </Badge>
      </div>
      <Progress value={pctDone} />

      {quiz.trueFalseQuestions?.map((q, i) => {
        const selTrue = answers[q.id] === true;
        const selFalse = answers[q.id] === false;
        return (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle>{`Q${i + 1}. ${q.questionText}`}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              <ChoiceCard
                fluid
                selected={selTrue}
                onClick={() => handleAnswer(q.id, true)}
              >
                True
              </ChoiceCard>
              <ChoiceCard
                fluid
                selected={selFalse}
                onClick={() => handleAnswer(q.id, false)}
              >
                False
              </ChoiceCard>
            </CardContent>
          </Card>
        );
      })}

      {quiz.multipleChoiceQuestions?.map((q, idx) => {
        const questionNumber = tfCount + idx + 1;

        const raw = q.options as unknown;
        let options: string[];
        if (Array.isArray(raw)) {
          options = raw;
        } else if (typeof raw === 'string') {
          try {
            options = JSON.parse(raw);
          } catch {
            options = raw.split(',').map(s => s.trim()).filter(Boolean);
          }
        } else {
          options = [];
        }

        return (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle>{`Q${questionNumber}. ${q.questionText}`}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {options.map((opt, j) => (
                <ChoiceCard
                  key={j}
                  selected={answers[q.id] === j}
                  onClick={() => handleAnswer(q.id, j)}
                >
                  {opt}
                </ChoiceCard>
              ))}
            </CardContent>
          </Card>
        );
      })}

      <div className="text-right">
        <Button type="submit" disabled={answered < total} size="sm">
          Submit Quiz
        </Button>
      </div>
    </form>
  );
}

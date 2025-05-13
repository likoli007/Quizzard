'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createQuizAttempt } from '@/app/server-actions/quiz/attempt';
import { submitQuizAnswer } from '@/app/server-actions/quiz/answer';

import { type QuizWithDetails } from '../server/types';

type Props = { quiz: QuizWithDetails; userId: string };

/* ------------------------------------------------------------------ */
/*  One flat union type to hold either question kind after merging    */
/* ------------------------------------------------------------------ */
type FlatQuestion =
	| {
			type: 'TF';
			id: string;
			order: number;
			text: string;
	  }
	| {
			type: 'MC';
			id: string;
			order: number;
			text: string;
			options: string[];
	  };

const QuizPageClient: React.FC<Props> = ({ quiz, userId }) => {
	const router = useRouter();

	const questions: FlatQuestion[] = [
		...(quiz.trueFalseQuestions ?? []).map(q => ({
			type: 'TF' as const,
			id: q.id,
			order: q.order ?? 0,
			text: q.questionText
		})),
		...(quiz.multipleChoiceQuestions ?? []).map(q => ({
			type: 'MC' as const,
			id: q.id,
			order: q.order ?? 0,
			text: q.questionText,
			options: Array.isArray(q.options)
				? q.options
				: typeof q.options === 'string'
					? (() => {
							try {
								return JSON.parse(q.options);
							} catch {
								return (q.options as string)
									.split(',')
									.map(s => s.trim())
									.filter(Boolean);
							}
						})()
					: []
		}))
	].sort((a, b) => a.order - b.order);

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

	const handleAnswer = (questionId: string, value: boolean | number) =>
		setAnswers(a => ({ ...a, [questionId]: value }));

	const handleSubmit = async () => {
		const { attemptId } = await createQuizAttempt({
			quizId: quiz.id,
			userId
		});

		await Promise.all(
			Object.entries(answers).map(([questionId, answer]) =>
				submitQuizAnswer({ quizId: quiz.id, attemptId, questionId, answer })
			)
		);

		router.push(`/quiz/${quiz.id}/results`);
	};

	const total = questions.length;
	const answered = Object.keys(answers).length;
	const pctDone = total ? Math.round((answered / total) * 100) : 0;

	const ChoiceCard = ({
		onClick,
		selected,
		children,
		fluid = false
	}: {
		onClick(): void;
		selected: boolean;
		children: React.ReactNode;
		fluid?: boolean;
	}) => (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				fluid ? 'flex-1 text-center' : 'inline-block',
				'min-w-[6rem] rounded-md border px-3 py-1.5 text-sm transition-transform',
				selected
					? 'border-primary bg-primary/10'
					: 'border-gray-300 hover:bg-gray-100',
				'focus:ring-primary focus:ring-2 focus:ring-offset-1 focus:outline-none active:scale-95'
			)}
		>
			{children}
		</button>
	);

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

			{questions.map((q, idx) => {
				if (q.type === 'TF') {
					const selTrue = answers[q.id] === true;
					const selFalse = answers[q.id] === false;
					return (
						<Card key={q.id}>
							<CardHeader>
								<CardTitle>{`Q${idx + 1}. ${q.text}`}</CardTitle>
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
				}

				return (
					<Card key={q.id}>
						<CardHeader>
							<CardTitle>{`Q${idx + 1}. ${q.text}`}</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-3">
							{q.options.map((opt, j) => (
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
};

export default QuizPageClient;

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createQuizAttempt } from '@/app/server-actions/quiz/attempt';
import { formatTime } from '@/components/utils/time-formatting';

import { type QuizForAttempt } from '../server/types';

type Props = { quiz: QuizForAttempt; userId: string };

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
	const [index, setIndex] = useState(0);

	const handleSubmit = useCallback(async () => {
		const allAnswers = questions.map(q => {
			const existing = answers[q.id];
			return { questionId: q.id, answer: existing ?? null };
		});

		await createQuizAttempt({
			quizId: quiz.id,
			userId,
			timeTaken: quiz.timeLimit - timeLeft,
			answers: allAnswers
		});

		router.push(`/quiz/${quiz.id}/results`);
	}, [answers, questions, quiz.id, quiz.timeLimit, router, userId, timeLeft]);

	useEffect(() => {
		if (timeLeft <= 0) {
			handleSubmit();
			return;
		}
		const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
		return () => clearTimeout(timer);
	}, [timeLeft, handleSubmit]);

	const handleAnswer = (questionId: string, value: boolean | number) =>
		setAnswers(a => ({ ...a, [questionId]: value }));

	const total = questions.length;
	const answered = Object.keys(answers).length;
	const pctDone = total ? Math.round((answered / total) * 100) : 0;

	const cur = questions[index];

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

	const renderQuestion = () => {
		if (cur.type === 'TF') {
			const selTrue = answers[cur.id] === true;
			const selFalse = answers[cur.id] === false;

			return (
				<Card>
					<CardHeader>
						<CardTitle>{`Q${index + 1}. ${cur.text}`}</CardTitle>
					</CardHeader>
					<CardContent className="flex gap-3">
						<ChoiceCard
							fluid
							selected={selTrue}
							onClick={() => handleAnswer(cur.id, true)}
						>
							True
						</ChoiceCard>
						<ChoiceCard
							fluid
							selected={selFalse}
							onClick={() => handleAnswer(cur.id, false)}
						>
							False
						</ChoiceCard>
					</CardContent>
				</Card>
			);
		}

		return (
			<Card>
				<CardHeader>
					<CardTitle>{`Q${index + 1}. ${cur.text}`}</CardTitle>
				</CardHeader>

				<CardContent className="grid grid-cols-2 gap-3">
					{cur.options.map((opt, i) => (
						<ChoiceCard
							key={i}
							fluid
							selected={answers[cur.id] === i}
							onClick={() => handleAnswer(cur.id, i)}
						>
							{opt}
						</ChoiceCard>
					))}
				</CardContent>
			</Card>
		);
	};

	const NavigationButtons = () => (
		<div className="flex justify-between">
			<Button
				type="button"
				disabled={index === 0}
				onClick={() => setIndex(i => i - 1)}
			>
				Previous
			</Button>

			{index < total - 1 ? (
				<Button type="button" onClick={() => setIndex(i => i + 1)}>
					Next
				</Button>
			) : (
				<Button type="submit">Submit Quiz</Button>
			)}
		</div>
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
				<Badge variant="outline">⏱ {formatTime(timeLeft)}</Badge>
				<Badge variant="outline">
					{answered}/{total} answered
				</Badge>
			</div>

			<Progress value={pctDone} />

			{renderQuestion()}

			<NavigationButtons />
		</form>
	);
};

export default QuizPageClient;

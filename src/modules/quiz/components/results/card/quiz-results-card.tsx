import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { QuizQuestionType } from '@/modules/quiz/server/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export type UserAnswerRecord = { selected: number | null; isCorrect: boolean };

export interface QuizResultCardProps {
	index: number;
	type: QuizQuestionType;
	quizId: string;
	topicId: string;
	questionText: string;
	userAnswer: UserAnswerRecord;
	correctValue: boolean | number;
	options?: string[];
}

export const QuizResultCard = ({
	index,
	type,
	quizId,
	topicId,
	questionText,
	userAnswer,
	correctValue,
	options
}: QuizResultCardProps) => {
	let Icon = <MinusCircle className="text-gray-400" />;
	if (userAnswer.selected !== null) {
		Icon = userAnswer.isCorrect ? (
			<CheckCircle className="text-green-500" />
		) : (
			<XCircle className="text-red-500" />
		);
	}

	const yourDisplay = (() => {
		if (userAnswer.selected === null) return 'No Answer';
		if (type === QuizQuestionType.TF)
			return userAnswer.selected ? 'True' : 'False';
		if (type === QuizQuestionType.MC && options) {
			return options[userAnswer.selected] ?? 'No Answer';
		}
		return '';
	})();

	const correctDisplay = (() => {
		if (type === QuizQuestionType.TF)
			return (correctValue as boolean) ? 'True' : 'False';
		if (type === QuizQuestionType.MC && options) {
			return options[correctValue as number] ?? 'Unknown';
		}
		return '';
	})();

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>{`Q${index + 1}. ${questionText}`}</CardTitle>
					{Icon}
				</div>
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<p className="mb-1 text-sm font-semibold">Your Answer</p>
					<Badge
						variant={
							userAnswer.selected === null
								? 'outline'
								: userAnswer.isCorrect
									? 'default'
									: 'secondary'
						}
					>
						{yourDisplay}
					</Badge>
				</div>
				<div>
					<p className="mb-1 text-sm font-semibold">Correct Answer</p>
					<Badge variant="default">{correctDisplay}</Badge>
				</div>
			</CardContent>
			<CardFooter className="flex gap-4">
				<Link href={`/quiz/${quizId}`}>
					<Button>Retry Quiz</Button>
				</Link>
				<Link href={`/topics/${topicId}`}>
					<Button variant="outline">Back to Topic</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default QuizResultCard;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type QuizHistoryStatisticCardProps = {
	title: string;
	content: string;
};

export const QuizHistoryStatisticCard = ({
	title,
	content
}: QuizHistoryStatisticCardProps) => (
	<Card>
		<CardHeader className="pb-2">
			<CardTitle className="text-muted-foreground text-sm font-medium">
				{title}
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="text-3xl font-bold">{content}</div>
		</CardContent>
	</Card>
);

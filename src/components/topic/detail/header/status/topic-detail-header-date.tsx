import { formatDate } from '@/components/utils/date';
import { LucideProps } from 'lucide-react';

interface TopicDetailHeaderDateProps {
	text: string;
	date: Date | string;
	Icon?: React.ComponentType<LucideProps>;
}

export default function TopicDetailHeaderDate({
	text,
	date,
	Icon
}: TopicDetailHeaderDateProps) {
	return (
		<div className="text-muted-foreground flex gap-2 text-sm">
			{Icon && <Icon className="h-4 w-4" />}
			<span> {text + ': ' + formatDate(date)}</span>
		</div>
	);
}

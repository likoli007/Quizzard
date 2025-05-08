import { formatDate } from '@/components/utils/date';

interface TopicDetailHeaderDateProps {
	text: string;
	date: Date | string;
	icon?: React.ReactNode;
}

export default function TopicDetailHeaderDate({
	text,
	date,
	icon
}: TopicDetailHeaderDateProps) {
	return (
		<div className="text-muted-foreground flex gap-2 text-sm">
			{icon && icon}
			<span> {text + ': ' + formatDate(date)}</span>
		</div>
	);
}

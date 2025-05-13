import { type LucideProps } from 'lucide-react';

import { formatDate } from '@/components/utils/date';

type TopicDetailHeaderDateProps = {
	text: string;
	date: Date | string;
	Icon?: React.ComponentType<LucideProps>;
};

const TopicDetailHeaderDate = ({
	text,
	date,
	Icon
}: TopicDetailHeaderDateProps) => (
	<div className="text-muted-foreground flex gap-2 text-sm">
		{Icon && <Icon className="h-4 w-4" />}
		<span> {`${text}: ${formatDate(date)}`}</span>
	</div>
);
export default TopicDetailHeaderDate;

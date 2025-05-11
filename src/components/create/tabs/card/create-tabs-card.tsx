import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

type CreateTabsCardProps = React.PropsWithChildren<{
	title: string;
	description?: string | null;
}>;

export function CreateTabsCard({
	children,
	title,
	description
}: CreateTabsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description && description}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">{children}</CardContent>
		</Card>
	);
}

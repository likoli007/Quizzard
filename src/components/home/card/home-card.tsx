import React from 'react';
import Link from 'next/link';
import { LucideProps } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

export interface HomeCardProps {
	Icon: React.ComponentType<LucideProps>;
	title: string;
	description: string;
	content: string;
	linkHref: string;
	linkLabel: string;
}

export const HomeCard: React.FC<HomeCardProps> = ({
	Icon,
	title,
	description,
	linkHref,
	linkLabel
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Icon className="h-5 w-5" />
					{title}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{description}</p>
			</CardContent>
			<CardFooter>
				<Button asChild className="w-full">
					<Link href={linkHref}>{linkLabel}</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

type BackButtonProps = {
	text: string;
	href: string;
};

export const BackButton = ({ text, href }: BackButtonProps) => (
	<Button variant="ghost" asChild className="mb-4">
		<Link href={href} className="flex items-center gap-2">
			<ArrowLeft className="h-4 w-4" />
			{text}
		</Link>
	</Button>
);

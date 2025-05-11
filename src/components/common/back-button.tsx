import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
	text: string;
	href: string;
}

export function BackButton({ text, href }: BackButtonProps) {
	return (
		<Button variant="ghost" asChild className="mb-4">
			<Link href={href} className="flex items-center gap-2">
				<ArrowLeft className="h-4 w-4" />
				{text}
			</Link>
		</Button>
	);
}

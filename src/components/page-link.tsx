import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { type ComponentProps } from 'react';

import { cn } from '@/lib/cn';

export const PageLink = ({
	children,
	className,
	reverse = false,
	...linkProps
}: ComponentProps<typeof Link> & { reverse?: boolean }) => {
	const ArrowComponent = reverse ? ArrowLeft : ArrowRight;

	return (
		<Link
			{...linkProps}
			className={cn(
				'flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold text-white uppercase transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-95',
				reverse &&
					'flex-row-reverse justify-end gap-x-4 bg-gray-300 text-black hover:bg-gray-400',
				className
			)}
		>
			<span className="text-left">{children}</span>
			<ArrowComponent size={20} />
		</Link>
	);
};

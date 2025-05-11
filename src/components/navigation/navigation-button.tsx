import React from 'react';
import Link from 'next/link';

type NavigationButtonProps = {
	href: string;
	label: string;
};

export const NavigationButton: React.FC<NavigationButtonProps> = ({
	href,
	label
}) => (
	<Link
		href={href}
		className="text-sm font-medium underline-offset-4 hover:underline"
	>
		{label}
	</Link>
);

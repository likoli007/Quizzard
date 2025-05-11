import '../globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Providers } from '@/components/providers';

const poppins = Poppins({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
	title: 'Quizzard'
};

const RootLayout = ({
	children
}: Readonly<{
	children: React.ReactNode;
}>) => (
	<html lang="en">
		<body
			className={`flex min-h-screen flex-col bg-gray-200 ${poppins.className}`}
		>
			<Providers>
				<div className="flex min-h-screen flex-col">{children}</div>
			</Providers>
		</body>
	</html>
);

export default RootLayout;

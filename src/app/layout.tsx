import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

import { Providers } from '@/components/providers';
import { navigationItems } from '@/modules/navigation/navigation-items';
import { NavigationButton } from '@/modules/navigation/navigation-button';
import { UserMenu } from '@/modules/home/user-menu';

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
				<div className="flex min-h-screen flex-col">
					<header className="border-b">
						<div className="container mx-auto flex h-16 items-center px-4">
							<Link href="/" className="flex items-center gap-2 font-semibold">
								<BookOpen className="h-6 w-6" />
								<span>Quizzard</span>
							</Link>
							<nav className="ml-auto flex gap-4 sm:gap-6">
								{navigationItems.map(item => (
									<NavigationButton
										key={item.href}
										href={item.href}
										label={item.label}
									/>
								))}
							</nav>
							<div className="ml-4">
								<UserMenu />
							</div>
						</div>
					</header>
					<main className="flex-1">{children}</main>
					<footer className="border-t py-6">
						<div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
							© {new Date().getFullYear()} Quizzard Platform. All rights
							reserved.
						</div>
					</footer>
				</div>
			</Providers>
		</body>
	</html>
);

export default RootLayout;

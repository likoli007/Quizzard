import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Providers } from '@/components/providers';
import { BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { navigationItems } from '@/components/navigation/navigation-items';
import { NavigationButton } from '@/components/navigation/navigation-button';

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
							<Button size="sm" variant="ghost">
								<User className="h-5 w-5" />
								<span className="sr-only">User</span>
							</Button>
						</div>
					</div>
				</header>
				<main className="flex-1">
					<Providers>{children}</Providers>
				</main>
				<footer className="border-t py-6">
					<div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
						© {new Date().getFullYear()} Quizzard Platform. All rights
						reserved.
					</div>
				</footer>
			</div>
		</body>
	</html>
);

export default RootLayout;

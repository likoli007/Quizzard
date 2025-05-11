'use client';

import { signIn, useSession } from 'next-auth/react';
import { BookOpen } from 'lucide-react';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';

const LoginPage = () => {
	const { data: session } = useSession();
	if (session?.user) {
		redirect('/');
	}
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
			<div className="w-full max-w-sm space-y-8 rounded-xl bg-white p-8 shadow-lg">
				<div className="flex flex-col items-center gap-2">
					<BookOpen className="text-primary h-8 w-8" />
					<h1 className="text-2xl font-semibold text-gray-900">Quizzard</h1>
				</div>

				<div className="space-y-4">
					<Button
						onClick={() => signIn('github')}
						className="w-full"
						variant="outline"
					>
						<svg
							className="mr-2 h-5 w-5"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								fillRule="evenodd"
								d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.082-.729.082-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.834 2.809 1.304 3.495.997.107-.775.418-1.304.76-1.604-2.665-.305-5.467-1.335-5.467-5.931 0-1.311.468-2.381 1.235-3.221-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23a11.51 11.51 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.649.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.371.823 1.102.823 2.222v3.293c0 .319.192.694.8.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"
							/>
						</svg>
						Login with GitHub
					</Button>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;

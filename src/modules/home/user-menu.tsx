'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const UserMenu = () => {
	const { data: session } = useSession();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" variant="ghost">
					<User className="h-5 w-5" />
					<span className="ml-2 hidden sm:inline">{session?.user?.name}</span>
					<span className="sr-only">User menu</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				{session ? (
					<>
						<div className="text-muted-foreground px-3 py-2 text-sm">
							Signed in as
							<div className="text-foreground font-medium">
								{session.user?.name}
							</div>
						</div>
						<DropdownMenuItem onClick={() => signOut()}>
							Log out
						</DropdownMenuItem>
					</>
				) : (
					<DropdownMenuItem onClick={() => signIn()}>Log in</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

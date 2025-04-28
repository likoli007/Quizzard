'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { LabeledItem } from '@/components/labeled-item';
import { type User } from '@/db/schema/user';
import { logoutAction } from '@/app/server-actions/user';

export const UserCard = ({
	user,
	giftsCount
}: {
	user: User;
	giftsCount: number;
}) => {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const handleLogout = async () => {
		setIsPending(true);
		await logoutAction();
		toast.success('Logged out');
		router.refresh();
		setIsPending(false);
	};

	return (
		<div className="flex flex-col gap-y-4">
			<div className="grid gap-10 rounded-md bg-white px-8 py-4 md:grid-cols-2 lg:grid-cols-4">
				<LabeledItem label="User">{user.name}</LabeledItem>
				<LabeledItem label="Username">{user.username}</LabeledItem>
				<LabeledItem label="Role">{user.role}</LabeledItem>
				<LabeledItem label="ID">{user.id}</LabeledItem>
			</div>

			{user.role === 'user' && (
				<div className="grid gap-10 rounded-md bg-white px-8 py-4 md:grid-cols-2 lg:grid-cols-4">
					<LabeledItem label="Gifts count">{giftsCount}</LabeledItem>
				</div>
			)}

			<div className="mt-4">
				<Button onClick={handleLogout} disabled={isPending}>
					{isPending ? 'Logging out…' : 'Log Out'}
				</Button>
			</div>
		</div>
	);
};

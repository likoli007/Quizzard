'use client';

import { logoutAction } from '@/app/server-actions/logoutAction';

export const LogoutButton = () => (
	<button
		onClick={async () => {
			await logoutAction();
		}}
		type="button"
	>
		Logout
	</button>
);

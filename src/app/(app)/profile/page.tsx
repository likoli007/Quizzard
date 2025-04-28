import { getGifts } from '@/app/server-actions/list';
import { getLoggedInUser } from '@/app/server-actions/logged-user';
import { LoginForm } from '@/modules/user/components/login-form';
import { UserCard } from '@/modules/user/components/user-card';

const ProfilePage = async () => {
	const user = await getLoggedInUser();
	let gifts = await getGifts();
	gifts = gifts.filter(gift => gift.createdBy === user?.id);

	return (
		<>
			<h1 className="mb-6 text-3xl">{user ? 'Profile' : 'Log in'}</h1>

			{user ? (
				<UserCard user={user} giftsCount={gifts.length} />
			) : (
				<LoginForm />
			)}
		</>
	);
};

export default ProfilePage;

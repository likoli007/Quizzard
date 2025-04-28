import { getLoggedInUser } from '@/app/server-actions/logged-user';
import { CreateGiftForm } from '@/modules/gift/components/create-gift-form';

const CreatePage = async () => {
	const user = await getLoggedInUser();

	return (
		<>
			<h1 className="mb-6 text-3xl">Create a gift</h1>

			{!user ? (
				<div>You need to sign in first.</div>
			) : user.role === 'santa' ? (
				<div>Santa is not allowed to create new gifts.</div>
			) : (
				<CreateGiftForm userId={user.id.toString()} />
			)}
		</>
	);
};

export default CreatePage;

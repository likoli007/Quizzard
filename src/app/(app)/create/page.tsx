import { redirect } from 'next/navigation';

import { getTopicsByUserId } from '@/modules/topic/server/query';
import { CreatePageShell } from '@/components/create/create-page-shell';
import { auth } from '@/auth';

const CreatePage = async () => {
	const session = await auth();

	if (!session) {
		redirect('/auth/login');
	}
	const topics = await getTopicsByUserId(session.user!.id as string);

	//TODO: remove as string
	return (
		<CreatePageShell userId={session.user!.id as string} topics={topics} />
	);
};

export default CreatePage;

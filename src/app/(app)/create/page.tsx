import { redirect } from 'next/navigation';

import { getTopicsByUserId } from '@/modules/topic/server/query';
import { auth } from '@/auth';
import { CreatePageShell } from '@/modules/create/create-page-shell';

const CreatePage = async () => {
	const session = await auth();

	if (!session?.user?.id) {
		redirect('/auth/login');
	}

	const topics = await getTopicsByUserId(session.user!.id as string);

	return <CreatePageShell userId={session.user!.id} topics={topics} />;
};

export default CreatePage;

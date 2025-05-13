import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getTopic, getTopicsByUserId } from '@/modules/topic/server/query';
import { CreateTopicForm } from '@/modules/topic/create-form/topic-create-form';

const EditTopicPage = async ({ params }: { params: { id: string } }) => {
	const session = await auth();
	if (!session?.user?.id) {
		redirect('/auth/login');
	}

	const topic = await getTopic((await params).id);

	if (session?.user?.id !== topic.userId) {
		<div>
			<p>You are not authorized to edit this topic.</p>
		</div>;
	} else {
	}

	return <CreateTopicForm userId={topic.userId!} topic={topic} />;
};

export default EditTopicPage;

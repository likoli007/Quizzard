import { getTopicsByUserId } from '@/modules/topic/server/query';
import { CreatePageShell } from '@/components/create/create-page-shell';

const CreatePage = async () => {
	const topics = await getTopicsByUserId('temp');
	return <CreatePageShell userId="temp" topics={topics} />;
};

export default CreatePage;

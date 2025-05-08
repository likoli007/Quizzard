import { CreateTopicForm } from '@/components/topic/create-form/topic-create-form';

const CreatePage = async () => (
	<>
		<h1 className="mb-6 text-3xl">Create Topic</h1>

		<CreateTopicForm userId="temp" />
	</>
);

export default CreatePage;

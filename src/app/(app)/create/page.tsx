import { CreateTopicQuizForm } from '@/modules/quiz/components/create-quiz-form/create-quiz-form';

const CreatePage = async () => (
	<>
		<h1 className="mb-6 text-3xl">Create a gift</h1>

		<CreateTopicQuizForm userId="temp" />
	</>
);

export default CreatePage;

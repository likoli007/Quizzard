import { getLoggedInUser } from '@/app/server-actions/logged-user';
import { CreateGiftForm } from '@/modules/gift/components/create-gift-form';
import { CreateTopicQuizForm } from '@/modules/gift/components/create-quiz-form/create-quiz-form';

const CreatePage = async () => (
	<>
		<h1 className="mb-6 text-3xl">Create a gift</h1>

		<CreateTopicQuizForm userId="temp" />
	</>
);

export default CreatePage;

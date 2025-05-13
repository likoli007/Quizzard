'use client';

import { FileText, HelpCircle } from 'lucide-react';
import { useState } from 'react';

import { CreateTopicForm } from '@/modules/topic/components/create-form/topic-create-form';
import { TopicQuizForm } from '@/modules/quiz/components/create-quiz-form/create-quiz-form';
import { type Topic } from '@/db/schema/topics';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import CreateTabsCard from './tabs/card/create-tabs-card';

export const CreatePageShell = ({
	userId,
	topics
}: {
	userId: string;
	topics: Topic[];
}) => {
	const [activeTab, setActiveTab] = useState('topic');

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-8 flex flex-col items-center justify-center space-y-4 text-center">
				<h1 className="text-4xl font-bold tracking-tight">
					Create New Content
				</h1>
				<p className="text-muted-foreground max-w-[700px] text-lg">
					Share your knowledge by creating a new topic or quiz for the
					community.
				</p>
			</div>

			<Tabs
				defaultValue="topic"
				className="mx-auto max-w-4xl"
				onValueChange={setActiveTab}
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="topic" className="flex items-center gap-2">
						<FileText className="h-4 w-4" />
						Create Topic
					</TabsTrigger>
					<TabsTrigger value="quiz" className="flex items-center gap-2">
						<HelpCircle className="h-4 w-4" />
						Create Quiz
					</TabsTrigger>
				</TabsList>

				<TabsContent value="topic">
					<CreateTabsCard
						title="Create a New Topic"
						description="Fill in the details below to create a new educational topic."
					>
						<CreateTopicForm userId={userId} />
					</CreateTabsCard>
				</TabsContent>

				<TabsContent value="quiz">
					<CreateTabsCard
						title="Create a New Quiz"
						description="Create a quiz to test knowledge on a specific topic."
					>
						<TopicQuizForm userId={userId} topics={topics} mode="create" />
					</CreateTabsCard>
				</TabsContent>
			</Tabs>
		</div>
	);
};

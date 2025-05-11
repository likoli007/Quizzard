'use client';

import type React from 'react';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, HelpCircle } from 'lucide-react';
import { CreateTopicQuizForm } from '@/modules/quiz/components/create-quiz-form/create-quiz-form';
import { CreateTabsCard } from '@/components/create/tabs/card/create-tabs-card';
import { CreateTopicForm } from '@/modules/topic/create-form/topic-create-form';

export default function CreatePage() {
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
						<CreateTopicForm userId="temp" />
					</CreateTabsCard>
				</TabsContent>

				<TabsContent value="quiz">
					<CreateTabsCard
						title="Create a New Quiz"
						description="Create a quiz to test knowledge on a specific topic."
					>
						<CreateTopicQuizForm userId="temp" />
					</CreateTabsCard>
				</TabsContent>
			</Tabs>
		</div>
	);
}

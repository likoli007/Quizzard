'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
	type Topic,
	type UpdateTopicInput,
	type CreateTopicInput
} from '@/db/schema/topics';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import createTopic, { updateTopic } from '@/app/server-actions/topics/topics';
import {
	createTopicValidator,
	updateTopicValidator
} from '@/app/server-actions/topics/validators';

type CreateTopicFormProps = {
	userId: string;
	topic?: Topic;
	onSubmitAction?: () => void;
};

type FormValues = CreateTopicInput & Partial<UpdateTopicInput>;

export const CreateTopicForm = ({
	userId,
	topic,
	onSubmitAction
}: CreateTopicFormProps) => {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(topic ? updateTopicValidator : createTopicValidator),
		defaultValues: {
			id: topic?.id ?? '',
			title: topic?.title ?? '',
			description: topic?.description ?? '',
			readTime: Number(topic?.readTime) || 5,
			content: topic?.content ?? '',
			category: topic?.category ?? '',
			userId,
			publishedAt: topic?.publishedAt ?? ''
		}
	});

	const onSubmit = async (values: CreateTopicInput) => {
		setIsPending(true);
		if (topic) {
			try {
				await updateTopic(values);
				toast.success('Topic updated!');
				router.refresh();
				router.push(`/topics/${topic.id}`);
			} catch (_err: any) {
				toast.error('Update failed');
			} finally {
				setIsPending(false);
			}
		} else {
			try {
				await createTopic(values);
				toast.success('Topic created!');
				router.push('/topics');
			} catch (_err: any) {
				toast.error('Failed to create topic');
			} finally {
				setIsPending(false);
			}
		}
		onSubmitAction?.();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto flex max-w-4xl flex-col gap-8"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="readTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Read Time (minutes)</FormLabel>
							<FormControl>
								<Input type="number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<Textarea rows={6} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isPending}>
					{topic ? 'Update Topic' : 'Create Topic'}
				</Button>
			</form>
		</Form>
	);
};

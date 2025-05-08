'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
	createTopicValidator,
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
import { createTopic } from '@/app/server-actions/topics';

export function CreateTopicForm({ userId }: { userId: string }) {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const form = useForm<CreateTopicInput>({
		resolver: zodResolver(createTopicValidator),
		defaultValues: {
			title: '',
			description: '',
			readTime: 5,
			content: '',
			category: '',
			userId,
			publishedAt: ''
		}
	});

	const onSubmit = async (values: CreateTopicInput) => {
		setIsPending(true);
		try {
			await createTopic(values);
			toast.success('Topic created!');
			router.push('/topics');
		} catch (err: any) {
			toast.error(err.message || 'Failed to create topic');
		} finally {
			setIsPending(false);
		}
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
					{isPending ? 'Saving…' : 'Create Topic'}
				</Button>
			</form>
		</Form>
	);
}

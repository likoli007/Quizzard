'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	createTopicQuizSchema,
	type CreateTopicQuizInput
} from '@/modules/gift/components/create-quiz-form/schema';
import { createTopicWithQuiz } from '@/app/server-actions/quizzes';
import { Textarea } from '@/components/ui/textarea';

import { TrueFalseOption } from './true-false-option';
import { MultipleChoiceOption } from './multiple-choice-option';

//TODO: beautify :D
export const CreateTopicQuizForm = ({ userId }: { userId: string }) => {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const form = useForm<CreateTopicQuizInput>({
		resolver: zodResolver(createTopicQuizSchema),
		defaultValues: {
			userId,
			timeLimit: 600,
			questions: [],

			title: '',
			description: '',
			content: '',
			category: '',
			publishedAt: '',
			quizTitle: '',
			quizDescription: ''
		}
	});

	const { control, handleSubmit } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'questions'
	});

	const addTF = () => append({ type: 'TF', questionText: '', answer: false });
	const addMC = () =>
		append({
			type: 'MC',
			questionText: '',
			options: ['', '', '', ''],
			answer: 0
		});

	const onSubmit = async (data: CreateTopicQuizInput) => {
		setIsPending(true);
		try {
			await createTopicWithQuiz(data, userId);
			toast.success('Topic & quiz created');
			router.push('/dashboard/quizzes');
		} catch (err: any) {
			toast.error(err.message ?? 'Something went wrong');
		} finally {
			setIsPending(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mx-auto flex max-w-4xl flex-col gap-8"
			>
				<section className="space-y-3">
					<h2 className="text-xl font-semibold">Article</h2>

					<FormField
						control={control}
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
						control={control}
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
						control={control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>
									<Textarea rows={8} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
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
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold">Quiz details</h2>

					<FormField
						control={control}
						name="quizTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Quiz title</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="quizDescription"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Quiz description</FormLabel>
								<FormControl>
									<Textarea rows={3} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="timeLimit"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Time limit (seconds)</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</section>

				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Questions</h2>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" type="button" onClick={addTF}>
								+ True/False
							</Button>
							<Button variant="outline" size="sm" type="button" onClick={addMC}>
								+ Multiple-choice
							</Button>
						</div>
					</div>

					{fields.map((f, idx) => {
						const name = `questions.${idx}` as const;
						const type = form.watch(`${name}.type`);

						return (
							<div key={f.id} className="space-y-3 rounded border p-4">
								<Button
									type="button"
									size="icon"
									variant="ghost"
									className="float-right"
									onClick={() => remove(idx)}
								>
									✕
								</Button>

								<FormField
									control={control}
									name={`${name}.questionText`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Q${idx + 1} Text`}</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{type === 'TF' ? (
									<TrueFalseOption name={name} />
								) : (
									<MultipleChoiceOption name={name} />
								)}
							</div>
						);
					})}
				</section>

				<Button disabled={isPending}>{isPending ? 'Saving…' : 'Create'}</Button>
			</form>
		</Form>
	);
};

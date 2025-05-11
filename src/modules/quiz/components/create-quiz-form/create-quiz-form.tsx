'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
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
	createQuizSchema,
	type CreateTopicQuizInput
} from '@/modules/quiz/components/create-quiz-form/schema';
import { createTopicWithQuiz } from '@/app/server-actions/quizzes';
import { Textarea } from '@/components/ui/textarea';
import { type Topic } from '@/db/schema/topics';

import { TrueFalseOption } from './true-false-option';
import { MultipleChoiceOption } from './multiple-choice-option';

//TODO: beautify :D
export const CreateTopicQuizForm = ({
	userId,
	topics
}: {
	userId: string;
	topics: Topic[];
}) => {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const form = useForm<CreateTopicQuizInput>({
		resolver: zodResolver(createQuizSchema),
		defaultValues: {
			timeLimit: 600,
			questions: [],
			quizTitle: '',
			quizDescription: '',
			associatedTopicId: ''
		}
	});

	const { control, handleSubmit, formState } = form;
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
		console.log('data', data);
		setIsPending(true);
		try {
			await createTopicWithQuiz(data, userId);
			toast.success('Topic & quiz created');
			router.push(`/topics/${data.associatedTopicId}`);
		} catch (err: any) {
			toast.error(err.message ?? 'Something went wrong');
		} finally {
			setIsPending(false);
		}
	};

	console.log('formState', formState.errors);

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mx-auto flex max-w-4xl flex-col gap-8"
			>
				<section className="space-y-3">
					<FormField
						control={control}
						name="associatedTopicId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Associated topic</FormLabel>

								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={topics.length === 0}
								>
									<FormControl>
										<SelectTrigger className="w-full max-w-sm">
											<SelectValue placeholder="Choose a topic…" />
										</SelectTrigger>
									</FormControl>

									<SelectContent>
										{topics.map(t => (
											<SelectItem key={t.id} value={t.id}>
												{t.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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
					<h2 className="text-xl font-semibold">Questions</h2>

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
											<FormLabel>{`Question ${idx + 1} Text`}</FormLabel>
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

					<div className="flex justify-end gap-2 pt-2">
						<Button variant="outline" size="sm" type="button" onClick={addTF}>
							+ True/False
						</Button>
						<Button variant="outline" size="sm" type="button" onClick={addMC}>
							+ Multiple-choice
						</Button>
					</div>
				</section>

				<Button type="submit" disabled={isPending}>
					{isPending ? 'Saving…' : 'Create'}
				</Button>
			</form>
		</Form>
	);
};

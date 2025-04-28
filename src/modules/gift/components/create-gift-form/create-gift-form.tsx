'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/form-input';
import { SubmitButton } from '@/components/form/submit-button';
import { createGiftAction } from '@/app/server-actions/gifts';

import { createGiftFormSchema, type CreateGiftFormSchema } from './schema';

export const CreateGiftForm = ({ userId }: { userId: string }) => {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const form = useForm<CreateGiftFormSchema>({
		resolver: zodResolver(createGiftFormSchema),
		defaultValues: { userId }
	});

	const onSubmit = async (data: CreateGiftFormSchema) => {
		setIsPending(true);

		await createGiftAction({
			name: data.name,
			description: data.description,
			price: data.price,
			createdBy: data.userId
		});
		toast.success(`Gift "${data.name}" created!`);
		router.refresh();
		form.reset({ userId });

		setIsPending(false);
	};

	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-y-2 md:w-1/2 lg:w-1/3"
			>
				<FormInput label="Name" name="name" />
				<FormInput label="Description" name="description" />
				<FormInput label="Price" type="number" name="price" />

				<div className="mt-2">
					<SubmitButton isLoading={isPending} />
				</div>
			</form>
		</FormProvider>
	);
};

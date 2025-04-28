'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/form-input';
import { SubmitButton } from '@/components/form/submit-button';
import { loginAction } from '@/app/server-actions/user';

import { type LoginFormSchema, loginFormSchema } from './schema';

export const LoginForm = () => {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const form = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema)
	});

	const onSubmit = async (values: LoginFormSchema) => {
		setIsPending(true);
		const user = await loginAction(values);
		router.refresh();
		toast.success(`Logged in as ${user.name}`);

		setIsPending(false);
	};

	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-y-2 md:w-1/2 lg:w-1/3"
			>
				<FormInput label="Username" name="username" />
				<FormInput label="Password" type="password" name="password" />

				<div className="mt-2">
					<SubmitButton isLoading={isPending} />
				</div>
			</form>
		</FormProvider>
	);
};

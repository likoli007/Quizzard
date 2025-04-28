import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createGiftValidator } from '@/db/schema/gift';

import { giftsQueryOptions } from '../../hooks/api';

import { type CreateGiftFormSchema } from './schema';

export const useCreateGiftMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ userId, ...gift }: CreateGiftFormSchema) => {
			const response = await fetch('/api/gift', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					gift,
					userId
				})
			});

			const json = await response.json();

			if (!response.ok) {
				throw new Error(json.error);
			}

			return createGiftValidator.parse(json);
		},
		onSuccess: () => queryClient.invalidateQueries(giftsQueryOptions)
	});
};

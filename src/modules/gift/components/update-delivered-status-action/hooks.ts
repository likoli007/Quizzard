import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createGiftValidator } from '@/db/schema/gift';

import { giftsQueryOptions } from '../../hooks/api';

export const useUpdateGiftDeliveredMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { id: string; delivered: boolean }) => {
			const response = await fetch(`/api/gift/${data.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ delivered: data.delivered })
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

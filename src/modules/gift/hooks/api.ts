import { z } from 'zod';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { createGiftValidator } from '@/db/schema/gift';

export const giftsQueryOptions = queryOptions({
	queryKey: ['gifts'],
	queryFn: async () => {
		const response = await fetch('/api/gift/list');
		const json = await response.json();

		return z.array(createGiftValidator).parse(json);
	},
	staleTime: Infinity
});

export const useGiftsQuery = () => useQuery(giftsQueryOptions);

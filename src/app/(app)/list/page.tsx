import { z } from 'zod';

import { getGifts } from '@/app/server-actions/list';
import { GiftList } from '@/modules/gift/components/gift-list';

export const dynamic = 'force-dynamic';

const GiftsPage = async () => {
	const raw = await getGifts();
	//const gifts = z.array(giftSchema).parse(raw);

	return (
		<main className="p-6">
			<h1 className="mb-6 text-3xl">Gift list</h1>
			<GiftList gifts={raw} />
		</main>
	);
};

export default GiftsPage;

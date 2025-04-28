import { LabeledItem } from '@/components/labeled-item';
import { getLoggedInUser } from '@/app/server-actions/logged-user';

import { type Gift } from '../../../db/schema/gift';

import { UpdateDeliveredStatusAction } from './update-delivered-status-action';

const GiftListItem = async ({ gift }: { gift: Gift }) => {
	const user = await getLoggedInUser();

	const delivered = gift.delivered ? 'Yes' : 'No';

	return (
		<li className="relative grid gap-4 rounded-md bg-white px-8 py-4 md:grid-cols-3">
			{user?.id === gift.createdBy && (
				<span className="badge absolute top-4 right-4">
					{user.name}&#39;s gift
				</span>
			)}
			<LabeledItem label="Name">{gift.name}</LabeledItem>
			<LabeledItem label="Description" className="col-span-2">
				{gift.description}
			</LabeledItem>

			<LabeledItem label="Price">{gift.price}</LabeledItem>
			<LabeledItem label="Created By">{gift.createdBy}</LabeledItem>
			<LabeledItem label="Delivered">
				<div className="flex items-center gap-x-10">
					<span>{delivered}</span>
					{user?.role === 'santa' && (
						<UpdateDeliveredStatusAction gift={gift} />
					)}
				</div>
			</LabeledItem>
		</li>
	);
};

export const GiftList = ({ gifts }: { gifts: Gift[] }) => (
	<ul className="flex flex-col gap-y-2">
		{gifts.map(gift => (
			<GiftListItem key={gift.id} gift={gift} />
		))}
	</ul>
);

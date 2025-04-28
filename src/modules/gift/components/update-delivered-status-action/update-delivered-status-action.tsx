'use client';

import { Check, Loader, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { updateDeliveredStatus } from '@/app/server-actions/gifts';
import { type Gift } from '@/db/schema/gift';

import { useUpdateGiftDeliveredMutation } from './hooks';

export const UpdateDeliveredStatusAction = ({ gift }: { gift: Gift }) => {
	const mutation = useUpdateGiftDeliveredMutation();
	const [isPending, setIsPending] = useState(false);

	const Icon = mutation.isPending ? Loader : gift.delivered ? X : Check;

	const handleClick = async () => {
		setIsPending(true);
		await updateDeliveredStatus(gift.id, !gift.delivered);
		toast.success(`Gift ${!gift.delivered ? '' : 'not '}delivered!`);
		setIsPending(false);
	};

	return (
		<Button onClick={handleClick}>
			<Icon size={16} className={cn(isPending && 'animate-spin')} />
		</Button>
	);
};

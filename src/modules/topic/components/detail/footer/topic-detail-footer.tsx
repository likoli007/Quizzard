import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { debounceLeading } from '@/components/utils/utils';

type TopicDetailFooterProps = {
	id: string;
};

const TopicDetailFooter = ({ id }: TopicDetailFooterProps) => {
	const handleShare = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const url = `${window.location.origin}/topics/${id}`;
		navigator.clipboard.writeText(url);
		toast.success('Link copied to clipboard!');
	};

	const debouncedShare = debounceLeading(handleShare, 200);
	return (
		<div className="flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
			<Button variant="outline" size="sm" onClick={debouncedShare}>
				<Share2 className="mr-2 h-4 w-4" />
				Share Article
			</Button>
		</div>
	);
};

export default TopicDetailFooter;

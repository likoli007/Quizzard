export const formatDate = (date: Date | string) => {
	if (typeof date === 'string') {
		date = new Date(date);
	}

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};

	return date.toLocaleDateString('en-US', options);
};

export const formatDateWithTime = (date: Date | string) => {
	if (typeof date === 'string') {
		date = new Date(date);
	}

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};

	return date.toLocaleDateString('en-US', options);
};

export const formatTimeFromSeconds = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};

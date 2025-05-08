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

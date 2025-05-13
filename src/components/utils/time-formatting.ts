export const formatTime = (secondsLeft: number): string => {
	const minutes = Math.floor(secondsLeft / 60);
	const seconds = secondsLeft % 60;

	if (minutes === 0) {
		return `${seconds}s`;
	}

	if (seconds === 0) {
		return `${minutes} min`;
	}

	return `${minutes} min ${seconds}s`;
};

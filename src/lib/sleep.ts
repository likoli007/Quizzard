/**
 * NOTE: You can edit this value while developing
 */
const SLEEP_TIME_MS = 1500;

/**
 * Simulates a slower network or BE processing time
 */
export const sleep = () =>
	new Promise(resolve => setTimeout(resolve, SLEEP_TIME_MS));

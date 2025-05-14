export type NavigationItem = {
	href: string;
	label: string;
};

export const navigationItems: { href: string; label: string }[] = [
	{ href: '/topics', label: 'Topics' },
	{ href: '/create', label: 'Create' },
	{ href: '/favorites', label: 'Favorites' },
	{ href: '/quiz/history', label: 'History' },
	{ href: '/leaderboard', label: 'Leaderboard' },
	{ href: '/quiz', label: 'Quizzes' }
];

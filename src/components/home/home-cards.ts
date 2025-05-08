import { Award, BookOpen, History, LucideIcon, Plus, Star } from 'lucide-react';

export type HomeCardData = {
	Icon: LucideIcon;
	title: string;
	subtitle: string;
	content: string;
	linkHref: string;
	linkLabel: string;
};

export const homeCards: HomeCardData[] = [
	{
		Icon: BookOpen,
		title: 'Learn New Topics',
		subtitle: 'Explore educational content',
		content:
			'Browse through our collection of articles and educational content to expand your knowledge.',
		linkHref: '/topics',
		linkLabel: 'Browse Topics'
	},
	{
		Icon: Plus,
		title: 'Create Content',
		subtitle: 'Share your knowledge with others',
		content:
			'Create your own topics and quizzes to share with the community or test your friends.',
		linkHref: '/topics/create',
		linkLabel: 'Create Now'
	},
	{
		Icon: Star,
		title: 'Favorites',
		subtitle: 'Access your saved content',
		content:
			'Quickly access your favorite articles and topics that you’ve saved for later.',
		linkHref: '/favorites',
		linkLabel: 'View Favorites'
	},
	{
		Icon: History,
		title: 'Quiz History',
		subtitle: 'Track your learning progress',
		content:
			"Review all the quizzes you've taken and see how your knowledge has improved over time.",
		linkHref: '/quiz/history',
		linkLabel: 'View History'
	},
	{
		Icon: Award,
		title: 'Leaderboard',
		subtitle: 'Compare your scores',
		content:
			'See how your quiz scores compare to other users and compete for the top positions.',
		linkHref: '/leaderboard',
		linkLabel: 'View Leaderboard'
	}
];

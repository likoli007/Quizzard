import { PageLink } from '@/components/page-link';

const Home = () => (
	<>
		<h1 className="text-3xl">Task 06 - Forms, Async</h1>

		<div className="mt-10">
			<div className="flex w-1/2 flex-col gap-y-2 md:w-1/6">
				<PageLink href="/profile">Profile</PageLink>
				<PageLink href="/list">List</PageLink>
				<PageLink href="/create">Create</PageLink>
			</div>
		</div>
	</>
);

export default Home;

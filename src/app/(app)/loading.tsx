const Loading: React.FC = () => (
	<div className="flex min-h-screen items-center justify-center">
		<div className="relative">
			<div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

			<div
				className="absolute inset-2 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"
				style={{ animationDuration: '600ms', animationDirection: 'reverse' }}
			/>

			<div className="absolute inset-0 flex items-center justify-center">
				<div className="h-4 w-4 animate-pulse rounded-full bg-black" />
			</div>
		</div>
	</div>
);

export default Loading;

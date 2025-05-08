interface PageHeadingProps {
	heading: string;
	subheading?: string;
}

export const PageHeading: React.FC<PageHeadingProps> = ({
	heading,
	subheading
}) => {
	return (
		<div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
			<h1 className="text-4xl font-bold tracking-tight">{heading}</h1>
			{subheading && (
				<p className="text-muted-foreground max-w-[700px] text-lg">
					{subheading}
				</p>
			)}
		</div>
	);
};

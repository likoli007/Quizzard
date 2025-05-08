import { useFormContext } from 'react-hook-form';

import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type BranchProps = { name: string };

export const MultipleChoiceOption = ({ name }: BranchProps) => {
	const { control } = useFormContext();
	return (
		<>
			<FormField
				control={control}
				name={`${name}.answer`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Correct option index (0-based)</FormLabel>
						<FormControl>
							<Input
								type="number"
								{...field}
								value={typeof field.value === 'number' ? field.value : 0}
								onChange={e => field.onChange(Number(e.target.value))}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="space-y-2">
				<h2 className="block text-sm font-medium">
					Options (fill at least two)
				</h2>
				{[0, 1, 2, 3].map(i => (
					<FormField
						key={i}
						control={control}
						name={`${name}.options.${i}`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Option {i}</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
			</div>
		</>
	);
};

import { useFormContext } from 'react-hook-form';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

type BranchProps = { name: string };

export const TrueFalseOption = ({ name }: BranchProps) => {
	const { control } = useFormContext();
	return (
		<FormField
			control={control}
			name={`${name}.answer`}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Correct answer</FormLabel>
					<FormControl>
						<Select
							onValueChange={v => field.onChange(v === 'true')}
							defaultValue={field.value ? 'true' : 'false'}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select…" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="true">True</SelectItem>
								<SelectItem value="false">False</SelectItem>
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

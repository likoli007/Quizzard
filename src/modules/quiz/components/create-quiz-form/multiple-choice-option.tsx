// MultipleChoiceOption.tsx
import { useFormContext, Controller } from 'react-hook-form';

import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Props = { name: string };

export const MultipleChoiceOption = ({ name }: Props) => {
	const { control } = useFormContext();

	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name={`${name}.answer`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Choose the correct answer</FormLabel>

						<RadioGroup
							className="space-y-2"
							value={String(field.value ?? '')}
							onValueChange={v => field.onChange(Number(v))}
						>
							{[0, 1, 2, 3].map(i => (
								<div key={i} className="flex items-center gap-3">
									<FormControl>
										<RadioGroupItem value={String(i)} />
									</FormControl>

									<Controller
										control={control}
										name={`${name}.options.${i}`}
										render={({ field: optField }) => (
											<Input
												{...optField}
												placeholder={`Option ${i + 1}`}
												className="flex-1"
											/>
										)}
									/>
								</div>
							))}
						</RadioGroup>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
};

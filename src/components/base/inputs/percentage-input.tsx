import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentProps } from 'react';

interface Props extends Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type'> {
	value?: number | null;
	onChange?: (value: number | null) => void;
}

export default function PercentageInput({ value, onChange, id, placeholder, ...props }: Props) {
	return (
		<div className='flex flex-col space-y-1.5'>
			{placeholder ? <Label htmlFor={id}>{placeholder}</Label> : null}
			<Input
				id={id}
				type='number'
				placeholder={placeholder}
				onChange={(e) => {
					const num = e.target.valueAsNumber;
					if (e.target.value === '') {
						onChange?.(null); // Allow clearing input
					} else if (!isNaN(num) && num >= 0 && num <= 100) {
						onChange?.(num);
					}
				}}
				value={value ?? ''}
				min={0}
				max={100}
				step={0.1}
				{...props}
			/>
		</div>
	);
}

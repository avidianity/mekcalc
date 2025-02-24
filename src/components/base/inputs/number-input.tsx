import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentProps } from 'react';

interface Props extends Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type'> {
	value?: number;
	onChange?: (value: number) => void;
}

export default function NumberInput({ value, onChange, id, placeholder, ...props }: Props) {
	return (
		<div className='flex flex-col space-y-1.5'>
			{placeholder ? <Label htmlFor={id}>{placeholder}</Label> : null}
			<Input
				id={id}
				type='number'
				placeholder={placeholder}
				onChange={(e) => onChange?.(e.target.valueAsNumber)}
				value={value && value > 0 ? value : ''}
				{...props}
			/>
		</div>
	);
}

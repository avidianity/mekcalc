'use client';

import Back from '@/components/back';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNumber } from '@/hooks/number';
import { calculateDisplacement } from '@/lib/number';
import { useMemo } from 'react';

export default function EngineDisplacement() {
	const [cylinders, setCylinders] = useNumber(1);
	const [bore, setBore] = useNumber();
	const [stroke, setStroke] = useNumber();

	const displacement = useMemo(
		() => calculateDisplacement(bore, stroke, cylinders),
		[bore, stroke, cylinders]
	);

	return (
		<div className='h-full w-full flex items-center justify-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle className='flex items-center'>
						Engine Displacement
						<Back href='/' iconOnly className='ml-auto' />
					</CardTitle>
					<CardDescription className='flex flex-col'>
						<span>Displacement: {Math.floor(displacement)}cc</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid w-full items-center gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='cylinders'>Cylinders</Label>
							<Input
								id='cylinders'
								type='number'
								placeholder='Cylinders'
								onChange={(e) => setCylinders(e.target.valueAsNumber)}
								value={cylinders > 0 ? cylinders : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='bore'>Bore (mm)</Label>
							<Input
								id='bore'
								type='number'
								placeholder='Bore (mm)'
								onChange={(e) => setBore(e.target.valueAsNumber)}
								value={bore > 0 ? bore : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='stroke'>Stroke (mm)</Label>
							<Input
								id='stroke'
								type='number'
								placeholder='Stroke (mm)'
								onChange={(e) => setStroke(e.target.valueAsNumber)}
								value={stroke > 0 ? stroke : ''}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

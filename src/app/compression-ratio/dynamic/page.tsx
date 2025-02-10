'use client';

import Back from '@/components/back';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNumber } from '@/hooks/number';
import {
	calculateDisplacement,
	calculateDynamicCompressionRatio,
	calculateEffectiveStroke,
	calculateStaticCompressionRatio,
} from '@/lib/number';
import { useMemo } from 'react';

export default function Dynamic() {
	const [cylinders, setCylinders] = useNumber(1);
	const [bore, setBore] = useNumber();
	const [stroke, setStroke] = useNumber();
	const [unsweptVolume, setUnsweptVolume] = useNumber();
	const [ivcAngle, setIvcAngle] = useNumber();

	const displacement = useMemo(
		() => calculateDisplacement(bore, stroke, cylinders),
		[bore, stroke, cylinders]
	);

	const staticRatio = useMemo(() => {
		const result = calculateStaticCompressionRatio(displacement, unsweptVolume);

		if (!isFinite(result)) {
			return 0;
		}

		return result;
	}, [displacement, unsweptVolume]);

	const dynamicRatio = useMemo(
		() => calculateDynamicCompressionRatio(bore, stroke, unsweptVolume, ivcAngle),
		[bore, stroke, unsweptVolume, ivcAngle]
	);

	const effectiveStroke = useMemo(
		() => calculateEffectiveStroke(bore, stroke, ivcAngle),
		[bore, stroke, ivcAngle]
	);

	return (
		<div className='h-full w-full flex items-center justify-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle className='flex items-center'>
						Dynamic Compression Ratio
						<Back href='/compression-ratio' iconOnly className='ml-auto' />
					</CardTitle>
					<CardDescription className='flex flex-col'>
						<span>Displacement: {Math.floor(displacement)}cc</span>
						<span>Static: {staticRatio}:1</span>
						<span>Effective Stroke: {effectiveStroke.toFixed(2)}mm</span>
						<span>Dynamic: {dynamicRatio}:1</span>
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
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='unsweptVolume'>Unswept Volume (cc)</Label>
							<Input
								id='unsweptVolume'
								type='number'
								placeholder='Unswept Volume (cc)'
								onChange={(e) => setUnsweptVolume(e.target.valueAsNumber)}
								value={unsweptVolume > 0 ? unsweptVolume : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='ivcAngle'>Intake Valve Closing Degree (°)</Label>
							<Input
								id='ivcAngle'
								type='number'
								placeholder='Intake Valve Closing Degree (°)'
								onChange={(e) => setIvcAngle(e.target.valueAsNumber)}
								value={ivcAngle > 0 ? ivcAngle : ''}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

'use client';

import Back from '@/components/back';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNumber } from '@/hooks/number';
import {
	calculateAdvance,
	calculateExhaustCenterline,
	calculateExhaustDuration,
	calculateIntakeCenterline,
	calculateIntakeDuration,
	calculateLSA,
	calculateOverlap,
} from '@/lib/number';
import { useMemo } from 'react';

export default function GasketVolume() {
	const [ivo, setIvo] = useNumber();
	const [ivc, setIvc] = useNumber();
	const [evo, setEvo] = useNumber();
	const [evc, setEvc] = useNumber();

	const intakeDuration = useMemo(() => calculateIntakeDuration(ivo, ivc), [ivo, ivc]);
	const exhaustDuration = useMemo(() => calculateExhaustDuration(evo, evc), [evo, evc]);
	const overlap = useMemo(() => calculateOverlap(ivo, evc), [ivo, evc]);
	const intakeCenterline = useMemo(
		() => calculateIntakeCenterline(ivo, intakeDuration),
		[ivo, intakeDuration]
	);
	const exhaustCenterline = useMemo(
		() => calculateExhaustCenterline(evc, exhaustDuration),
		[evc, exhaustDuration]
	);
	const lsa = useMemo(
		() => calculateLSA(intakeCenterline, exhaustCenterline),
		[intakeCenterline, exhaustCenterline]
	);
	const advance = useMemo(() => calculateAdvance(lsa, intakeCenterline), [lsa, intakeCenterline]);

	return (
		<div className='h-full w-full flex items-center justify-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle className='flex items-center'>
						Camshaft Timing
						<Back href='/' iconOnly className='ml-auto' />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid w-full items-center gap-4 grid-cols-2'>
						<div className='col-span-2 flex flex-col space-y-1.5'>
							<Label htmlFor='lsa'>Lobe Separation Angle</Label>
							<Input
								id='lsa'
								type='number'
								placeholder='Lobe Separation Angle'
								className='bg-slate-100'
								disabled
								value={lsa}
							/>
						</div>
						<div className='col-span-2 flex flex-col space-y-1.5'>
							<Label htmlFor='advance'>Advance</Label>
							<Input
								id='advance'
								type='number'
								placeholder='Advance'
								className='bg-slate-100'
								disabled
								value={advance}
							/>
						</div>
						<span className='font-semibold flex items-center justify-center w-full'>Intake</span>
						<span className='font-semibold flex items-center justify-center w-full'>Exhaust</span>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='intakeDuration'>Duration</Label>
							<Input
								id='intakeDuration'
								type='number'
								placeholder='Duration'
								className='bg-slate-100'
								disabled
								value={intakeDuration}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='exhaustDuration'>Duration</Label>
							<Input
								id='exhaustDuration'
								type='number'
								placeholder='Duration'
								className='bg-slate-100'
								disabled
								value={exhaustDuration}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='intakeCenterline'>Centerline (ATDC)</Label>
							<Input
								id='intakeCenterline'
								type='number'
								placeholder='Centerline (ATDC)'
								className='bg-slate-100'
								disabled
								value={intakeCenterline}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='exhaustCenterline'>Centerline (BTDC)</Label>
							<Input
								id='exhaustCenterline'
								type='number'
								placeholder='Centerline (BTDC)'
								className='bg-slate-100'
								disabled
								value={exhaustCenterline}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='ivo'>Open (BTDC)</Label>
							<Input
								id='ivo'
								type='number'
								placeholder='Open (BTDC)'
								onChange={(e) => setIvo(e.target.valueAsNumber)}
								value={ivo > 0 ? ivo : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='evo'>Open (BBDC)</Label>
							<Input
								id='evo'
								type='number'
								placeholder='Open (BBDC)'
								onChange={(e) => setEvo(e.target.valueAsNumber)}
								value={evo > 0 ? evo : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='ivc'>Close (ABDC)</Label>
							<Input
								id='ivc'
								type='number'
								placeholder='Close (ABDC)'
								onChange={(e) => setIvc(e.target.valueAsNumber)}
								value={ivc > 0 ? ivc : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='evc'>Close (ATDC)</Label>
							<Input
								id='evc'
								type='number'
								placeholder='Close (ATDC)'
								onChange={(e) => setEvc(e.target.valueAsNumber)}
								value={evc > 0 ? evc : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5 col-span-2'>
							<Label htmlFor='overlap'>Overlap</Label>
							<Input
								id='overlap'
								type='number'
								placeholder='Overlap'
								className='bg-slate-100'
								disabled
								value={overlap}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

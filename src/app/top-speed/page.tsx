'use client';

import Back from '@/components/back';
import SpeedCell from '@/components/calculators/speed-cell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useNumber } from '@/hooks/number';
import { calculateTireCircumference, generateRPMColumns } from '@/lib/number';
import { useMemo } from 'react';

export default function TopSpeed() {
	const [primaryDriveRatio, setPrimaryDriveRatio] = useNumber();
	const [tireWidth, setTireWidth] = useNumber();
	const [tireAspectRatio, setTireAspectRatio] = useNumber();
	const [maximumRPM, setMaximumRPM] = useNumber();
	const [frontSprocket, setFrontSprocket] = useNumber();
	const [rearSprocket, setRearSprocket] = useNumber();
	const [rimSize, setRimSize] = useNumber();
	const [firstGearFront, setFirstGearFront] = useNumber();
	const [firstGearRear, setFirstGearRear] = useNumber();
	const [secondGearFront, setSecondGearFront] = useNumber();
	const [secondGearRear, setSecondGearRear] = useNumber();
	const [thirdGearFront, setThirdGearFront] = useNumber();
	const [thirdGearRear, setThirdGearRear] = useNumber();
	const [fourthGearFront, setFourthGearFront] = useNumber();
	const [fourthGearRear, setFourthGearRear] = useNumber();
	const [fifthGearFront, setFifthGearFront] = useNumber();
	const [fifthGearRear, setFifthGearRear] = useNumber();
	const [sixthGearFront, setSixthGearFront] = useNumber();
	const [sixthGearRear, setSixthGearRear] = useNumber();

	const gearings = useMemo(
		() => [
			{
				label: 'Speed 1st Gear',
				ratio: firstGearFront / firstGearRear,
			},
			{
				label: 'Speed 2nd Gear',
				ratio: secondGearFront / secondGearRear,
			},
			{
				label: 'Speed 3rd Gear',
				ratio: thirdGearFront / thirdGearRear,
			},
			{
				label: 'Speed 4th Gear',
				ratio: fourthGearFront / fourthGearRear,
			},
			{
				label: 'Speed 5th Gear',
				ratio: fifthGearFront / fifthGearRear,
			},
			{
				label: 'Speed 6th Gear',
				ratio: sixthGearFront / sixthGearRear,
			},
		],
		[
			firstGearFront,
			firstGearRear,
			secondGearFront,
			secondGearRear,
			thirdGearFront,
			thirdGearRear,
			fourthGearFront,
			fourthGearRear,
			fifthGearFront,
			fifthGearRear,
			sixthGearFront,
			sixthGearRear,
		]
	);

	const rpmColumns = useMemo(() => generateRPMColumns(maximumRPM), [maximumRPM]);
	const tireCircumference = useMemo(
		() => calculateTireCircumference(tireWidth, tireAspectRatio, rimSize),
		[tireWidth, tireAspectRatio, rimSize]
	);

	return (
		<div className='h-full w-full flex items-center justify-center my-20 md:my-0'>
			<Card className='w-auto lg:mx-0'>
				<CardHeader>
					<CardTitle className='flex items-center'>
						Top Speed
						<Back href='/' iconOnly className='ml-auto' />
					</CardTitle>
					<CardDescription className='flex flex-col'>
						<span>Tire Circumference: {tireCircumference.toFixed(1)}</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid w-full items-center gap-4 grid-cols-1 md:grid-cols-3'>
						<div className='flex flex-col space-y-1.5 md:col-span-3'>
							<Label htmlFor='primaryDriveRatio'>Primary Drive Ratio</Label>
							<Input
								id='primaryDriveRatio'
								type='number'
								placeholder='Primary Drive Ratio'
								onChange={(e) => setPrimaryDriveRatio(e.target.valueAsNumber)}
								value={primaryDriveRatio > 0 ? primaryDriveRatio : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='tireWidth'>Tire Width</Label>
							<Input
								id='tireWidth'
								type='number'
								placeholder='Tire Width'
								onChange={(e) => setTireWidth(e.target.valueAsNumber)}
								value={tireWidth > 0 ? tireWidth : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='tireAspectRatio'>Tire Aspect Ratio</Label>
							<Input
								id='tireAspectRatio'
								type='number'
								placeholder='Tire Aspect Ratio'
								onChange={(e) => setTireAspectRatio(e.target.valueAsNumber)}
								value={tireAspectRatio > 0 ? tireAspectRatio : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='rimSize'>Rim/Mag Size</Label>
							<Input
								id='rimSize'
								type='number'
								placeholder='Rim/Mag Size'
								onChange={(e) => setRimSize(e.target.valueAsNumber)}
								value={rimSize > 0 ? rimSize : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='maximumRPM'>Maximum RPM</Label>
							<Input
								id='maximumRPM'
								type='number'
								placeholder='Maximum RPM'
								onChange={(e) => setMaximumRPM(e.target.valueAsNumber)}
								value={maximumRPM > 0 ? maximumRPM : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='frontSprocket'>Front Sprocket</Label>
							<Input
								id='frontSprocket'
								type='number'
								placeholder='Front Sprocket'
								onChange={(e) => setFrontSprocket(e.target.valueAsNumber)}
								value={frontSprocket > 0 ? frontSprocket : ''}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='rearSprocket'>Rear Sprocket</Label>
							<Input
								id='rearSprocket'
								type='number'
								placeholder='Rear Sprocket'
								onChange={(e) => setRearSprocket(e.target.valueAsNumber)}
								value={rearSprocket > 0 ? rearSprocket : ''}
							/>
						</div>
					</div>
					<div className='grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 pt-8 gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label>1st Gear Ratio</Label>
							<div className='flex items-center gap-1'>
								<Input
									id='firstGearFront'
									type='number'
									className='w-14'
									onChange={(e) => setFirstGearFront(e.target.valueAsNumber)}
									value={firstGearFront > 0 ? firstGearFront : ''}
								/>
								/
								<Input
									id='firstGearRear'
									type='number'
									className='w-14'
									onChange={(e) => setFirstGearRear(e.target.valueAsNumber)}
									value={firstGearRear > 0 ? firstGearRear : ''}
								/>
							</div>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label>2nd Gear Ratio</Label>
							<div className='flex items-center gap-1'>
								<Input
									id='secondGearFront'
									type='number'
									className='w-14'
									onChange={(e) => setSecondGearFront(e.target.valueAsNumber)}
									value={secondGearFront > 0 ? secondGearFront : ''}
								/>
								/
								<Input
									id='secondGearRear'
									type='number'
									className='w-14'
									onChange={(e) => setSecondGearRear(e.target.valueAsNumber)}
									value={secondGearRear > 0 ? secondGearRear : ''}
								/>
							</div>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label>3rd Gear Ratio</Label>
							<div className='flex items-center gap-1'>
								<Input
									id='thirdGearFront'
									type='number'
									className='w-14'
									onChange={(e) => setThirdGearFront(e.target.valueAsNumber)}
									value={thirdGearFront > 0 ? thirdGearFront : ''}
								/>
								/
								<Input
									id='thirdGearRear'
									type='number'
									className='w-14'
									onChange={(e) => setThirdGearRear(e.target.valueAsNumber)}
									value={thirdGearRear > 0 ? thirdGearRear : ''}
								/>
							</div>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label>4th Gear Ratio</Label>
							<div className='flex items-center gap-1'>
								<Input
									id='fourthGearFront'
									type='number'
									className='w-14'
									onChange={(e) => setFourthGearFront(e.target.valueAsNumber)}
									value={fourthGearFront > 0 ? fourthGearFront : ''}
								/>
								/
								<Input
									id='fourthGearRear'
									type='number'
									className='w-14'
									onChange={(e) => setFourthGearRear(e.target.valueAsNumber)}
									value={fourthGearRear > 0 ? fourthGearRear : ''}
								/>
							</div>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label>5th Gear Ratio</Label>
							<div className='flex items-center gap-1'>
								<Input
									id='fifthGearFront'
									type='number'
									className='w-14'
									onChange={(e) => setFifthGearFront(e.target.valueAsNumber)}
									value={fifthGearFront > 0 ? fifthGearFront : ''}
								/>
								/
								<Input
									id='fifthGearRear'
									type='number'
									className='w-14'
									onChange={(e) => setFifthGearRear(e.target.valueAsNumber)}
									value={fifthGearRear > 0 ? fifthGearRear : ''}
								/>
							</div>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label>6th Gear Ratio</Label>
							<div className='flex items-center gap-1'>
								<Input
									id='sixthGearFront'
									type='number'
									className='w-14'
									onChange={(e) => setSixthGearFront(e.target.valueAsNumber)}
									value={sixthGearFront > 0 ? sixthGearFront : ''}
								/>
								/
								<Input
									id='sixthGearRear'
									type='number'
									className='w-14'
									onChange={(e) => setSixthGearRear(e.target.valueAsNumber)}
									value={sixthGearRear > 0 ? sixthGearRear : ''}
								/>
							</div>
						</div>
					</div>
					<div className='grid w-full pt-8'>
						<div className='flex flex-col min-w-0'>
							<Table>
								<TableCaption>Speed Graph</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead />
										{rpmColumns.map((rpm, index) => (
											<TableHead key={index}>{rpm}</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{gearings.map(({ label, ratio }, index) => (
										<TableRow key={index}>
											<TableCell>{label}</TableCell>
											{rpmColumns.map((rpm, rpmIndex) => (
												<TableCell key={`${index}-${rpmIndex}`}>
													<div className='flex items-center justify-center'>
														<SpeedCell
															rpm={rpm}
															frontSprocket={frontSprocket}
															rearSprocket={rearSprocket}
															gearRatio={ratio}
															driveRatio={primaryDriveRatio}
															circumference={tireCircumference}
														/>
													</div>
												</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

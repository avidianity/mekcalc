'use client';

import Back from '@/components/back';
import DeleteDialog from '@/components/dialogs/DeleteDialog';
import LoadDialog from '@/components/dialogs/LoadDialog';
import SaveDialog from '@/components/dialogs/SaveDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirestoreItems } from '@/hooks/firestore';
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
import { yup } from '@/lib/yup';
import { useAuth } from '@/store/auth';
import { useCallback, useMemo, useState } from 'react';

const validator = yup.object({
	ivo: yup.number().required().min(1),
	ivc: yup.number().required().min(1),
	evo: yup.number().required().min(1),
	evc: yup.number().required().min(1),
});

const itemValidator = yup
	.array(
		validator.concat(
			yup.object({
				id: yup.string().required(),
				name: yup.string().required(),
			})
		)
	)
	.required();

export default function CamshaftTiming() {
	const [ivo, setIvo] = useNumber();
	const [ivc, setIvc] = useNumber();
	const [evo, setEvo] = useNumber();
	const [evc, setEvc] = useNumber();
	const user = useAuth((state) => state.user);
	const [saveOpen, setSaveOpen] = useState(false);
	const [loadOpen, setLoadOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [itemId, setItemId] = useState<string | null>(null);

	const collectionPath = `users/${user?.id}/camshaft-timing`;

	const { items } = useFirestoreItems(
		user,
		'camshaft-timing',
		itemValidator.validate.bind(itemValidator)
	);

	const clear = () => {
		setIvo(0);
		setIvc(0);
		setEvo(0);
		setEvc(0);
		setItemId(null);
	};

	const load = useCallback(
		(loadItemId: string) => {
			const item = items.find((item) => item.id === loadItemId);

			if (!item) {
				return;
			}

			setIvo(item.ivo);
			setIvc(item.ivc);
			setEvo(item.evo);
			setEvc(item.evc);

			setLoadOpen(false);
			setDeleteOpen(false);
			setItemId(item.id);
		},
		[items, setEvc, setEvo, setIvc, setIvo]
	);

	const data = useMemo(
		() => ({
			ivo,
			ivc,
			evo,
			evc,
		}),
		[evc, evo, ivc, ivo]
	);

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
								tabIndex={1}
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
								tabIndex={3}
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
								tabIndex={2}
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
								tabIndex={4}
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
				{user ? (
					<CardFooter className='flex gap-1'>
						<SaveDialog
							isOpen={saveOpen}
							onOpenChange={setSaveOpen}
							data={data}
							itemId={itemId}
							collectionPath={collectionPath}
							isValid={validator.isValidSync(data)}
						/>
						<LoadDialog isOpen={loadOpen} onOpenChange={setLoadOpen} items={items} onLoad={load} />
						{itemId ? (
							<>
								<Button
									type='button'
									variant='outline'
									onClick={(e) => {
										e.preventDefault();
										clear();
									}}
								>
									Clear
								</Button>
								<DeleteDialog
									isOpen={deleteOpen}
									onOpenChange={setDeleteOpen}
									itemId={itemId}
									collectionPath={collectionPath}
									onDelete={clear}
								/>
							</>
						) : null}
					</CardFooter>
				) : null}
			</Card>
		</div>
	);
}

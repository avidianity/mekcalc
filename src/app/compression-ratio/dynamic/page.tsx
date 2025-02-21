'use client';

import Back from '@/components/back';
import DeleteDialog from '@/components/dialogs/DeleteDialog';
import LoadDialog from '@/components/dialogs/LoadDialog';
import SaveDialog from '@/components/dialogs/SaveDialog';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirestoreItems } from '@/hooks/firestore';
import { useNumber } from '@/hooks/number';
import {
	calculateDisplacement,
	calculateDynamicCompressionRatio,
	calculateEffectiveStroke,
	calculateStaticCompressionRatio,
} from '@/lib/number';
import { yup } from '@/lib/yup';
import { useAuth } from '@/store/auth';
import { useCallback, useMemo, useState } from 'react';

const validator = yup.object({
	cylinders: yup.number().required().min(1),
	bore: yup.number().required().min(1),
	stroke: yup.number().required().min(1),
	unsweptVolume: yup.number().required().min(1),
	ivcAngle: yup.number().required().min(1),
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

export default function Dynamic() {
	const [cylinders, setCylinders] = useNumber(1);
	const [bore, setBore] = useNumber();
	const [stroke, setStroke] = useNumber();
	const [unsweptVolume, setUnsweptVolume] = useNumber();
	const [ivcAngle, setIvcAngle] = useNumber();
	const user = useAuth((state) => state.user);
	const [saveOpen, setSaveOpen] = useState(false);
	const [loadOpen, setLoadOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [itemId, setItemId] = useState<string | null>(null);

	const collectionPath = `users/${user?.id}/dynamic-compression-ratio`;

	const { items } = useFirestoreItems(collectionPath, itemValidator.validate.bind(itemValidator));

	const clear = () => {
		setCylinders(1);
		setBore(0);
		setStroke(0);
		setUnsweptVolume(0);
		setIvcAngle(0);
		setItemId(null);
	};

	const load = useCallback(
		(loadItemId: string) => {
			const item = items.find((item) => item.id === loadItemId);

			if (!item) {
				return;
			}

			setCylinders(item.cylinders);
			setBore(item.bore);
			setStroke(item.stroke);
			setUnsweptVolume(item.unsweptVolume);
			setIvcAngle(item.ivcAngle);

			setLoadOpen(false);
			setDeleteOpen(false);
			setItemId(item.id);
		},
		[items, setCylinders, setBore, setStroke, setUnsweptVolume, setIvcAngle]
	);

	const data = useMemo(
		() => ({
			cylinders,
			bore,
			stroke,
			unsweptVolume,
			ivcAngle,
		}),
		[cylinders, bore, stroke, unsweptVolume, ivcAngle]
	);

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

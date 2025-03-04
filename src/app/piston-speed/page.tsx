'use client';

import Back from '@/components/back';
import NumberInput from '@/components/base/inputs/number-input';
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
import { useFirestoreItems } from '@/hooks/firestore';
import { useNumber } from '@/hooks/number';
import { calculatePistonSpeed, calculateSafeRPM } from '@/lib/number';
import { yup } from '@/lib/yup';
import { useAuth } from '@/store/auth';
import { useCallback, useMemo, useState } from 'react';

const validator = yup.object({
	stroke: yup.number().required().min(1),
	rpm: yup.number().required().min(1),
	rodLength: yup.number().required().min(1),
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

export default function PistonSpeed() {
	const [stroke, setStroke] = useNumber();
	const [rpm, setRPM] = useNumber();
	const [rodLength, setRodLength] = useNumber();
	const user = useAuth((state) => state.user);
	const [saveOpen, setSaveOpen] = useState(false);
	const [loadOpen, setLoadOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [itemId, setItemId] = useState<string | null>(null);

	const collectionPath = `users/${user?.id}/piston-speed`;

	const { items } = useFirestoreItems(collectionPath, itemValidator.validate.bind(itemValidator));

	const clear = () => {
		setStroke(0);
		setRPM(0);
		setItemId(null);
	};

	const load = useCallback(
		(loadItemId: string) => {
			const item = items.find((item) => item.id === loadItemId);

			if (!item) {
				return;
			}

			setStroke(item.stroke);
			setRPM(item.rpm);
			setRodLength(item.rodLength);

			setLoadOpen(false);
			setDeleteOpen(false);
			setItemId(item.id);
		},
		[items, setStroke, setRPM, setRodLength]
	);

	const data = useMemo(
		() => ({
			stroke,
			rpm,
			rodLength,
		}),
		[stroke, rpm, rodLength]
	);

	const speeds = useMemo(() => calculatePistonSpeed(stroke, rpm), [stroke, rpm]);
	const safeSpeed = useMemo(() => calculateSafeRPM(stroke, rodLength), [stroke, rodLength]);

	return (
		<div className='h-full w-full flex items-center justify-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle className='flex items-center'>
						Piston Speed
						<Back href='/' iconOnly className='ml-auto' />
					</CardTitle>
					<CardDescription className='flex flex-col'>
						<span>Mean Speed: {speeds.meanSpeed}m/s</span>
						<span>Max Speed: {speeds.maxSpeed}m/s</span>
						<span>Safe RPM: {safeSpeed}rpm</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid w-full items-center gap-4'>
						<NumberInput id='stroke' placeholder='Stroke' onChange={setStroke} value={stroke} />
						<NumberInput
							id='rodLength'
							placeholder='Connecting Rod Length (mm)'
							onChange={setRodLength}
							value={rodLength}
						/>
						<NumberInput id='rpm' placeholder='RPM' onChange={setRPM} value={rpm} />
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

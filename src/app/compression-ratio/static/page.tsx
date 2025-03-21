'use client';

import Back from '@/components/back';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useNumber } from '@/hooks/number';
import { calculateDisplacement, calculateStaticCompressionRatio } from '@/lib/number';
import { yup } from '@/lib/yup';
import { useAuth } from '@/store/auth';
import { useCallback, useMemo, useState } from 'react';
import SaveDialog from '@/components/dialogs/SaveDialog';
import LoadDialog from '@/components/dialogs/LoadDialog';
import DeleteDialog from '@/components/dialogs/DeleteDialog';
import { useFirestoreItems } from '@/hooks/firestore';
import NumberInput from '@/components/base/inputs/number-input';

const validator = yup.object({
	cylinders: yup.number().required().min(1),
	bore: yup.number().required().min(1),
	stroke: yup.number().required().min(1),
	unsweptVolume: yup.number().required().min(1),
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

export default function Static() {
	const [cylinders, setCylinders] = useNumber(1);
	const [bore, setBore] = useNumber();
	const [stroke, setStroke] = useNumber();
	const [unsweptVolume, setUnsweptVolume] = useNumber();
	const user = useAuth((state) => state.user);
	const [saveOpen, setSaveOpen] = useState(false);
	const [loadOpen, setLoadOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [itemId, setItemId] = useState<string | null>(null);

	const collectionPath = `users/${user?.id}/static-compression-ratio`;

	const { items } = useFirestoreItems(
		user,
		'static-compression-ratio',
		itemValidator.validate.bind(itemValidator)
	);

	const clear = () => {
		setCylinders(1);
		setBore(0);
		setStroke(0);
		setUnsweptVolume(0);
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

			setLoadOpen(false);
			setDeleteOpen(false);
			setItemId(item.id);
		},
		[items, setCylinders, setBore, setStroke, setUnsweptVolume]
	);

	const data = useMemo(
		() => ({
			cylinders,
			bore,
			stroke,
			unsweptVolume,
		}),
		[cylinders, bore, stroke, unsweptVolume]
	);

	const displacement = useMemo(
		() => calculateDisplacement(bore, stroke, cylinders),
		[bore, stroke, cylinders]
	);

	const ratio = useMemo(() => {
		const result = calculateStaticCompressionRatio(displacement, unsweptVolume);

		if (!isFinite(result)) {
			return 0;
		}

		return result;
	}, [displacement, unsweptVolume]);

	return (
		<div className='h-full w-full flex items-center justify-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle className='flex items-center'>
						Static Compression Ratio
						<Back href='/compression-ratio' iconOnly className='ml-auto' />
					</CardTitle>
					<CardDescription className='flex flex-col'>
						<span>Displacement: {Math.floor(displacement)}cc</span>
						<span>Result: {ratio}:1</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid w-full items-center gap-4'>
						<NumberInput
							id='cylinders'
							placeholder='Cylinders'
							onChange={setCylinders}
							value={cylinders}
						/>
						<NumberInput id='bore' placeholder='Bore (mm)' onChange={setBore} value={bore} />
						<NumberInput
							id='stroke'
							placeholder='Stroke (mm)'
							onChange={setStroke}
							value={stroke}
						/>
						<NumberInput
							id='unsweptVolume'
							placeholder='Unswept Volume (cc)'
							onChange={setUnsweptVolume}
							value={unsweptVolume}
						/>
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

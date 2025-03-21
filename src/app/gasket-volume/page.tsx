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
import { calculateGasketVolume } from '@/lib/number';
import { yup } from '@/lib/yup';
import { useAuth } from '@/store/auth';
import { useCallback, useMemo, useState } from 'react';

const validator = yup.object({
	bore: yup.number().required().min(1),
	thickness: yup.number().required().min(1),
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

export default function GasketVolume() {
	const [bore, setBore] = useNumber();
	const [thickness, setThickness] = useNumber();
	const user = useAuth((state) => state.user);
	const [saveOpen, setSaveOpen] = useState(false);
	const [loadOpen, setLoadOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [itemId, setItemId] = useState<string | null>(null);

	const collectionPath = `users/${user?.id}/gasket-volume`;

	const { items } = useFirestoreItems(
		user,
		'gasket-volume',
		itemValidator.validate.bind(itemValidator)
	);

	const clear = () => {
		setBore(0);
		setThickness(0);
		setItemId(null);
	};

	const load = useCallback(
		(loadItemId: string) => {
			const item = items.find((item) => item.id === loadItemId);

			if (!item) {
				return;
			}

			setBore(item.bore);
			setThickness(item.thickness);

			setLoadOpen(false);
			setDeleteOpen(false);
			setItemId(item.id);
		},
		[items, setBore, setThickness]
	);

	const data = useMemo(
		() => ({
			bore,
			thickness,
		}),
		[bore, thickness]
	);

	const result = useMemo(() => calculateGasketVolume(bore, thickness), [bore, thickness]);

	return (
		<div className='h-full w-full flex items-center justify-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle className='flex items-center'>
						Gasket Volume
						<Back href='/' iconOnly className='ml-auto' />
					</CardTitle>
					<CardDescription className='flex flex-col'>
						<span>Result: {result}cc</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid w-full items-center gap-4'>
						<NumberInput id='bore' placeholder='Bore (mm)' onChange={setBore} value={bore} />
						<NumberInput
							id='thickness'
							placeholder='Thickness (mm)'
							onChange={setThickness}
							value={thickness}
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

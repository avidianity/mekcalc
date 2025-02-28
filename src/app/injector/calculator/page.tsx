'use client';

import Back from '@/components/back';
import NumberInput from '@/components/base/inputs/number-input';
import PercentageInput from '@/components/base/inputs/percentage-input';
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
import { calculateInjectorSize } from '@/lib/number';
import { yup } from '@/lib/yup';
import { useAuth } from '@/store/auth';
import { useCallback, useMemo, useState } from 'react';

const validator = yup.object({
	hp: yup.number().required().min(1),
	injectors: yup.number().required().min(1),
	maxIDC: yup.number().required().min(1),
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

export default function Calculator() {
	const [hp, setHp] = useNumber();
	const [injectors, setInjectors] = useNumber();
	const [maxIDC, setMaxIDC] = useState<number | null>(80);
	const user = useAuth((state) => state.user);
	const [saveOpen, setSaveOpen] = useState(false);
	const [loadOpen, setLoadOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [itemId, setItemId] = useState<string | null>(null);

	const collectionPath = `users/${user?.id}/injector-calculator`;

	const { items } = useFirestoreItems(collectionPath, itemValidator.validate.bind(itemValidator));

	const clear = () => {
		setHp(0);
		setInjectors(0);
		setMaxIDC(80);
		setItemId(null);
	};

	const load = useCallback(
		(loadItemId: string) => {
			const item = items.find((item) => item.id === loadItemId);

			if (!item) {
				return;
			}

			setHp(item.hp);
			setInjectors(item.injectors);
			setMaxIDC(item.maxIDC);

			setLoadOpen(false);
			setDeleteOpen(false);
			setItemId(item.id);
		},
		[items, setHp, setInjectors, setMaxIDC]
	);

	const data = useMemo(
		() => ({
			hp,
			injectors,
			maxIDC,
		}),
		[hp, injectors, maxIDC]
	);

	const result = useMemo(
		() => calculateInjectorSize(hp, injectors, (maxIDC ?? 80) / 100),
		[hp, injectors, maxIDC]
	);

	return (
		<div className='h-full w-full flex items-center justify-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle className='flex items-center'>
						Calculator
						<Back href='/' iconOnly className='ml-auto' />
					</CardTitle>
					<CardDescription className='flex flex-col'>
						<span>Result: {result.toFixed(0)}cc/min</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid w-full items-center gap-4'>
						<NumberInput id='hp' placeholder='Target Horsepower' onChange={setHp} value={hp} />
						<NumberInput
							id='injectors'
							placeholder='No. of Injectors'
							onChange={setInjectors}
							value={injectors}
						/>
						<PercentageInput
							id='maxIDC'
							placeholder='Max Injector Duty Cycle (Default: 80%)'
							onChange={setMaxIDC}
							value={maxIDC}
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

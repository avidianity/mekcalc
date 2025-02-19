'use client';

import Back from '@/components/back';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useNumber } from '@/hooks/number';
import { database } from '@/lib/firebase';
import { calculateDisplacement, calculateStaticCompressionRatio } from '@/lib/number';
import { yup } from '@/lib/yup';
import { useAuth } from '@/store/auth';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	onSnapshot,
	query,
	updateDoc,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

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

const presetValidator = yup.string().required();

export default function Static() {
	const [cylinders, setCylinders] = useNumber(1);
	const [bore, setBore] = useNumber();
	const [stroke, setStroke] = useNumber();
	const [unsweptVolume, setUnsweptVolume] = useNumber();
	const user = useAuth((state) => state.user);
	const [name, setName] = useState('');
	const [saveOpen, setSaveOpen] = useState(false);
	const [loadOpen, setLoadOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [items, setItems] = useState<yup.InferType<typeof itemValidator>>([]);
	const [itemId, setItemId] = useState<string | null>(null);
	const [itemIdToLoad, setItemIdToLoad] = useState<string | null>(null);

	const key = `users/${user?.id}/static-compression-ratio`;
	const table = collection(database, key);

	const clear = () => {
		setCylinders(1);
		setBore(0);
		setStroke(0);
		setUnsweptVolume(0);
		setItemId(null);
		setItemIdToLoad(null);
	};

	const remove = async () => {
		if (!itemId) {
			return;
		}

		setDeleting(true);

		try {
			const table = doc(database, key, itemId);

			await deleteDoc(table);

			clear();
			toast('Data deleted.');
		} catch (error) {
			console.error(error);
			toast('Unable to delete data.');
		} finally {
			setDeleting(false);
		}
	};

	const save = async () => {
		setSaving(true);
		try {
			if (itemId) {
				const table = doc(database, key, itemId);
				await updateDoc(table, data);
			} else {
				await addDoc(table, data);
			}

			toast('Data saved successfully!');
			setSaveOpen(false);
		} catch (error) {
			console.error(error);
			toast('Unable to save data');
		} finally {
			setSaving(false);
		}
	};

	const load = useCallback(() => {
		const item = items.find((item) => item.id === itemIdToLoad);

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
		setItemIdToLoad(null);
	}, [
		items,
		setCylinders,
		setBore,
		setStroke,
		setUnsweptVolume,
		setLoadOpen,
		itemIdToLoad,
		setDeleteOpen,
	]);

	const fetchItems = useCallback(async () => {
		try {
			const { docs } = await getDocs(query(table));

			const raw = docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setItems(await itemValidator.validate(raw));
		} catch (error) {
			console.error(error);
		}
	}, [table]);

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

	const data = useMemo(
		() => ({
			name,
			cylinders,
			bore,
			stroke,
			unsweptVolume,
		}),
		[name, cylinders, bore, stroke, unsweptVolume]
	);

	useEffect(() => {
		if (!saveOpen) {
			setName('');
		}
	}, [saveOpen]);

	useEffect(() => {
		const unsubscribe = onSnapshot(table, async (snapshot) => {
			const raw = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setItems(await itemValidator.validate(raw));
		});

		return () => {
			unsubscribe();
		};
	}, [setItems, table]);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

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
					</div>
				</CardContent>
				{user ? (
					<CardFooter className='flex gap-1'>
						<Dialog open={saveOpen} onOpenChange={setSaveOpen}>
							<DialogTrigger asChild>
								<Button type='button' variant='outline' disabled={!validator.isValidSync(data)}>
									Save
								</Button>
							</DialogTrigger>
							<DialogContent>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										save();
									}}
								>
									<DialogHeader>
										<DialogTitle>Save Data</DialogTitle>
									</DialogHeader>
									<div className='grid gap-4 py-4'>
										<div className='flex flex-col gap-4'>
											<Label htmlFor='name'>Name</Label>
											<Input
												id='name'
												value={name}
												onChange={(e) => setName(e.target.value)}
												disabled={saving}
											/>
										</div>
									</div>
									<DialogFooter>
										<Button type='submit' disabled={!presetValidator.isValidSync(name) || saving}>
											Save
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
						<Dialog
							open={loadOpen}
							onOpenChange={(open) => {
								if (!open) {
									setItemIdToLoad(null);
								}

								setLoadOpen(open);
							}}
						>
							<DialogTrigger asChild>
								<Button type='button' variant='outline'>
									Load
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Load Data</DialogTitle>
								</DialogHeader>
								<div className='grid gap-4 py-4'>
									<div className='flex flex-col gap-4'>
										<Label htmlFor='name'>Name</Label>
										<Select value={itemIdToLoad ?? ''} onValueChange={setItemIdToLoad}>
											<SelectTrigger>
												<SelectValue placeholder='Name' />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Name</SelectLabel>
													{items.map((item, index) => (
														<SelectItem key={index} value={item.id}>
															{item.name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								</div>
								<DialogFooter>
									<Button
										type='button'
										disabled={!itemIdToLoad}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											load();
										}}
									>
										Load
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						{itemId ? (
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
						) : null}
						{itemId ? (
							<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
								<AlertDialogTrigger asChild>
									<Button type='button' variant='destructive'>
										Delete
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you sure?</AlertDialogTitle>
										<AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={(e) => {
												e.preventDefault();
												remove();
											}}
											disabled={deleting}
										>
											Confirm
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						) : null}
					</CardFooter>
				) : null}
			</Card>
		</div>
	);
}

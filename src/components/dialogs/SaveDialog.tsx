'use client';

import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { database } from '@/lib/firebase';
import { toast } from 'sonner';

interface SaveDialogProps<T> {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	data: T;
	itemId: string | null;
	collectionPath: string;
	isValid: boolean;
	buttonText?: string;
}

export default function SaveDialog<T>({
	isOpen,
	onOpenChange,
	data,
	itemId,
	collectionPath,
	isValid,
	buttonText = 'Save',
}: SaveDialogProps<T>) {
	const [name, setName] = useState('');
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setName('');
		}
	}, [isOpen]);

	const save = async () => {
		setSaving(true);
		try {
			const saveData = { ...data, name };
			const table = collection(database, collectionPath);

			if (itemId) {
				const docRef = doc(database, collectionPath, itemId);
				await updateDoc(docRef, saveData);
			} else {
				await addDoc(table, saveData);
			}

			toast('Data saved successfully!');
			onOpenChange(false);
		} catch (error) {
			console.error(error);
			toast('Unable to save data');
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button type='button' variant='outline' disabled={!isValid}>
					{buttonText}
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
						<DialogDescription>Enter a name for your data</DialogDescription>
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
						<Button type='submit' disabled={!name.trim() || saving}>
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

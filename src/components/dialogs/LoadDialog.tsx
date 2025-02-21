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

interface LoadDialogProps<T> {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	items: Array<{ id: string; name: string } & T>;
	onLoad: (itemId: string) => void;
	buttonText?: string;
}

export default function LoadDialog<T>({
	isOpen,
	onOpenChange,
	items,
	onLoad,
	buttonText = 'Load',
}: LoadDialogProps<T>) {
	const [itemIdToLoad, setItemIdToLoad] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) {
			setItemIdToLoad(null);
		}
	}, [isOpen]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					setItemIdToLoad(null);
				}
				onOpenChange(open);
			}}
		>
			<DialogTrigger asChild>
				<Button type='button' variant='outline'>
					{buttonText}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Load Data</DialogTitle>
					<DialogDescription>Select data to load</DialogDescription>
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
							if (itemIdToLoad) {
								onLoad(itemIdToLoad);
							}
						}}
					>
						Load
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

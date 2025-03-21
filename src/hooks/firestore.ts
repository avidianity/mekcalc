/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import { collection, getDocs, query, onSnapshot } from 'firebase/firestore';
import { database } from '@/lib/firebase';
import { User } from '@/types/user';

/**
 * A custom hook to manage Firestore items with validation
 *
 * @param collectionPath The path to the Firestore collection
 * @param validator A validation function that returns the validated data
 * @returns An object containing items and fetchItems function
 */
export function useFirestoreItems<T>(
	user: User | null,
	collectionPath: string,
	validator: (data: unknown) => Promise<T[]> | T[]
) {
	const [items, setItems] = useState<T[]>([]);
	const table = useMemo(
		() => collection(database, `users/${user?.id}/${collectionPath}`),
		[collectionPath, user]
	);

	const fetchItems = useCallback(async () => {
		try {
			const { docs } = await getDocs(query(table));

			const raw = docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setItems(await validator(raw));
		} catch (error) {
			console.error(error);
		}
	}, [table]);

	useEffect(() => {
		const unsubscribe = onSnapshot(table, async (snapshot) => {
			const raw = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setItems(await validator(raw));
		});

		return () => {
			unsubscribe();
		};
	}, [table]);

	useEffect(() => {
		console.log('fetchItems', user);
		fetchItems();
	}, [table]);

	return { items, fetchItems };
}

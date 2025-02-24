'use client';

import { LogIn, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
	DialogHeader,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	AuthProvider,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import { useAuth } from '@/store/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

export default function AuthButton() {
	const { user, setUser } = useAuth();
	const [open, setOpen] = useState(false);

	const signIn = async (provider: AuthProvider) => {
		try {
			const { user } = await signInWithPopup(auth, provider);

			setUser({
				id: user.uid,
				name: user.displayName ?? '',
				email: user.email ?? '',
				pictureUrl: user.photoURL,
			});
			setOpen(false);
		} catch (error) {
			console.error('Login Error:', error);
		}
	};

	const logOut = async () => {
		await signOut(auth);
		toast('Logged out');
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(
				user
					? {
							id: user.uid,
							name: user.displayName ?? '',
							email: user.email ?? '',
							pictureUrl: user.photoURL,
					  }
					: null
			);
		});

		return () => unsubscribe();
	}, [setUser]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Tooltip>
				{!user ? (
					<>
						<TooltipTrigger asChild>
							<DialogTrigger asChild>
								<Button type='button' variant='outline' size='icon'>
									<LogIn />
								</Button>
							</DialogTrigger>
						</TooltipTrigger>
						<TooltipContent>Login</TooltipContent>
					</>
				) : (
					<>
						<TooltipTrigger asChild>
							<Button
								type='button'
								variant='outline'
								size='icon'
								onClick={(e) => {
									e.preventDefault();
									logOut();
								}}
							>
								<LogOut />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Logout</TooltipContent>
					</>
				)}
			</Tooltip>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Login/Register</DialogTitle>
					<DialogDescription>Sign in to enable saving of your data</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<Button
						type='button'
						variant='destructive'
						onClick={(e) => {
							e.preventDefault();
							signIn(new GoogleAuthProvider());
						}}
					>
						Google
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

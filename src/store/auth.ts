import { User } from '@/types/user';
import { create } from 'zustand';

export type AuthState = {
	user: User | null;
	setUser: (user: User | null) => void;
};

export const useAuth = create<AuthState>((set) => ({
	user: null,
	setUser(user) {
		set({
			user,
		});
	},
}));

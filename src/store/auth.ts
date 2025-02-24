import { User } from '@/types/user';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type AuthState = {
	user: User | null;
	setUser: (user: User | null) => void;
};

export const useAuth = create<AuthState>()(
	devtools((set) => ({
		user: null,
		setUser(user) {
			set({
				user,
			});
		},
	}))
);

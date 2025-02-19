import React from 'react';
import Logo from '@/components/logo';

export default function Menu({ children }: React.PropsWithChildren) {
	return (
		<div className='flex flex-col items-center justify-center h-full gap-1 pb-32'>
			<Logo />
			{children}
		</div>
	);
}

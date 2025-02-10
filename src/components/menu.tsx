import React from 'react';

export default function Menu({children}: React.PropsWithChildren) {
	return <div className='flex flex-col items-center justify-center h-full gap-1'>{children}</div>;
}

import Back from '@/components/back';
import Menu from '@/components/menu';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import Link from 'next/link';

export default function Inector() {
	return (
		<Menu>
			<Back href='/' className='w-56' />
			<Button type='button' className='w-56' asChild>
				<Link href='/injector/calculator' className='flex items-center gap-1'>
					<Calculator />
					Calculator
				</Link>
			</Button>
		</Menu>
	);
}

import Back from '@/components/back';
import Menu from '@/components/menu';
import { Button } from '@/components/ui/button';
import { Activity, Anchor } from 'lucide-react';
import Link from 'next/link';

export default function CompressionRatio() {
	return (
		<Menu>
			<Back href='/' className='w-56' />
			<Button type='button' className='w-56' asChild>
				<Link href='/compression-ratio/static' className='flex items-center gap-1'>
					<Anchor />
					Static Compression Ratio
				</Link>
			</Button>
			<Button type='button' className='w-56' asChild>
				<Link href='/compression-ratio/dynamic' className='flex items-center gap-1'>
					<Activity />
					Dynamic Compression Ratio
				</Link>
			</Button>
		</Menu>
	);
}

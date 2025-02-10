import Menu from '@/components/menu';
import { Button } from '@/components/ui/button';
import { Circle, Cog, Gauge } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	return (
		<Menu>
			<Button type='button' className='flex items-center gap-1 w-56' asChild>
				<Link href='/compression-ratio'>
					<Gauge />
					Compression Ratio
				</Link>
			</Button>
			<Button type='button' className='flex items-center gap-1 w-56' asChild>
				<Link href='/gasket-volume'>
					<Circle />
					Gasket Volume
				</Link>
			</Button>
			<Button type='button' className='flex items-center gap-1 w-56' asChild>
				<Link href='/camshaft-timing'>
					<Cog />
					Camshaft Timing
				</Link>
			</Button>
		</Menu>
	);
}

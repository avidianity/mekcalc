import Menu from '@/components/menu';
import { Button } from '@/components/ui/button';
import { ChevronsUp, Circle, Cog, Cylinder, Gauge, Omega, Syringe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	return (
		<Menu>
			<Button type='button' className='flex items-center gap-1 w-56' asChild>
				<Link href='/engine-displacement'>
					<Cylinder />
					Engine Displacement
				</Link>
			</Button>
			<Button type='button' className='flex items-center gap-1 w-56' asChild>
				<Link href='/compression-ratio'>
					<Omega />
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
			<Button type='button' className='flex items-center gap-1 w-56' asChild>
				<Link href='/top-speed'>
					<Gauge />
					Top Speed
				</Link>
			</Button>
			<Button type='button' className='flex items-center gap-1 w-56' asChild>
				<Link href='/injector'>
					<Syringe />
					Injector
				</Link>
			</Button>
			<Button type='button' className='flex items-center gap-1 w-56' asChild>
				<Link href='/piston-speed'>
					<ChevronsUp />
					Piston Speed
				</Link>
			</Button>
		</Menu>
	);
}

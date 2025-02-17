'use client';

import Menu from '@/components/menu';
import { Button } from '@/components/ui/button';
import { calculateSpeed, calculateTireCircumference } from '@/lib/number';
import { Circle, Cog, Cylinder, Gauge, Omega } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
	useEffect(() => {
		// Example usage:
		const circumference = calculateTireCircumference(60, 80, 17);
		const speed = calculateSpeed(13050, 14, 32, 25 / 27, 3.285, circumference);
		console.log('circumference', circumference);
		console.log(`Speed at 14500 RPM: ${speed} km/h`);
	}, []);

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
		</Menu>
	);
}

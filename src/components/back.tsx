import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
	href: string;
	className?: string;
	iconOnly?: boolean;
};

export default function Back({ href, className, iconOnly = false }: Props) {
	return (
		<Button type="button" size={iconOnly ? 'icon' : 'default'} className={className} asChild>
			<Link href={href} className="flex items-center gap-1">
				<ChevronLeft />
				{!iconOnly ? <span className="mr-2">Go Back</span> : null}
			</Link>
		</Button>
	);
}

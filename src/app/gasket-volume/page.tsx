'use client';

import Back from '@/components/back';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNumber } from '@/hooks/number';
import { calculateGasketVolume } from '@/lib/number';
import { useMemo } from 'react';

export default function GasketVolume() {
	const [bore, setBore] = useNumber();
	const [thickness, setThickness] = useNumber();

	const result = useMemo(() => calculateGasketVolume(bore, thickness), [bore, thickness]);

	return (
		<div className="h-full w-full flex items-center justify-center">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle className="flex items-center">
						Gasket Volume
						<Back href="/" iconOnly className="ml-auto" />
					</CardTitle>
					<CardDescription className="flex flex-col">
						<span>Result: {result}cc</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="bore">Bore (mm)</Label>
							<Input
								id="bore"
								type="number"
								placeholder="Bore (mm)"
								onChange={(e) => setBore(e.target.valueAsNumber)}
								value={bore > 0 ? bore : ''}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="thickness">Thickness (mm)</Label>
							<Input
								id="thickness"
								type="number"
								placeholder="Thickness (mm)"
								onChange={(e) => setThickness(e.target.valueAsNumber)}
								value={thickness > 0 ? thickness : ''}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

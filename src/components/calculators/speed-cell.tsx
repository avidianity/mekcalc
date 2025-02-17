import { calculateSpeed } from '@/lib/number';
import { useMemo } from 'react';

type Props = {
	rpm: number;
	frontSprocket: number;
	rearSprocket: number;
	gearRatio: number;
	driveRatio: number;
	circumference: number;
};

export default function SpeedCell({
	rpm,
	frontSprocket,
	rearSprocket,
	gearRatio,
	driveRatio,
	circumference,
}: Props) {
	const speed = useMemo(
		() => calculateSpeed(rpm, frontSprocket, rearSprocket, gearRatio, driveRatio, circumference),
		[rpm, frontSprocket, rearSprocket, gearRatio, driveRatio, circumference]
	);

	return speed;
}

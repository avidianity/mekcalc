export function calculateDisplacement(bore: number, stroke: number, cylinders = 1) {
	const displacement = (Math.PI / 4) * Math.pow(bore, 2) * stroke * cylinders;

	return displacement / 1000;
}

export function calculateStaticCompressionRatio(displacement: number, unsweptVolume: number) {
	const result = (displacement + unsweptVolume) / unsweptVolume;

	return Number(result.toFixed(1));
}

export function calculateEffectiveStroke(bore: number, stroke: number, ivcAngle: number) {
	// Convert IVC angle to radians
	const ivcRad = (ivcAngle * Math.PI) / 180;

	// Calculate Effective Stroke (Seff) using only stroke and IVC angle
	const effectiveStroke = (stroke * (1 + Math.cos(ivcRad))) / 2;

	if (isNaN(effectiveStroke)) {
		return 0;
	}

	return effectiveStroke;
}

export function calculateEffectiveSweptVolume(bore: number, effectiveStroke: number) {
	// Convert bore from mm to cm
	const boreCm = bore / 10;

	// Calculate Effective Swept Volume (SV_effective)
	const svEffective = (Math.PI / 4) * Math.pow(boreCm, 2) * (effectiveStroke / 10);

	if (isNaN(svEffective)) {
		return 0;
	}

	return svEffective;
}

export function calculateDynamicCompressionRatio(
	bore: number,
	stroke: number,
	unsweptVolume: number,
	ivcAngle: number
) {
	const effectiveStroke = calculateEffectiveStroke(bore, stroke, ivcAngle);

	// Calculate Effective Swept Volume (SV_effective)
	const svEffective = calculateEffectiveSweptVolume(bore, effectiveStroke);

	// Calculate Dynamic Compression Ratio (DCR)
	const dcr = (svEffective + unsweptVolume) / unsweptVolume;

	if (isNaN(dcr) || dcr === Infinity) {
		return 0;
	}

	// Round the result to two decimal places
	return Number(dcr.toFixed(2));
}

export function calculateGasketVolume(bore: number, thickness: number) {
	const radius = bore / 2; // Convert bore to radius
	const volume = Math.PI * Math.pow(radius, 2) * thickness; // Volume in mm³
	return Number((volume / 1000).toFixed(2)); // Convert mm³ to cc and round to 2 decimal places
}

// Function to calculate Lobe Separation Angle (LSA)
export function calculateLSA(intakeCenterline: number, exhaustCenterline: number) {
	return (intakeCenterline + exhaustCenterline) / 2;
}

// Function to calculate Intake Duration
export function calculateIntakeDuration(IVO: number, IVC: number) {
	return IVO + 180 + IVC;
}

// Function to calculate Exhaust Duration
export function calculateExhaustDuration(EVO: number, EVC: number) {
	return EVO + 180 + EVC;
}

// Function to calculate Advance (how much the intake lobe is advanced)
export function calculateAdvance(LSA: number, intakeCenterline: number) {
	return LSA - intakeCenterline;
}

// Function to calculate Intake Centerline
export function calculateIntakeCenterline(IVO: number, intakeDuration: number) {
	return intakeDuration / 2 - IVO;
}

// Function to calculate Exhaust Centerline
export function calculateExhaustCenterline(EVC: number, exhaustDuration: number) {
	return exhaustDuration / 2 - EVC;
}

// Function to calculate Overlap (when both intake & exhaust valves are open)
export function calculateOverlap(IVO: number, EVC: number) {
	return IVO + EVC;
}

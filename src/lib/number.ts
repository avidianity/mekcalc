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

export function calculateTireCircumference(
	width: number,
	aspectRatio: number,
	rimDiameter: number
): number {
	// Convert rim diameter from inches to mm
	const rimDiameterMM = rimDiameter * 25.4;

	// Calculate sidewall height
	const sidewallHeight = (aspectRatio / 100) * width;

	// Calculate total tire diameter
	const totalDiameter = rimDiameterMM + 2 * sidewallHeight;

	// Calculate circumference using C = π × D
	return Math.PI * totalDiameter;
}

export function calculateSpeed(
	rpm: number,
	frontSprocket: number,
	rearSprocket: number,
	gearRatio: number,
	driveRatio: number,
	circumference: number
): number {
	// Compute total transmission ratio, including the drive ratio
	const totalTransmissionRatio = (rearSprocket / frontSprocket) * gearRatio * driveRatio;

	// Compute wheel RPM (engine RPM divided by the transmission ratio)
	const wheelRPM = rpm / totalTransmissionRatio;

	// Convert circumference from mm to meters (divide by 1000)
	const circumferenceMeters = circumference / 1000; // now in meters

	// Calculate speed in meters per minute
	const speedMetersPerMinute = wheelRPM * circumferenceMeters;

	// Convert to kilometers per hour (multiply by 60 to get minutes to hours, then divide by 1000 to convert meters to kilometers)
	const speedKilometersPerHour = (speedMetersPerMinute * 60) / 1000;

	if (isNaN(speedKilometersPerHour)) {
		return 0;
	}

	return Number(speedKilometersPerHour.toFixed(0));
}

export function generateRPMColumns(maximumRPM: number): number[] {
	if (maximumRPM <= 0) {
		return [];
	}

	const increment = maximumRPM / 10;
	const rpmColumn: number[] = [];

	for (let rpm = 0; rpm <= maximumRPM; rpm += increment) {
		rpmColumn.push(Number(rpm.toFixed(0)));
	}

	return rpmColumn;
}

/**
 * Calculates the required injector size in cc/min per injector.
 * @param hp - Target horsepower.
 * @param numInjectors - Number of injectors.
 * @param bsfc - Brake Specific Fuel Consumption (default: 0.5 for NA engines).
 * @param maxIDC - Maximum Injector Duty Cycle (default: 80% or 0.8).
 * @returns Required injector size per injector in cc/min.
 */
export function calculateInjectorSize(
	hp: number,
	numInjectors: number,
	maxIDC = 0.8,
	bsfc = 0.5
): number {
	const fuelMultiplier = 10.5; // Conversion factor
	const result = (hp * bsfc * fuelMultiplier) / (numInjectors * maxIDC);

	if (isNaN(result) || result === Infinity) {
		return 0;
	}

	return result;
}

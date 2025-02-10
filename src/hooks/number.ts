'use client';

import { useState } from 'react';

export function useNumber(defaultValue = 0): [number, (value: unknown) => void] {
	const [value, setValue] = useState(defaultValue);

	const setter = (value: unknown) => {
		const result = Number(value);

		setValue(isNaN(result) ? 0 : result);
	};

	return [value, setter];
}

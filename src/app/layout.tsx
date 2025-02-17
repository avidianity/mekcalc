import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import ThemeToggle from '@/components/theme-toggle';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'MekCalc',
	description:
		'is an advanced tool for redesigning 4-stroke engines, ideal for racers and daily modification enthusiasts.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased md:h-screen relative`}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<ThemeToggle />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}

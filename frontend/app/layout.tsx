import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'DOIT - Projektowanie Serwisów Internetowych',
	description:
		'Aplikacja stworzona na potrzeby zaliczenia przedmiotu Projektowanie Serwisów Internetowych',
	icons: {
		icon: 'http://foka.wi.local/~s51672/PSI/Projekt/frontend/DOIT-sygnet.svg',
		apple: 'http://foka.wi.local/~s51672/PSI/Projekt/frontend/DOIT-sygnet.svg',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='pl'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}

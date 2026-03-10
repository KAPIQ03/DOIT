import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='flex h-screen w-full flex-col items-center justify-center bg-gray-100 text-gray-800'>
			<h1 className='text-4xl font-bold'>404</h1>
			<p className='mt-2 text-lg'>Strona nie została znaleziona.</p>
			<Link
				href='/login'
				className='mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
				Wróć do logowania
			</Link>
		</div>
	);
}

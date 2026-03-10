'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';
import { useState } from 'react';
import Image from 'next/image';
import logo from '@/public/DOIT.svg';

export default function LoginPage() {
	const { login } = useAuth({
		middleware: 'guest',
		redirectIfAuthenticated: '/dashboard',
	});

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<string[]>([]);
	const [status, setStatus] = useState(null);

	const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		login({ email, password, setErrors, setStatus });
	};

	return (
		<div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 '>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<Image
					src={logo}
					alt='Doit Logo'
					width={200}
					height={200}
					className='mx-auto my-2'
				/>
				<h2 className='mt-6 text-center text-xl md:text-3xl font-extrabold text-gray-900'>
					Zaloguj się do swojego konta
				</h2>
			</div>

			<div className='mt-8 sm:mx-auto w-full sm:max-w-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form className='space-y-6' onSubmit={submitForm}>
						{errors.length > 0 && (
							<div
								className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
								role='alert'>
								<strong className='font-bold'>Whoops!</strong>
								<span className='block sm:inline ml-2'>
									Coś poszło nie tak.
								</span>
								<ul className='mt-3 list-disc list-inside text-sm'>
									{errors.map((error, index) => (
										<li key={index}>{error}</li>
									))}
								</ul>
							</div>
						)}

						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700'>
								Adres email
							</label>
							<div className='mt-1'>
								<input
									id='email'
									name='email'
									type='email'
									autoComplete='email'
									required
									value={email}
									onChange={event => setEmail(event.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700'>
								Hasło
							</label>
							<div className='mt-1'>
								<input
									id='password'
									name='password'
									type='password'
									autoComplete='current-password'
									required
									value={password}
									onChange={event => setPassword(event.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
								Zaloguj się
							</button>
						</div>
					</form>

					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300' />
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>Lub</span>
							</div>
						</div>

						<div className='mt-6'>
							<Link
								href='/register'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
								Utwórz nowe konto
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

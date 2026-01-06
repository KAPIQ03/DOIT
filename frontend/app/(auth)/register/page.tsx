// frontend/app/(auth)/register/page.tsx
'use client'; // Oznaczamy jako Client Component
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';
import { useState } from 'react';

export default function RegisterPage() {
	const { register } = useAuth({
		middleware: 'guest',
		redirectIfAuthenticated: '/dashboard',
	});

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [errors, setErrors] = useState<string[]>([]);
	const [status, setStatus] = useState(null);

	const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		register({
			name,
			email,
			password,
			password_confirmation: passwordConfirmation,
			setErrors,
			setStatus,
		});
	};

	return (
		<div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
					Stwórz nowe konto
				</h2>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form className='space-y-6' onSubmit={submitForm}>
						{/* Validation Errors */}
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
								htmlFor='name'
								className='block text-sm font-medium text-gray-700'>
								Nazwa użytkownika
							</label>
							<div className='mt-1'>
								<input
									id='name'
									name='name'
									type='text'
									autoComplete='name'
									required
									value={name}
									onChange={event => setName(event.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none text-gray-900 focus:ring-red-500 focus:border-red-500 sm:text-sm'
								/>
							</div>
						</div>

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
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none text-gray-900 focus:ring-red-500 focus:border-red-500 sm:text-sm'
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
									autoComplete='new-password'
									required
									value={password}
									onChange={event => setPassword(event.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='password-confirm'
								className='block text-sm font-medium text-gray-700'>
								Potwierdź hasło
							</label>
							<div className='mt-1'>
								<input
									id='password-confirm'
									name='password_confirmation'
									type='password'
									autoComplete='new-password'
									required
									value={passwordConfirmation}
									onChange={event =>
										setPasswordConfirmation(event.target.value)
									}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
								Zarejestruj się
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
								href='/login'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
								Masz już konto? Zaloguj się
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

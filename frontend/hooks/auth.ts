import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = ({
	middleware,
	redirectIfAuthenticated,
}: {
	middleware?: 'auth' | 'guest';
	redirectIfAuthenticated?: string;
} = {}) => {
	const router = useRouter();

	const {
		data: user,
		error,
		mutate,
	} = useSWR(
		'/api/user',
		() =>
			axios
				.get('/api/user')
				.then(res => res.data)
				.catch(error => {
					throw error;
				}),
		{
			shouldRetryOnError: false,
		}
	);

	const setToken = (token: string) => {
		localStorage.setItem('token', token);
		mutate();
	};

	const register = async ({ setErrors, ...props }: any) => {
		setErrors([]);
		axios
			.post('/api/register', props)
			.then(res => {
				setToken(res.data.token);
			})
			.catch(error => {
				if (error.response.status !== 422) throw error;

				const errors = error.response.data.errors || {};
				let errorMessages = Object.values(errors).flat();

				if (errorMessages.length === 0 && error.response.data.message) {
					errorMessages = [error.response.data.message];
				}

				setErrors(errorMessages as string[]);
			});
	};

	const login = async ({ setErrors, setStatus, ...props }: any) => {
		setErrors([]);
		setStatus(null);
		axios
			.post('/api/login', props)
			.then(res => {
				setToken(res.data.token);
			})
			.catch(error => {
				if (error.response.status !== 422 && error.response.status !== 401)
					throw error;

				const errors = error.response.data.errors || {};
				let errorMessages = Object.values(errors).flat();

				if (errorMessages.length === 0 && error.response.data.message) {
					errorMessages = [error.response.data.message];
				}

				setErrors(errorMessages as string[]);
			});
	};

	const logout = async () => {
		try {
			await axios.post('/api/logout');
		} catch (e) {}

		localStorage.removeItem('token');
		mutate(null, false);
		window.location.pathname = '/login';
	};

	useEffect(() => {
		if (middleware === 'guest' && redirectIfAuthenticated && user)
			router.push(redirectIfAuthenticated);
		if (middleware === 'auth' && error) router.push('/login');
	}, [user, error, middleware, redirectIfAuthenticated, router]);

	return {
		user,
		register,
		login,
		logout,
	};
};

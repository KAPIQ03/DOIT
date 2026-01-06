// frontend/hooks/auth.ts
import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = ({ middleware, redirectIfAuthenticated }: { middleware?: 'auth' | 'guest', redirectIfAuthenticated?: string } = {}) => {
    const router = useRouter();

    // Pobieranie użytkownika (działa tylko jeśli mamy token w localStorage)
    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios.get('/api/user')
            .then(res => res.data)
            .catch(error => {
                // Jeśli 401, SWR zwróci błąd, co obsłużymy w useEffect
                throw error;
            }),
        {
             shouldRetryOnError: false 
        }
    );

    const setToken = (token: string) => {
        localStorage.setItem('token', token);
        mutate(); // Odśwież SWR (pobierz usera używając nowego tokena)
    };

    const register = async ({ setErrors, ...props }: any) => {
        setErrors([]);
        axios
            .post('/api/register', props)
            .then((res) => {
                // Backend zwraca { user, token }
                setToken(res.data.token); 
            })
            .catch(error => {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
            });
    };

    const login = async ({ setErrors, setStatus, ...props }: any) => {
        setErrors([]);
        setStatus(null);
        axios
            .post('/api/login', props)
            .then((res) => {
                // Backend zwraca { user, token }
                setToken(res.data.token);
            })
            .catch(error => {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
            });
    };

    const logout = async () => {
        // Opcjonalnie: wołamy backend, żeby unieważnił token
        try {
             await axios.post('/api/logout');
        } catch (e) {
            // Ignorujemy błąd wylogowania
        }
        
        localStorage.removeItem('token');
        mutate(null, false); // Wyczyść dane usera w SWR
        window.location.pathname = '/login';
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated);
        if (middleware === 'auth' && error) router.push('/login'); 
    }, [user, error, middleware, redirectIfAuthenticated, router]);

    return {
        user,
        register,
        login,
        logout,
    };
};
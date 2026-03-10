import axios from 'axios';

const BASIC_AUTH_TOKEN = 'c3R1ZGVudDpzdHVkZW50';

const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

axiosClient.interceptors.request.use(config => {
	config.headers.Authorization = `Basic ${BASIC_AUTH_TOKEN}`;

	const token =
		typeof window !== 'undefined' ? localStorage.getItem('token') : null;
	if (token) {
		config.headers['X-Authorization'] = `Bearer ${token}`;
	}

	return config;
});

export default axiosClient;

import axios from 'axios';

export const zabApi = axios.create({
	baseURL: '/api',
	withCredentials: true
});

export const vatusaApi = axios.create({
	baseURL: 'https://api.vatusa.net/v2',
	params: {
		apikey: '2619l5gS8BT4Gf6U', //import.meta.env.VITE_VATUSA_API_KEY,
	},
});

export const vatusaApiAuth = axios.create({
	baseURL: 'https://api.vatusa.net/v2',
	withCredentials: true,
});
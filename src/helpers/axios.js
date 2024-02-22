import axios from 'axios';

export const zabApi = axios.create({
	baseURL: '/api',
	withCredentials: true
});

export const vatusaApi = axios.create({
	baseURL: 'https://api.vatusa.net/v2'
});

export const vatusaApiAuth = axios.create({
	baseURL: 'https://api.vatusa.net/v2',
	withCredentials: true,
});
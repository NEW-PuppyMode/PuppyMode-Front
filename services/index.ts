import axios from 'axios';

export const axiosInstance = axios.create({
  adapter: 'fetch',
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

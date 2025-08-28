import axios from 'axios';

const MOCK_ACTIVATE = process.env.MOCK_ACTIVATE;

const baseUrl =
  MOCK_ACTIVATE === 'enable'
    ? process.env.EXPO_PUBLIC_MOCK_API_URL
    : process.env.EXPO_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  adapter: 'fetch',
  baseURL: baseUrl,
  withCredentials: true,
});

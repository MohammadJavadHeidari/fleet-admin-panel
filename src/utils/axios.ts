import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'http://localhost:3000/api/admin' });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const API_ENDPOINTS = {
  auth: {
    me: '/auth/me',
    signIn: '/auth/sign-in',
    register: '/auth/register',
  },
  station: {
    list: '/station/list',
    new: '/station/new',
    //   details: '/mail/details',
    //   labels: '/mail/labels',
  },
  // post: {
  //   list: '/post/list',
  //   details: '/post/details',
  //   latest: '/post/latest',
  //   search: '/post/search',
  // },
  // product: {
  //   list: '/product/list',
  //   details: '/product/details',
  //   search: '/product/search',
  // },
};

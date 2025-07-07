import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'http://localhost:3000/api' });

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

const ADMIN_BASE_URL = '/admin';
const DRIVER_BASE_URL = '/driver';
const EMPLOYEE_BASE_URL = '/employee';

export const API_ENDPOINTS = {
  admin: {
    auth: {
      me: `${ADMIN_BASE_URL}/auth/me`,
      signIn: `${ADMIN_BASE_URL}/auth/sign-in`,
    },
  },

  auth: {
    me: '/auth/me',
    signIn: '/auth/sign-in',
    register: '/auth/register',
  },
  // Employee
  employee: {
    list: '/employee/list',
    new: '/employee/new',

    auth: {
      me: `${EMPLOYEE_BASE_URL}/auth/me`,
      requestOtp: `${EMPLOYEE_BASE_URL}/auth/otp/request`,
      verifyOtp: `${EMPLOYEE_BASE_URL}/auth/otp/verify`,
    },
  },
  // Driver
  driver: {
    list: '/driver/list',
    new: '/driver/new',

    auth: {
      me: `${DRIVER_BASE_URL}/auth/me`,
      requestOtp: `${DRIVER_BASE_URL}/auth/otp/request`,
      verifyOtp: `${DRIVER_BASE_URL}/auth/otp/verify`,
    },
    location: {
      save: `${DRIVER_BASE_URL}/location/save`,
    },
    route: {
      assigned: `${DRIVER_BASE_URL}/route/assigned`,
    },
  },
  station: {
    list: '/station/list',
    new: '/station/new',
  },
  route: {
    list: '/route/list',
    new: '/route/new',
  },
};

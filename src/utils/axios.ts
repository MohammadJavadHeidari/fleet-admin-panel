import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'http://localhost:3000/api/admin' });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

export const API_ENDPOINTS = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
    register: '/auth/register',
  },
  // mail: {
  //   list: '/mail/list',
  //   details: '/mail/details',
  //   labels: '/mail/labels',
  // },
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

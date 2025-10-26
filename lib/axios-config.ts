import axios from 'axios';
//import { cookies } from 'next/headers';
import Cookies from 'js-cookie';

//const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // Adjust as needed
  headers: {
    'Content-Type': 'application/json',
  },
});



console.log('Cookies:', document.cookie); // Check all cookies
console.log('auth-token:', Cookies.get('auth-token')); // Check the specific token

// Add request interceptors here
axiosInstance.interceptors.request.use(
  async (config) => {
     //const token ='123';
    // document.cookie.replace(/(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    //const token = 

    

    const cookies = document.cookie;
    let authToken: string | null = null;
    if (cookies) {
      const cookiesArray = cookies.split(';');
      for (let i = 0; i < cookiesArray.length; i++) {
        const cookie = cookiesArray[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.startsWith('auth-token=')) {
          authToken = cookie.substring('auth-token='.length);
          break;
        }
      }
    }

    

    if (authToken) {
    
      console.log('authToken in interceptor:', authToken);
      config.headers.Authorization = `Bearer ${authToken}`;
   }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add response interceptors here
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

// Helper function for server-side requests
export const createServerAxios = (authToken?: string) => {
  const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` })
    },
  });

  // Add response interceptor for server instance
  serverAxios.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return serverAxios;
};

export default axiosInstance;

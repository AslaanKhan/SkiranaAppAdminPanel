// lib/axios.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  // baseURL: `http://localhost:1337/api`, // Change to your API URL
  baseURL: `https://mongonode-production.up.railway.app/api`, // Change to your API URL
});

let activeRequests = 0;

// Interceptor to add token to the request headers
axiosInstance.interceptors.request.use(
  async (config) => {
    activeRequests++;
    try {
      const token = await AsyncStorage.getItem('token'); // Replace 'token' with the key where you store the token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Add the token in Authorization header
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage', error);
    }
    return config;
  },
  (error) => {
    activeRequests--;
    return Promise.reject(error);
  }
);

// Interceptor to manage the request counter and handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests--;
    return response;
  },
  (error) => {
    activeRequests--;
    return Promise.reject(error);
  }
);

export const isLoading = () => activeRequests > 0;
export default axiosInstance;

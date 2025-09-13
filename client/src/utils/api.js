import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Adjust this to your backend URL
  withCredentials: true, // This is important for sending cookies
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      // You could redirect to a login page here, for example.
      // window.location = '/auth';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

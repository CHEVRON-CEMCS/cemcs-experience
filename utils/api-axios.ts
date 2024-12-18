// utils/api-axios.ts
import axios from 'axios';

const apiAxios = axios.create({
  baseURL: 'https://staging.chevroncemcs.com',
  auth: {
    username: 'd5ea6c1a0aaeb82',
    password: '0476216f7e4e8ca'
  }
});

// Add request interceptor to always include credentials
apiAxios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export default apiAxios;
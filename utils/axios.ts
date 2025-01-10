import axios from 'axios'

const api = axios.create({
  withCredentials: true // This is important for handling cookies
})

// Add request interceptor to always include credentials
api.interceptors.request.use((config) => {
  config.withCredentials = true
  return config
})

export default api
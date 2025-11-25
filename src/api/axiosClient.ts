// src/api/axiosClient.ts
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL as string

export const apiClient = axios.create({
    baseURL,
    timeout: 10000,
})

// interceptor Çí«â¡ÇµÇΩÇ¢èÍçáÅF
// apiClient.interceptors.response.use(...);

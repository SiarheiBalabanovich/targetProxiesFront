import axios, { type AxiosInstance } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: '*/*',
  },
})

axiosInstance.interceptors.request.use(
  async (config) => {
    config.baseURL += `/`
    config.headers['Accept-Language'] = 'en'
    return config
  },
  async (error) => await Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return await Promise.reject(error)
  },
)
export default axiosInstance

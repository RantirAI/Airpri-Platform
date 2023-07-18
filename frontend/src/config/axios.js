import axios from 'axios'

const Axios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 8000
})

export const setAxiosToken = (token) => {
    return (Axios.interceptors.request.use(
        async (config) => {
            config.headers = {
                Authorization: `Bearer ${token}`,
            };
            return config;
        },
        (error) => {
            Promise.reject(error);
        }
    ))
}

Axios.interceptors.response.use(
  async (response) => response,
  (error) => Promise.reject(error?.response?.data?.message || error?.response?.data?.error || error?.response?.data || error?.response || error?.message || error)
);

export default Axios
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


export default Axios
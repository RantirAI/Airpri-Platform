import axios from 'axios'

const Axios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 1000000
})

export const setAxiosToken = (token) => {
    if (token) {
        Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete Axios.defaults.headers.common['Authorization'];
    }
};

Axios.interceptors.response.use(
    async (response) => response,
    (error) => Promise.reject(error?.response?.data?.message || error?.response?.data?.error || error?.response?.data || error?.response || error?.message || error)
);

export default Axios
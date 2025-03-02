import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_URL_API,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/refresh-token';
        }
        return Promise.reject(error);
    }
);

export default api;
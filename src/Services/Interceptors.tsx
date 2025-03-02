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
    async (error) => {
        const originalRequest = error.config;

        // Verifica si el error es debido a un token expirado (401) y si no se ha intentado refrescar antes
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Intenta refrescar el token
                const newToken = await refreshAccessToken();
                localStorage.setItem('token', newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest); // Reintenta la solicitud original con el nuevo token
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // Si el refresh también falla, redirige al usuario a la página de login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    const response = await api.post('/oauth/token', {
        grant_type: 'refresh_token',
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        refresh_token: localStorage.getItem('refresh_token'),
    });

    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);

    return response.data.access_token;
};

export default api;
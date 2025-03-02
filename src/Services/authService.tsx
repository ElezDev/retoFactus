import api from "./Interceptors";

export const login = async () => {
    try {
        const response = await api.post('/oauth/token', {
            grant_type: 'password',
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            username: import.meta.env.VITE_EMAIL,
            password: import.meta.env.VITE_PASSWORD,
        });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const refreshToken = async () => {
    try {
        const response = await api.post('/oauth/token', {
            grant_type: 'refresh_token',
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            refresh_token: localStorage.getItem('refresh_token'),
        });
        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};
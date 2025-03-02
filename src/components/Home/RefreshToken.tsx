import React, { useState } from 'react';
import { useToken } from '../../tokenContext';
import api from '../../Services/Interceptors';
import { FaSyncAlt } from 'react-icons/fa';

const RefreshTokenPage = () => {
    const [loading, setLoading] = useState(false);
    const { updateToken } = useToken();

    const handleRefreshToken = async () => {
        setLoading(true);
        try {
            const response = await api.post('/oauth/token', {
                grant_type: 'password',
                client_id: import.meta.env.VITE_CLIENT_ID,
                client_secret: import.meta.env.VITE_CLIENT_SECRET,
                username: import.meta.env.VITE_EMAIL,
                password: import.meta.env.VITE_PASSWORD,
            });
            updateToken(response.data.access_token);
            window.location.href = '/';
        } catch (error) {
            console.error('Error refreshing token:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
                <h1 className="mb-4 text-2xl font-bold text-gray-800">Tu sesión ha expirado</h1>
                <p className="mb-6 text-gray-600">Para continuar, refresca tu sesión.</p>
                
                <button
                    onClick={handleRefreshToken}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-white font-semibold rounded-lg ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {loading ? (
                        <>
                            <FaSyncAlt className="animate-spin" />
                            Refrescando...
                        </>
                    ) : (
                        <>
                            <FaSyncAlt />
                            Refrescar Token
                        </>
                    )}
                </button>

                {loading && <p className="mt-4 text-sm text-gray-500">Por favor espera...</p>}
            </div>
        </div>
    );
};

export default RefreshTokenPage;

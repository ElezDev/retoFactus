import React, { useState, useEffect } from 'react';
import { useToken } from '../../tokenContext';
import { login, refreshToken } from '../../Services/authService'; // Importa la función login
import { FaSyncAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RefreshTokenPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token, updateToken } = useToken(); // Obtén el token del contexto
    const navigate = useNavigate();

    // Función para manejar el inicio de sesión o refresco del token
    const handleAuthentication = async () => {
        setLoading(true);
        setError(null);

        try {
            let data;
            if (!token) {
                // Si no hay token, inicia sesión
                data = await login();
            } else {
                // Si hay token, intenta refrescarlo
                data = await refreshToken();
            }

            // Actualiza el token en el contexto y en localStorage
            updateToken(data.access_token);
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            // Redirige al usuario a la página principal
            navigate('/');
        } catch (error) {
            setError(
                token
                    ? 'No se pudo refrescar la sesión. Por favor, inicia sesión nuevamente.'
                    : 'No se pudo iniciar sesión. Verifica tus credenciales.'
            );
            console.error('Error during authentication:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
                <h1 className="mb-4 text-2xl font-bold text-gray-800">
                    {token ? 'Tu sesión ha expirado' : 'Inicia sesión'}
                </h1>
                <p className="mb-6 text-gray-600">
                    {token
                        ? 'Para continuar, refresca tu sesión.'
                        : 'Para continuar, inicia sesión.'}
                </p>

                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                <button
                    onClick={handleAuthentication}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-white font-semibold rounded-lg ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {loading ? (
                        <>
                            <FaSyncAlt className="animate-spin" />
                            {token ? 'Refrescando...' : 'Iniciando sesión...'}
                        </>
                    ) : (
                        <>
                            <FaSyncAlt />
                            {token ? 'Refrescar Token' : 'Iniciar Sesión'}
                        </>
                    )}
                </button>

                {loading && <p className="mt-4 text-sm text-gray-500">Por favor espera...</p>}
            </div>
        </div>
    );
};

export default RefreshTokenPage;
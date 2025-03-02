import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const updateToken = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    return (
        <TokenContext.Provider value={{ token, updateToken }}>
            {children}
        </TokenContext.Provider>
    );
};

export const useToken = () => useContext(TokenContext);
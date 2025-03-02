import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext<{ token: string | null; updateToken: (newToken: string) => void } | undefined>(undefined);

interface TokenProviderProps {
    children: React.ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

 

    const updateToken = (newToken: string) => {
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
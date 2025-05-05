import React, { createContext, useContext, useEffect, useState } from 'react';
import { FrappeApp, FrappeAuth, FrappeCall, FrappeDB } from 'frappe-js-sdk';
import { FrappeAuthContext } from './frappe-auth';
import { BACKEND_URL } from '@/constants/oAuth';

interface FrappeContextType {
    isAuthenticated: boolean;
    accessToken: string;
    db: FrappeDB;
    call: FrappeCall;
    guestCall: FrappeCall;
    auth: FrappeAuth;
}

const FrappeContext = createContext<FrappeContextType | null>(null);

const FrappeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { accessToken, isAuthenticated } = useContext(FrappeAuthContext);
    const [db, setDb] = useState(null);
    const [call, setCall] = useState(null);
    const [guestCall, setGuestCall] = useState(null);
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const frappe = new FrappeApp(
            BACKEND_URL /*process.env.EXPO_PUBLIC_BACKEND_URL*/,
            {
                useToken: true,
                type: 'Bearer',
                token: () => accessToken,
            }
        );

        setDb(frappe.db());
        setCall(frappe.call());
        setAuth(frappe.auth());

        const guestFrappe = new FrappeApp(
            BACKEND_URL /*process.env.EXPO_PUBLIC_BACKEND_URL*/,
            {
                useToken: false,
                type: 'Bearer',
            }
        );
        setGuestCall(guestFrappe.call());
    }, [accessToken]);

    return (
        <FrappeContext.Provider
            value={{ accessToken, isAuthenticated, db, call, guestCall, auth }}
        >
            {children}
        </FrappeContext.Provider>
    );
};

export const useFrappe = () => {
    const context = useContext(FrappeContext);
    if (!context) {
        throw new Error('useFrappe must be used within a FrappeProvider');
    }
    return context;
};

/**
 * Wrapper for FrappeCall.get
 * @param path
 * @param params
 * @returns
 */
export const useApiGet = (apiPath: string, params?: any) => {
    const context = useContext(FrappeContext);
    if (!context) {
        throw new Error('useFrappe must be used within a FrappeProvider');
    }
    const { call } = context;
    const res = call.get(apiPath, params);
    return res?.message;
};

/**
 * Wrapper for FrappeCall.post
 * @param path
 * @param params
 * @returns
 */
export const useApiPost = (apiPath: string, params?: any) => {
    const context = useContext(FrappeContext);
    if (!context) {
        throw new Error('useFrappe must be used within a FrappeProvider');
    }
    const { call } = context;
    const res = call.post(apiPath, params);
    return res?.message;
};

export { FrappeProvider, FrappeContext };

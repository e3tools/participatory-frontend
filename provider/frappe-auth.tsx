import { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { FrappeApp } from 'frappe-js-sdk';
import {
    AUTH_STATE_KEY,
    BACKEND_URL as BASE_URI,
    CLIENT_ID,
    REDIRECT_URL_SCHEME as SCHEME,
} from '@/constants/oAuth';

interface FrappeUser {
    sub?: string;
    name: string;
    given_name?: string;
    family_name?: string;
    email: string;
    picture?: string;
    roles: string[];
    iss?: string;
}

interface FrappeAuthContextType {
    isAuthenticated: boolean;
    accessToken: string;
    refreshToken: string;
    userInfo: FrappeUser;
    request: any;
    promptAsync: (
        options?: AuthSession.AuthRequestPromptOptions
    ) => Promise<AuthSession.AuthSessionResult>;
    logout: () => Promise<void>;
    refreshAccessTokenAsync: () => Promise<void>;
    fetchUserInfo: () => Promise<any>;
}
const FrappeAuthContext = createContext<FrappeAuthContextType | null>(null);

const FrappeAuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    const redirectUri = AuthSession.makeRedirectUri({
        scheme: SCHEME,
        path: 'auth',
    });

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: CLIENT_ID,
            redirectUri,
            responseType: 'code',
            scopes: ['all'],
            usePKCE: false,
        },
        {
            authorizationEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.authorize`,
            tokenEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.get_token`,
        }
    );

    const fetchUserInfo = async () => {
        if (!accessToken) {
            console.error('Access token not found');
            return;
        }

        const frappe = new FrappeApp(BASE_URI, {
            useToken: true,
            type: 'Bearer',
            token: () => accessToken,
        });

        try {
            const call = frappe.call();
            const userInfo = await call.get(
                'frappe.integrations.oauth2.openid_profile'
            );
            setUserInfo(userInfo);
        } catch (error) {
            if (error.httpStatus === 403) {
                // refresh token
                await refreshAccessTokenAsync();
            }
        }
    };

    const logout = async () => {
        await AuthSession.revokeAsync(
            {
                token: accessToken,
            },
            {
                revocationEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.revoke_token`,
            }
        );
        await SecureStore.deleteItemAsync(AUTH_STATE_KEY);
        setIsAuthenticated(false);
        setAccessToken(null);
        setRefreshToken(null);
        setUserInfo(null);
    };

    const refreshAccessTokenAsync = async () => {
        if (!refreshToken) {
            logout();
            return;
        }
        AuthSession.refreshAsync(
            {
                refreshToken: refreshToken,
                clientId: CLIENT_ID,
            },
            {
                tokenEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.get_token`,
            }
        )
            .then(async (res) => {
                const authResponse = res;
                const storageValue = JSON.stringify(authResponse);
                await SecureStore.setItemAsync(AUTH_STATE_KEY, storageValue);

                setAccessToken(authResponse.accessToken);
                setRefreshToken(authResponse.refreshToken);
                setIsAuthenticated(true);

                const frappe = new FrappeApp(BASE_URI, {
                    useToken: true,
                    type: 'Bearer',
                    token: () => authResponse.accessToken,
                });
                const call = frappe.call();
                const userInfo = await call.get(
                    'frappe.integrations.oauth2.openid_profile'
                );
                setUserInfo(userInfo);
            })
            .catch((error) => {
                // unable to refresh
                // clean up auth state
                logout();
                console.error(error);
            });
    };

    useEffect(() => {
        SecureStore.getItemAsync(AUTH_STATE_KEY)
            .then((result) => {
                if (result) {
                    const { accessToken, refreshAccessToken } =
                        JSON.parse(result);
                    setAccessToken(accessToken);
                    setRefreshToken(refreshAccessToken);
                    setIsAuthenticated(true);
                } else {
                    if (response?.type === 'success') {
                        const { code } = response.params;
                        AuthSession.exchangeCodeAsync(
                            {
                                redirectUri,
                                code,
                                extraParams: {
                                    client_id: CLIENT_ID,
                                    grant_type: 'authorization_code',
                                },
                                clientId: CLIENT_ID,
                            },
                            {
                                tokenEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.get_token`,
                            }
                        )
                            .then(async (res) => {
                                const authResponse = res;
                                const storageValue =
                                    JSON.stringify(authResponse);
                                await SecureStore.setItemAsync(
                                    AUTH_STATE_KEY,
                                    storageValue
                                );
                                setAccessToken(authResponse.accessToken);
                                setRefreshToken(authResponse.refreshToken);
                                setIsAuthenticated(true);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    } else {
                        console.log('Not authenticated');
                    }
                }
            })
            .catch((error) => {});
    }, [response]);

    useEffect(() => {
        if (accessToken) {
            fetchUserInfo();
        }
    }, [accessToken]);

    return (
        <FrappeAuthContext.Provider
            value={{
                isAuthenticated,
                accessToken,
                refreshToken,
                userInfo,
                request,
                promptAsync,
                logout,
                refreshAccessTokenAsync,
                fetchUserInfo,
            }}
        >
            {children}
        </FrappeAuthContext.Provider>
    );
};

export const useFrappeAuth = () => {
    const context = useContext(FrappeAuthContext);
    if (!context) {
        throw new Error(
            'useFrappeAuth must be used within a FrappeAuthProvider'
        );
    }
    return context;
};

export { FrappeAuthProvider, FrappeAuthContext };

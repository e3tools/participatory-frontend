import { useAppDispatch, useAppSelector } from '@/app/state/hooks';
import { User } from 'auth/state/state.types';
import { logIn } from 'auth/state/user/actions/user.action';
import { logout } from 'auth/state/user/userSlice';

import { createContext, PropsWithChildren, useContext, useState } from 'react';

type IAuthContext = {
  authToken?: string | null;
  currentUser?: User | null;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<IAuthContext | undefined>(undefined);
type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.loggedInUser);
  const authToken = useAppSelector((state) => state.user.loggedInUser?.token);

  async function handleLogin(username: string, password: string) {
    try {
      const response = await dispatch(logIn({ username, password })).unwrap();
      console.log('Login response: ', response);
    } catch (error) {
      console.error('Login error: ', error);
    }
  }

  async function handleLogout() {
    const response = await dispatch(logout());
    console.log('Logout response: ', response);
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used inside of an AuthProvider');
  }

  return context;
}

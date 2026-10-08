import { onUnauthorized, ApiRequestError } from '../shared/api/client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { meRequest, type User } from '../shared/api/auth';
import { getToken, setToken as saveToken, removeToken } from '../shared/lib/token';


type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    meRequest(token)
      .then((data) => {
        setUser(data.user);
        setStatus('authenticated');
      })
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 401) {
          removeToken();
        }
        setStatus('unauthenticated');
      });
  }, []);
  
  useEffect(() => {
    onUnauthorized(() => {
      removeToken();
      setUser(null);
      setStatus('unauthenticated');
    });
  }, []);

  const login = (token: string, loggedInUser: User) => {
    saveToken(token);
    setUser(loggedInUser);
    setStatus('authenticated');
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setStatus('unauthenticated');
  };
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };
  return (
    <AuthContext.Provider value={{ status, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
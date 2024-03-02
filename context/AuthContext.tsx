import { createContext, useContext } from 'react';
import { useStorageState } from './useStorageState';
import { User } from '@/types/user';

const AuthContext = createContext<{
  logIn: (accessToken: string, refreshToken: string, userData: User) => void;
  logOut: () => void;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
}>({
  logIn: () => null,
  logOut: () => null,
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren<any>) {
  const [accessToken, setAccessToken] = useStorageState('access_token');
  const [refreshToken, setRefreshToken] = useStorageState('refresh_token');
  const [user, setUser] = useStorageState('user_data');

  const logIn = async (
    accessToken: string,
    refreshToken: string,
    userData: User
  ) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(JSON.stringify(userData));
  };

  const logOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        accessToken,
        refreshToken,
        user: user ? JSON.parse(user) : null,
        isLoading: false,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

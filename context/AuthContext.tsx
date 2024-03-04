import { createContext, useContext, useEffect, useState } from 'react';
import { useStorageState } from './useStorageState';
import { User } from '@/types/user';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import axios from 'axios';

const AuthContext = createContext<{
  logIn: (username: string, password: string) => void;
  logOut: () => void;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  connection: NetInfoState | null;
  isLoading: boolean;
}>({
  logIn: () => null,
  logOut: () => null,
  accessToken: null,
  refreshToken: null,
  user: null,
  connection: null,
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
  const [connection, setConnection] = useState<NetInfoState | null>(null);

  const logIn = async (username: string, password: string) => {
    try {
      const responseLogin = await axios.post(
        'https://test.inatrace.org/api/user/login',
        {
          username,
          password,
        }
      );

      const setCookieHeader = responseLogin.headers['set-cookie'];

      if (setCookieHeader) {
        const accessToken = setCookieHeader[0]
          .split(',')[0]
          .split(';')[0]
          .split('=')[1];
        const refreshToken = setCookieHeader[0]
          .split(',')[2]
          .split(';')[0]
          .split('=')[1];

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        const responseUserData = await axios.get(
          'https://test.inatrace.org/api/user/profile',
          {
            headers: {
              Cookie: `inatrace-accessToken=${accessToken}`,
            },
          }
        );

        if (responseUserData.data.status === 'OK') {
          console.log('setting user, ', responseUserData.data.data);
          setUser(JSON.stringify(responseUserData.data.data));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnection(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        accessToken,
        refreshToken,
        user: user ? JSON.parse(user) : null,
        connection,
        isLoading: false,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

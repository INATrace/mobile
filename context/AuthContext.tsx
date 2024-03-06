import { createContext, useContext, useEffect, useState } from 'react';
import { useStorageState } from './useStorageState';
import { User } from '@/types/user';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import axios from 'axios';

import i18n from '@/locales/i18n';

export const AuthContext = createContext<{
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => void;
  accessToken: string | null;
  user: User | null;
  selectedCompany: number | null;
  connection: NetInfoState | null;
  loginError: string | null;
  isLoading: boolean;
}>({
  logIn: async () => void 0,
  logOut: () => null,
  accessToken: null,
  user: null,
  selectedCompany: null,
  connection: null,
  loginError: null,
  isLoading: false,
});

export function SessionProvider(props: React.PropsWithChildren<any>) {
  const [accessToken, setAccessToken] = useStorageState<string | null>(
    'access_token',
    null
  );
  const [user, setUser] = useStorageState<User | null>('user', null);
  const [selectedCompany, setSelectedCompany] = useStorageState<number | null>(
    'selected_company',
    null
  );

  const [connection, setConnection] = useState<NetInfoState | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logIn = async (username: string, password: string) => {
    console.log(accessToken);

    try {
      setIsLoading(true);
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

        setAccessToken(accessToken);

        const responseUserData = await axios.get(
          'https://test.inatrace.org/api/user/profile',
          {
            headers: {
              Cookie: `inatrace-accessToken=${accessToken}`,
            },
          }
        );

        if (responseUserData.data.status === 'OK') {
          const user = responseUserData.data.data as User;
          setUser(user);
          setSelectedCompany(user.companyIds[0]);
        }
      }
    } catch (error: any) {
      if (error.response.data.status === 'AUTH_ERROR') {
        setLoginError(i18n.t('login.authError'));
      } else {
        setLoginError(i18n.t('login.genericError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = () => {
    setAccessToken(null);
    setUser(null);
    setSelectedCompany(null);
  };

  const makeRequest = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  ) => {
    return axios.request({
      url,
      method,
      headers: {
        Cookie: `inatrace-accessToken=${accessToken}`,
      },
    });
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
        user,
        selectedCompany,
        connection,
        loginError,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

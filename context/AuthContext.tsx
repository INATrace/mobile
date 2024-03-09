import { createContext, useEffect, useState } from 'react';
import { useStorageState } from './useStorageState';
import { User } from '@/types/user';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import axios from 'axios';
import { decode as atob } from 'base-64';

import { LogInResponse, RequestParams } from '@/types/auth';

export const AuthContext = createContext<{
  logIn: (username: string, password: string) => Promise<LogInResponse>;
  logOut: () => void;
  checkAuth: () => Promise<boolean>;
  makeRequest: ({ url, method, body, headers }: RequestParams) => Promise<any>;
  accessToken: string | null;
  user: User | null;
  selectedCompany: number | null;
  getConnection: Promise<NetInfoState>;
}>({
  logIn: async () => ({ success: false, errorStatus: '' }),
  logOut: () => null,
  checkAuth: async () => false,
  makeRequest: async () => null,
  accessToken: null,
  user: null,
  selectedCompany: null,
  getConnection: Promise.resolve({ isConnected: false } as NetInfoState),
});

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(payload.exp * 1000);
    const currentDate = new Date();

    return expirationDate < currentDate;
  } catch (error) {
    return false;
  }

  return false;
};

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

  const checkAuth = async (): Promise<boolean> => {
    if (!(await NetInfo.fetch()).isConnected) {
      return true;
    }

    if (accessToken && !isTokenExpired(accessToken)) {
      return true;
    }

    return false;
  };

  const logIn = async (
    username: string,
    password: string
  ): Promise<LogInResponse> => {
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
          return { success: true, errorStatus: '' };
        }
      }
    } catch (error: any) {
      if (error.response.data.status === 'AUTH_ERROR') {
        return { success: false, errorStatus: 'AUTH_ERROR' };
      } else {
        return { success: false, errorStatus: 'GENERIC_ERROR' };
      }
    }

    return { success: false, errorStatus: 'GENERIC_ERROR' };
  };

  const logOut = () => {
    setAccessToken(null);
    setUser(null);
    setSelectedCompany(null);
  };

  const makeRequest = async ({ url, method, body, headers }: RequestParams) => {
    return await axios.request({
      url,
      method,
      headers: {
        Cookie: `inatrace-accessToken=${accessToken}`,
        ...headers,
      },
      data: body,
    });
  };

  const getConnection = async () => {
    return await NetInfo.fetch();
  };

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        checkAuth,
        makeRequest,
        accessToken,
        user,
        selectedCompany,
        getConnection: getConnection(),
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

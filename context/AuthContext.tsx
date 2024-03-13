import { createContext, useEffect, useState } from 'react';
import { useStorageState } from './useStorageState';
import { User } from '@/types/user';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import axios from 'axios';
import { decode as atob } from 'base-64';

import { LogInResponse, RequestParams } from '@/types/auth';
import { Farmer } from '@/types/farmer';
import { CompanyInfo } from '@/types/company';

const apiUri = 'https://test.inatrace.org/api';

export const AuthContext = createContext<{
  logIn: (username: string, password: string) => Promise<LogInResponse>;
  logOut: () => void;
  checkAuth: () => Promise<boolean>;
  selectFarmer: (farmer: Farmer) => void;
  selectCompany: (company: number | string | null) => void;
  makeRequest: ({ url, method, body, headers }: RequestParams) => Promise<any>;
  accessToken: string | null;
  user: User | null;
  selectedCompany: number | string | null;
  companies: (CompanyInfo | undefined)[] | string | null;
  getConnection: Promise<NetInfoState>;
  isConnected: boolean;
  selectedFarmer: Farmer | string | null;
}>({
  logIn: async () => ({ success: false, errorStatus: '' }),
  logOut: () => null,
  checkAuth: async () => false,
  makeRequest: async () => null,
  selectFarmer: () => null,
  selectCompany: () => null,
  accessToken: null,
  user: null,
  companies: null,
  selectedCompany: null,
  getConnection: Promise.resolve({ isConnected: false } as NetInfoState),
  isConnected: false,
  selectedFarmer: null,
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
};

export function SessionProvider(props: React.PropsWithChildren<any>) {
  const [accessToken, setAccessToken] = useStorageState<string | null>(
    'access_token',
    null
  );
  const [user, setUser] = useStorageState<User | null>('user', null);
  const [selectedCompany, setSelectedCompany] = useStorageState<
    number | string | null
  >('selected_company', null, 'asyncStorage');
  const [companies, setCompanies] = useStorageState<
    (CompanyInfo | undefined)[] | string | null
  >('companies', null, 'asyncStorage');
  const [selectedFarmer, setSelectedFarmer] = useStorageState<
    Farmer | string | null
  >('selected_farmer', null, 'asyncStorage');

  const [isConnected, setIsConnected] = useState<boolean>(false);

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
      const responseLogin = await axios.post(`${apiUri}/user/login`, {
        username,
        password,
      });

      const setCookieHeader = responseLogin.headers['set-cookie'];

      if (setCookieHeader) {
        const accessToken = setCookieHeader[0]
          .split(',')[0]
          .split(';')[0]
          .split('=')[1];

        setAccessToken(accessToken);

        const responseUserData = await axios.get(`${apiUri}/user/profile`, {
          headers: {
            /* Cookie: `inatrace-accessToken=${accessToken}`, */
          },
        });

        if (responseUserData.data.status === 'OK') {
          const user = responseUserData.data.data as User;
          setUser(user);
          setSelectedCompany(user.companyIds[0]);

          const companyDetailsPromises = user.companyIds.map((companyId) =>
            axios.get(`${apiUri}/company/profile/${companyId}`, {
              headers: {
                /* Cookie: `inatrace-accessToken=${accessToken}`, */
              },
            })
          );

          const companyDetailsResponses = await Promise.all(
            companyDetailsPromises
          );
          const companyDetails = companyDetailsResponses.map(
            async (response) => {
              if (response.data.status === 'OK') {
                const companyInfo = {
                  id: response.data.data.id,
                  name: response.data.data.name,
                  logo: await urlToBase64(
                    `${apiUri}/common/image/${response.data.data.logo.storageKey}/SMALL`,
                    accessToken
                  ),
                } as CompanyInfo;
                return companyInfo;
              }
            }
          );
          const companyDetailsResp = await Promise.all(companyDetails);

          setCompanies(companyDetailsResp);

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
    if (isTokenExpired(accessToken ?? '')) {
      logOut();
      return;
    }

    return await axios.request({
      url: apiUri + url,
      method,
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        /* Cookie: `; inatrace-accessToken=${accessToken}`, */
      },
      data: body,
    });
  };

  const getConnection = async () => {
    return await NetInfo.fetch();
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state?.isConnected ?? false);
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
        checkAuth,
        selectFarmer: setSelectedFarmer,
        selectCompany: setSelectedCompany,
        makeRequest,
        accessToken,
        user,
        selectedCompany,
        companies,
        getConnection: getConnection(),
        isConnected,
        selectedFarmer,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const urlToBase64 = async (
  url: string,
  accessToken: string
): Promise<string | null> => {
  try {
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        Cookie: accessToken,
      },
    });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(response.data);
    });
  } catch (error) {
    console.error('Error fetching and converting image:', error);
    return null;
  }
};

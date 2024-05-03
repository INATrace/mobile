import { createContext, useEffect, useState } from 'react';
import { useStorageState } from './useStorageState';
import { User } from '@/types/user';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import { LogInResponse, RequestParams } from '@/types/auth';
import { Farmer, ProductTypeWithCompanyId } from '@/types/farmer';
import { CompanyInfo } from '@/types/company';
import { Country } from '@/types/country';
import { uuid } from 'expo-modules-core';
import { Plot } from '@/types/plot';
import { decode } from 'base-64';
import realm from '@/realm/useRealm';
import { FarmerSchema } from '@/realm/schemas';

let creatingImageCacheDir: any = null;

export const AuthContext = createContext<{
  logIn: (username: string, password: string) => Promise<LogInResponse>;
  logOut: () => void;
  checkAuth: () => Promise<boolean>;
  selectFarmer: (farmer: Farmer) => void;
  selectCompany: (company: number | string | null) => void;
  setNewPlot: (plot: Plot) => void;
  setInstance: (instance: string) => void;
  instance: string;
  makeRequest: ({ url, method, body, headers }: RequestParams) => Promise<any>;
  accessToken: string | null;
  user: User | null;
  selectedCompany: number | string | null;
  companies: (CompanyInfo | undefined)[] | string | null;
  productTypes: ProductTypeWithCompanyId[] | string | null;
  countries: Country[] | string | null;
  getConnection: Promise<NetInfoState>;
  isConnected: boolean;
  selectedFarmer: Farmer | string | null;
  newPlot: Plot | null;
}>({
  logIn: async () => ({ success: false, errorStatus: '' }),
  logOut: () => null,
  checkAuth: async () => false,
  makeRequest: async () => null,
  selectFarmer: () => null,
  selectCompany: () => null,
  setNewPlot: () => null,
  setInstance: () => null,
  instance: process.env.EXPO_PUBLIC_API_URI ?? '',
  accessToken: null,
  user: null,
  companies: null,
  selectedCompany: null,
  productTypes: null,
  countries: null,
  getConnection: Promise.resolve({ isConnected: false } as NetInfoState),
  isConnected: false,
  selectedFarmer: null,
  newPlot: null,
});

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(decode(token.split('.')[1]));
    const expirationDate = new Date(payload.exp * 1000);
    const currentDate = new Date();

    return expirationDate < currentDate;
  } catch (error) {
    console.error('Error decoding token:', error);
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
  const [productTypes, setProductTypes] = useStorageState<
    ProductTypeWithCompanyId[] | string | null
  >('product_type', null, 'asyncStorage');
  const [countries, setCountries] = useStorageState<Country[] | string | null>(
    'countries',
    null,
    'asyncStorage'
  );

  const [instance, setInstance] = useStorageState<string>(
    'instance',
    process.env.EXPO_PUBLIC_API_URI ?? ''
  );

  useEffect(() => {
    if (instance === 'none') setInstance(process.env.EXPO_PUBLIC_API_URI ?? '');
  }, [instance]);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [newPlot, setNewPlot] = useState<Plot | null>(null);

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
      const responseLogin = await axios.post(`${instance}/api/user/login`, {
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

        const responseUserData = await axios.get(
          `${instance}/api/user/profile`
        );

        if (responseUserData.data.status === 'OK') {
          const user = responseUserData.data.data as User;
          setUser(user);
          setSelectedCompany(user.companyIds[0]);

          await fetchAndStoreData(user);

          const companyDetailsPromises = user.companyIds.map((companyId) =>
            axios.get(`${instance}/api/company/profile/${companyId}`)
          );

          const companyDetailsResponses = await Promise.all(
            companyDetailsPromises
          );
          const companyDetails = companyDetailsResponses.map(
            async (response) => {
              if (response.data.status === 'OK') {
                const logoFilePath = await downloadImageToFileSystem(
                  `${instance}/api/common/image/${response.data.data.logo.storageKey}/SMALL`,
                  accessToken
                );

                const companyInfo = {
                  id: response.data.data.id,
                  name: response.data.data.name,
                  logo: logoFilePath,
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

  const logOut = async () => {
    setAccessToken(null);
    setUser(null);
    setSelectedCompany(null);
    setCompanies(null);
    setSelectedFarmer(null);
    setProductTypes(null);
    setCountries(null);
    setNewPlot(null);

    await realm.realmDeleteAll(FarmerSchema, 'synced == true');

    clearImageCache();
  };

  const makeRequest = async ({ url, method, body, headers }: RequestParams) => {
    if (isTokenExpired(accessToken ?? '')) {
      logOut();
      return;
    }

    return await axios.request({
      url: instance + url,
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

  const fetchAndStoreData = async (user: User): Promise<void> => {
    //product types

    const productTypesPromises = user.companyIds.map((companyId) =>
      axios
        .get(
          `${instance}/api/company/${companyId}/product-types?limit=1000&offset=0`
        )
        .then((response) => ({ response, companyId }))
    );

    const productTypesResponses = await Promise.all(productTypesPromises);

    const productTypes = productTypesResponses.map(
      async ({ response, companyId }) => {
        if (response.data.status === 'OK') {
          return { companyId, productTypes: response.data.data.items };
        }
      }
    );

    const productTypesResp = await Promise.all(productTypes);

    setProductTypes(productTypesResp as any);

    //countries
    const countriesResponse = await axios.get(
      `${instance}/api/common/countries?requestType=FETCH&limit=500&sort=ASC`
    );
    const countriesResp = countriesResponse.data.data.items as Country[];
    setCountries(countriesResp);

    //farmers
    await realm.realmDeleteAll(FarmerSchema, 'synced == true');
    const farmersPromises = user.companyIds.map((companyId) =>
      axios
        .get(
          `${instance}/api/company/userCustomers/${companyId}/FARMER?limit=5000`
        )
        .then((response) => ({ response, companyId }))
    );
    const farmersResponses = await Promise.all(farmersPromises);

    const farmers = farmersResponses.map(async ({ response, companyId }) => {
      if (response.data.status === 'OK') {
        return {
          companyId,
          farmers: response.data.data.items as Farmer[],
        };
      }
    });

    const farmersResp = await Promise.all(farmers);
    const farmersRealm: any = [];

    farmersResp.forEach((company) => {
      company?.farmers?.forEach((farmer) => {
        const farmerRealm = {
          id: farmer.id ? farmer.id.toString() : '',
          userId: user.id ? user.id.toString() : '',
          companyId: company?.companyId ? company?.companyId.toString() : '',
          data: JSON.stringify(farmer),
          name: farmer.name ? farmer.name : '',
          surname: farmer.surname ? farmer.surname : '',
          synced: true,
        };

        farmersRealm.push(farmerRealm);
      });
    });

    await realm.realmWriteMultiple(FarmerSchema, farmersRealm);
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
        productTypes,
        countries,
        getConnection: getConnection(),
        isConnected,
        selectedFarmer,
        newPlot,
        setNewPlot,
        instance,
        setInstance,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const downloadImageToFileSystem = async (url: string, accessToken: string) => {
  try {
    const { config, fs } = RNFetchBlob;
    const imageCacheDir = `${fs.dirs.CacheDir}/inatrace_images`;

    if (!creatingImageCacheDir) {
      creatingImageCacheDir = fs
        .exists(imageCacheDir)
        .then((exists) => {
          if (!exists) {
            return fs.mkdir(imageCacheDir);
          }
        })
        .catch((error) => {
          console.error('Directory check/create error:', error);
        })
        .finally(() => {
          creatingImageCacheDir = null;
        });

      await creatingImageCacheDir;
    } else {
      await creatingImageCacheDir;
    }

    const options = {
      path: `${imageCacheDir}/${uuid.v4()}.png`,
      HTTPHeader: {
        Cookie: accessToken,
      },
    };

    const res = await config(options).fetch('GET', url);
    const filePath = res.path();
    return 'file://' + filePath;
  } catch (error) {
    console.error('Error downloading and saving image:', error);
    return null;
  }
};

const clearImageCache = async () => {
  const { fs } = RNFetchBlob;
  const imageCacheDir = `${fs.dirs.CacheDir}/inatrace_images`;

  try {
    if (await fs.exists(imageCacheDir)) {
      await fs.unlink(imageCacheDir);
    }
  } catch (error) {
    console.error('Error clearing image cache directory:', error);
  }
};

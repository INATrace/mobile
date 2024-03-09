import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const getItem = async (key: string) => {
  const { user } = useContext(AuthContext);
  try {
    const userKey = key + user?.id;
    const value = await AsyncStorage.getItem(userKey);
    return value;
  } catch (error) {
    console.error('Error getting item from AsyncStorage:', error);
  }
};

export const setItem = async (key: string, value: string) => {
  const { user } = useContext(AuthContext);
  try {
    const userKey = key + user?.id;
    await AsyncStorage.setItem(userKey, value);
  } catch (error) {
    console.error('Error setting item in AsyncStorage:', error);
  }
};

export const removeItem = async (key: string) => {
  const { user } = useContext(AuthContext);
  try {
    const userKey = key + user?.id;
    await AsyncStorage.removeItem(userKey);
  } catch (error) {
    console.error('Error removing item from AsyncStorage:', error);
  }
};

export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

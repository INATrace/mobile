import { deleteItemAsync, setItemAsync, getItemAsync } from 'expo-secure-store';
import { useReducer, useEffect, useCallback } from 'react';

type StorageValue = string | object | number | null;

type UseStateHook<T> = [T, (value: T) => void];

function useAsyncState<T>(initialValue: T): UseStateHook<T> {
  return useReducer(
    (state: T, action: T): T => action,
    initialValue
  ) as UseStateHook<T>;
}

async function setStorageItemAsync(key: string, value: StorageValue) {
  if (value === null) {
    await deleteItemAsync(key);
  } else {
    const valueToStore = JSON.stringify(value);
    await setItemAsync(key, valueToStore);
  }
}

export function useStorageState<T extends StorageValue>(
  key: string,
  initialValue: T
): UseStateHook<T> {
  const [state, setState] = useAsyncState<T>(initialValue);

  useEffect(() => {
    getItemAsync(key).then((value) => {
      const parsedValue = value ? JSON.parse(value) : initialValue;
      setState(parsedValue);
    });
  }, [key, initialValue]);

  const setValue = useCallback(
    async (value: T) => {
      setState(value);
      await setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}

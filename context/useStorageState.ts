import { deleteItemAsync, setItemAsync, getItemAsync } from 'expo-secure-store';
import { useReducer, useEffect, useCallback } from 'react';

type UseStateHook<T> = [T | null, (value: T | null) => void];

function useAsyncState<T>(initialValue: T | null = null): UseStateHook<T> {
  return useReducer(
    (state: T | null, action: T | null = null): T | null => action,
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (value == null) {
    await deleteItemAsync(key);
  } else {
    const valueToStore =
      typeof value === 'object' ? JSON.stringify(value) : value;
    await setItemAsync(key, valueToStore);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  useEffect(() => {
    getItemAsync(key).then((value) => {
      setState(value);
    });
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}

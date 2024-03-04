import { deleteItemAsync, setItemAsync, getItemAsync } from 'expo-secure-store';
import { useReducer, useEffect, useCallback } from 'react';

// Define a type that includes both string and object to clarify the hook's capability
type StorageValue = string | object | null;

type UseStateHook<T> = [T, (value: T) => void];

function useAsyncState<T>(initialValue: T): UseStateHook<T> {
  return useReducer(
    (state: T, action: T): T => action,
    initialValue
  ) as UseStateHook<T>;
}

// This function remains unchanged as it abstracts away the specifics of storage handling
async function setStorageItemAsync(key: string, value: StorageValue) {
  if (value === null) {
    await deleteItemAsync(key);
  } else {
    // Ensure the value is stored as a string
    const valueToStore = JSON.stringify(value);
    await setItemAsync(key, valueToStore);
  }
}

// Adjust the hook to initialize with a generic type which can be a string or an object
export function useStorageState<T extends StorageValue>(
  key: string,
  initialValue: T
): UseStateHook<T> {
  const [state, setState] = useAsyncState<T>(initialValue);

  useEffect(() => {
    getItemAsync(key).then((value) => {
      // Parse the retrieved value if it exists, otherwise return initialValue
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

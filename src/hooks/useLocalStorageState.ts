import * as React from 'react';

type Options<T> = {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
};

function useLocalStorageState<T>(
  key: string,
  defaultValue: T | (() => T) = '' as T,
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: Options<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);

    if (valueInLocalStorage) {
      try {
        return deserialize(valueInLocalStorage);
      } catch {
        window.localStorage.removeItem(key);
      }
    }
    return typeof defaultValue === 'function'
      ? (defaultValue as () => T)()
      : defaultValue;
  });

  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }

    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}

export default useLocalStorageState;

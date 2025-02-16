import * as React from 'react';

export function customCreatereateContext<A>() {
  const context = React.createContext<A | undefined>(undefined);

  const useContext = () => {
    const c = React.useContext(context);
    if (c === undefined)
      throw new Error(
        'useContext must be inside a Provider with a value'
      );

    // context is not undefined  and always exits from here on for the rest of the app to consume.
    return c;
  };
  return [useContext, context.Provider] as const;
  // all the cost does is that it makes this array readonly, we cannot push into the array or pop out of the array.
}

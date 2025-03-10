import * as React from 'react';
import { customCreatereateContext } from './customCreateContect';
import {
  AppAction,
  appReducer,
  AppState,
} from '../reducers/appReducer';
import { data } from '../dummyData/data';
import { Task } from '../lib/types';

interface AppDataContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const [useAppDataContext, AppDataProvider] =
  customCreatereateContext<AppDataContextType>();

const AppDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(appReducer, {
    tasks: data.map((task) => {
      return {
        ...task,
        customFields: [],
      };
    }) as unknown as Task[],
    fields: [],
    historyStates: [],
    futureStates: [],
  } as AppState);

  React.useEffect(() => {
    try {
      const data = localStorage.getItem('appState');
      if (data) {
        const appData = JSON.parse(data);
        if (Object.keys(appData).length === 2) {
          const payload = {
            tasks: appData.tasks,
            fields: appData.fields,
          };

          dispatch({
            type: 'LOCAL_STORAGE_LOAD',
            payload,
          });
        } else {
          console.warn(
            'Invalid data structure in localStorage, resetting...'
          );
          localStorage.removeItem('appState'); // Clear invalid data
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
      localStorage.removeItem('appState'); // Clear if there's an error
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(
      'appState',
      JSON.stringify({
        tasks: state.tasks,
        fields: state.fields,
      })
    );
  }, [state]);

  const value = {
    state,
    dispatch,
  };

  return <AppDataProvider value={value}>{children}</AppDataProvider>;
};

export { useAppDataContext, AppDataContextProvider };

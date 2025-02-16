import * as React from 'react';
import {
  TasksState,
  TasksAction,
  tasksReducer,
} from '../reducers/tasksReducer';
import { customCreatereateContext } from './customCreateContect';

interface AppDataContextType {
  state: TasksState;
  dispatch: React.Dispatch<TasksAction>;
}

const [useAppDataContext, AppDataProvider] =
  customCreatereateContext<AppDataContextType>();

const AppDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(tasksReducer, {
    tasks: [],
  } as TasksState);

  React.useEffect(() => {
    try {
      const data = localStorage.getItem('appState');
      if (data) {
        const tasks = JSON.parse(data);
        if (Array.isArray(tasks) && tasks.length > 0) {
          dispatch({
            type: 'LOCAL_STORAGE_LOAD',
            payload: tasks,
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
    localStorage.setItem('appState', JSON.stringify(state.tasks));
  }, [state]);

  return (
    <AppDataProvider value={{ state, dispatch }}>
      {children}
    </AppDataProvider>
  );
};

export { useAppDataContext, AppDataContextProvider };

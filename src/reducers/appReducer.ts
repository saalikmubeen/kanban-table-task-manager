import { Task, Status, Priority, BulkUpdateType } from '../lib/types';
import { CustomFieldOptions } from '../lib/types';

interface CustomFieldType {
  id: string;
  name: string; // should be unique
  type: CustomFieldOptions;
}

export type CustomFieldsState = {
  fields: CustomFieldType[];
};

export type AppAction =
  | {
      type: 'ADD_TASK';
      payload: Task;
    }
  | {
      type: 'DELETE_TASK';
      payload: { taskId: string };
    }
  | {
      type: 'EDIT_TASK';
      payload: Task;
    }
  | {
      type: 'LOCAL_STORAGE_LOAD';
      payload: {
        tasks: Task[];
        fields: CustomFieldType[];
      };
    }
  | { type: 'BULK_DELETE_TASKS'; payload: { taskIds: string[] } }
  | {
      type: 'BULK_EDIT_TASKS';
      payload: {
        taskIds: string[];
        type: BulkUpdateType;
        status: Status;
        priority: Priority;
      };
    }
  | {
      type: 'UPDATE_CUSTOM_FIELDS';
      payload: {
        fields: CustomFieldType[];
      };
    }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export type AppState = {
  tasks: Task[];
  fields: CustomFieldType[];
  historyStates: {
    tasks: Task[];
    fields: CustomFieldType[];
  }[];
  futureStates: {
    tasks: Task[];
    fields: CustomFieldType[];
  }[];
};

export const appReducer = (
  state: AppState,
  action: AppAction
): AppState => {
  // push the current state to the historyStates array. So the current recent state is always at the end of the array
  // and is thus the most recent histoty state
  const newHistoryStates = [
    ...state.historyStates,
    { tasks: [...state.tasks], fields: [...state.fields] },
  ];

  switch (action.type) {
    case 'ADD_TASK': {
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        historyStates: newHistoryStates,
        futureStates: [],
      };
    }
    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.filter(
          (task) => task.id !== action.payload.taskId
        ),
        historyStates: newHistoryStates,
        futureStates: [],
      };
    }
    case 'EDIT_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        historyStates: newHistoryStates,
        futureStates: [],
      };
    }

    case 'LOCAL_STORAGE_LOAD': {
      return {
        tasks: action.payload.tasks,
        fields: action.payload.fields,
        historyStates: [],
        futureStates: [],
      };
    }

    case 'BULK_DELETE_TASKS': {
      return {
        ...state,
        tasks: state.tasks.filter(
          (task) => !action.payload.taskIds.includes(task.id)
        ),
        historyStates: newHistoryStates,
        futureStates: [],
      };
    }

    case 'BULK_EDIT_TASKS': {
      if (action.payload.type === 'status') {
        return {
          ...state,
          tasks: state.tasks.map((task) =>
            action.payload.taskIds.includes(task.id)
              ? { ...task, status: action.payload.status }
              : task
          ),
          historyStates: newHistoryStates,
          futureStates: [],
        };
      } else if (action.payload.type === 'priority') {
        return {
          ...state,
          tasks: state.tasks.map((task) =>
            action.payload.taskIds.includes(task.id)
              ? { ...task, priority: action.payload.priority }
              : task
          ),
          historyStates: newHistoryStates,
          futureStates: [],
        };
      } else {
        return {
          ...state,
          tasks: state.tasks.map((task) => {
            if (action.payload.taskIds.includes(task.id)) {
              return {
                ...task,
                status: action.payload.status,
                priority: action.payload.priority,
              };
            }

            return task;
          }),
          historyStates: newHistoryStates,
          futureStates: [],
        };
      }
    }

    case 'UPDATE_CUSTOM_FIELDS': {
      const updatedTasks = state.tasks.map((task) => {
        const taskCurrentCustomFields = task.customFields;

        // if the incoming custom field is already present in the task, do nothing
        // if not add it, if there is a custom field in the task that is not in the
        // incoming custom fields, remove it

        const updatedTask = {
          ...task,
          customFields: task.customFields
            ? [...task.customFields]
            : [],
        }; // Deep clone custom fields

        action.payload.fields.forEach((field) => {
          const fieldsExists = taskCurrentCustomFields.find(
            (f) => f.id === field.id
          );
          // if the field is not in the task, add it
          if (!fieldsExists) {
            updatedTask.customFields.push({
              ...field,
              value: '',
            });
          } else {
            // if the field is already in the task, so update it
            updatedTask.customFields = updatedTask.customFields.map(
              (f) =>
                f.id === field.id
                  ? {
                      ...f,
                      ...field,
                    }
                  : f
            );
          }
        });

        taskCurrentCustomFields.forEach((field) => {
          const fieldExists = action.payload.fields.find(
            (f) => f.id === field.id
          );

          // if there is a custom field in the task that is not in the
          // incoming custom fields, remove it
          if (!fieldExists) {
            updatedTask.customFields =
              updatedTask.customFields.filter(
                (f) => f.id !== field.id
              );
          }
        });

        return updatedTask;
      });

      return {
        fields: action.payload.fields,
        tasks: updatedTasks,
        historyStates: newHistoryStates,
        futureStates: [],
      };
    }

    case 'UNDO': {
      console.log('UNDO');
      console.log(state.historyStates);
      // To undo, we need to take the last history state and make it the current state
      // and push the current state to the future states array

      if (state.historyStates.length === 0) return state;
      const latestHistoryState =
        state.historyStates[state.historyStates.length - 1];

      if (!latestHistoryState) {
        return state;
      }

      const newFutureStates = [
        ...state.futureStates,
        // Push the current state to the future states array so we can redo it
        { tasks: [...state.tasks], fields: [...state.fields] },
      ];

      return {
        ...state,
        tasks: latestHistoryState.tasks,
        fields: latestHistoryState.fields,
        historyStates: state.historyStates.slice(0, -1),
        futureStates: newFutureStates,
      };
    }

    case 'REDO': {
      // To redo, we need to take the last future state and make it the current state
      // and push the current state to the history states array
      if (state.futureStates.length === 0) return state;
      const latestFutureState =
        state.futureStates[state.futureStates.length - 1];

      if (!latestFutureState) {
        return state;
      }

      const newHistoryStates = [
        ...state.historyStates,
        // Push the current state to the history states array so we can undo it
        { tasks: [...state.tasks], fields: [...state.fields] },
      ];

      return {
        ...state,
        tasks: latestFutureState.tasks,
        fields: latestFutureState.fields,
        historyStates: newHistoryStates,
        futureStates: state.futureStates.slice(0, -1), // remove the last future state as we redid it
      };
    }

    default: {
      return state;
    }
  }
};

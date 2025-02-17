import { Task, Status, Priority, BulkUpdateType } from '../lib/types';
import { CustomFieldOptions } from '../lib/types';

interface CustomFieldType {
  id: string;
  name: string; // should be unique
  type: CustomFieldOptions;
  options?: string[]; // Only applicable for dropdown and multi-select
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
      type: 'ON_CUSTOM_FIELDS_UPDATE';
      payload: CustomFieldsState;
    }
  | {
      type: 'UPDATE_CUSTOM_FIELDS';
      payload: {
        fields: CustomFieldType[];
      };
    };

export type AppState = {
  tasks: Task[];
  fields: CustomFieldType[];
};

export const appReducer = (
  state: AppState,
  action: AppAction
): AppState => {
  switch (action.type) {
    case 'ADD_TASK': {
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    }
    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.filter(
          (task) => task.id !== action.payload.taskId
        ),
      };
    }
    case 'EDIT_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    }

    case 'LOCAL_STORAGE_LOAD': {
      return {
        tasks: action.payload.tasks,
        fields: action.payload.fields,
      };
    }

    case 'BULK_DELETE_TASKS': {
      return {
        ...state,
        tasks: state.tasks.filter(
          (task) => !action.payload.taskIds.includes(task.id)
        ),
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
        };
      } else if (action.payload.type === 'priority') {
        return {
          ...state,
          tasks: state.tasks.map((task) =>
            action.payload.taskIds.includes(task.id)
              ? { ...task, priority: action.payload.priority }
              : task
          ),
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
        };
      }
    }

    case 'UPDATE_CUSTOM_FIELDS': {
      const updatedTasks = state.tasks.map((task) => {
        const taskCurrentCustomFields = task.customFields;

        // if the incoming custom field is already present in the task, do nothing
        // if not add it, if there is a custom field in the task that is not in the
        // incoming custom fields, remove it

        const updatedTask = { ...task };

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
      };
    }

    default: {
      return state;
    }
  }
};

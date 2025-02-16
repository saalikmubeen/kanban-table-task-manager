import { Task, Status, Priority, BulkUpdateType } from '../lib/types';

export type TasksAction =
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
      payload: Task[];
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
    };

export type TasksState = {
  tasks: Task[];
};

export const tasksReducer = (
  state: TasksState,
  action: TasksAction
): TasksState => {
  switch (action.type) {
    case 'ADD_TASK': {
      return {
        tasks: [...state.tasks, action.payload],
      };
    }
    case 'DELETE_TASK': {
      return {
        tasks: state.tasks.filter(
          (task) => task.id !== action.payload.taskId
        ),
      };
    }
    case 'EDIT_TASK': {
      return {
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    }

    case 'LOCAL_STORAGE_LOAD': {
      console.log(action);
      return {
        tasks: action.payload,
      };
    }

    case 'BULK_DELETE_TASKS': {
      return {
        tasks: state.tasks.filter(
          (task) => !action.payload.taskIds.includes(task.id)
        ),
      };
    }

    case 'BULK_EDIT_TASKS': {
      if (action.payload.type === 'status') {
        return {
          tasks: state.tasks.map((task) =>
            action.payload.taskIds.includes(task.id)
              ? { ...task, status: action.payload.status }
              : task
          ),
        };
      } else if (action.payload.type === 'priority') {
        return {
          tasks: state.tasks.map((task) =>
            action.payload.taskIds.includes(task.id)
              ? { ...task, priority: action.payload.priority }
              : task
          ),
        };
      } else {
        return {
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

    default: {
      return state;
    }
  }
};

export enum Status {
  InProgress = 'in_progress',
  NotStarted = 'not_started',
  Completed = 'completed',
}

export enum Priority {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Urgent = 'urgent',
  None = 'none',
}

// Column = Status of the tasks in the column
export type Column = {
  id: Priority;
  title: string;
  tasks: Task[];
};

export interface Task {
  id: string;
  title: string;
  status: Status; // also the column id
  priority: Priority;
}

export type PriorityType = {
  id: Priority;
  title: string;
};

export type StatusType = {
  id: Status;
  title: string;
};

export type BulkUpdateType = 'status' | 'priority' | 'both';

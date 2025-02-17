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
  customFields: CustomField[];
}

export interface CustomField {
  id: string;
  name: string; // name of the custom field
  value: string | number | boolean; // value of the custom field
  type: CustomFieldOptions;
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

export type CustomFieldOptions = 'text' | 'number' | 'checkbox';

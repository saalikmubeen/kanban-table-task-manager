import { Priority, Status } from './types';

export const priorities = [
  { id: Priority.High, title: 'High' },
  { id: Priority.Medium, title: 'Medium' },
  { id: Priority.Low, title: 'Low' },
  { id: Priority.Urgent, title: 'Urgent' },
  { id: Priority.None, title: 'None' },
];

export const statuses = [
  { id: Status.InProgress, title: 'In Progress' },
  { id: Status.NotStarted, title: 'Not Started' },
  { id: Status.Completed, title: 'Completed' },
];

export const statusColors = {
  not_started: 'bg-gray-200 text-gray-800',
  in_progress: 'bg-yellow-200 text-yellow-800',
  completed: 'bg-green-200 text-green-800',
};

export const priorityColors = {
  high: 'bg-red-200 text-red-800',
  medium: 'bg-yellow-200 text-yellow-800',
  low: 'bg-green-200 text-green-800',
  urgent: 'bg-purple-200 text-purple-800',
  none: 'bg-gray-200 text-gray-800',
};

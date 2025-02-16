import { useState } from 'react';
import { Task } from '../lib/types';
import TaskModal from './TaskModal';
import { statusColors } from '../lib/common';

export function TaskItem({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className="relative rounded-md bg-white px-4 py-6 shadow-task dark:bg-neutral-700 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <h3 className="text-heading-md text-neutral-900 hover:text-purple-500 dark:text-white">
          {task.title}
        </h3>
        <div className="mt-2 text-body-md text-neutral-400">
          <span
            className={`px-2 py-1 rounded ${
              statusColors[task.status]
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {isOpen && (
        <TaskModal
          onClose={() => {
            setIsOpen(false);
          }}
          task={task}
        />
      )}
    </>
  );
}

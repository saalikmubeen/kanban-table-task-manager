import { Priority, Task } from '../lib/types';
import ColumnItem from './ColumnItem';

type KanbanViewProps = {
  tasks: Task[];
};

const KanbanView = ({ tasks }: KanbanViewProps) => {
  const transformedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.priority]) {
      acc[task.priority] = [];
    }

    acc[task.priority].push(task);

    return acc;
  }, {} as Record<Priority, Task[]>);

  return (
    <div className="mx-4 my-6 flex shrink-0 gap-6 overflow-x-auto w-full">
      {Object.entries(transformedTasks).map(([priority, tasks]) => (
        <ColumnItem
          key={priority}
          column={{
            id: priority as Priority,
            title: priority,
            tasks,
          }}
        />
      ))}
    </div>
  );
};

export default KanbanView;

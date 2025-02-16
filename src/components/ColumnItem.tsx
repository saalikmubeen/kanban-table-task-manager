import { Column } from '../lib/types';
import { TaskItem } from './TaskItem';

const priorityColors = {
  high: 'before:bg-red-200',
  medium: 'before:bg-yellow-200',
  low: 'before:bg-green-200',
  urgent: 'before:bg-purple-200',
  none: 'before:bg-gray-200',
};

function ColumnItem({ column }: { column: Column }) {
  return (
    <div className="not-first:w-[17.5rem] grow-0">
      <h2
        className={`flex gap-3 text-heading-sm uppercase text-neutral-400 before:block before:size-4 before:rounded-full ${
          priorityColors[column.id]
        }`}
      >
        {column.title} ({column.tasks.length})
      </h2>
      <div className="mt-6 flex flex-col gap-4">
        {column.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default ColumnItem;

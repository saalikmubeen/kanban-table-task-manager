import { Button, Listbox } from '@headlessui/react';
import { BulkUpdateType, Task } from '../lib/types';
import TaskModal from './TaskModal';
import { useState } from 'react';
import { statusColors, priorityColors } from '../lib/common';
import { Tooltip } from './Tooltip';
import DeleteTaskModal from './DeleteTaskModal';
import { useAppDataContext } from '../context/TasksContext';
import BulkUpdateModal from './BulkUpdateModal';

const pageSizeOptions = [5, 10, 20, 50];

type TableViewProps = {
  tasks: Task[];
};

const TableView = ({ tasks }: TableViewProps) => {
  const { dispatch } = useAppDataContext();

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Task | string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'id',
    direction: 'ascending',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    pageSizeOptions[1]
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(
    new Set()
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkUpdateType, setBulkUpdateType] =
    useState<BulkUpdateType | null>(null);

  const sortedData = [...tasks].sort((a, b) => {
    if (sortConfig.key in a && sortConfig.key in b) {
      const key = sortConfig.key as keyof Task;
      if (a[key] < b[key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    } else {
      // it's a custom field key
      const aVal = a.customFields.find(
        (field) => field.id === sortConfig.key
      );

      const bVal = b.customFields.find(
        (field) => field.id === sortConfig.key
      );

      if (aVal && bVal) {
        const aValue =
          aVal.type === 'number' ? Number(aVal.value) : aVal.value;
        const bValue =
          bVal.type === 'number' ? Number(bVal.value) : bVal.value;

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      } else {
        return 0;
      }
    }
  });

  const requestSort = (key: keyof Task | string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Task | string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '↑↓';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (taskId: string) => {
    setSelectedTasks((prevSelectedTasks) => {
      const newSelectedTasks = new Set(prevSelectedTasks);
      if (newSelectedTasks.has(taskId)) {
        newSelectedTasks.delete(taskId);
      } else {
        newSelectedTasks.add(taskId);
      }
      return newSelectedTasks;
    });
  };

  const handleSelectAllChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      setSelectedTasks(new Set(sortedData.map((task) => task.id)));
    } else {
      setSelectedTasks(new Set());
    }
  };

  const handleBulkDelete = () => {
    if (selectedTasks.size > 0) {
      dispatch({
        type: 'BULK_DELETE_TASKS',
        payload: {
          taskIds: Array.from(selectedTasks),
        },
      });
      setSelectedTasks(new Set());
      setDeleteModalOpen(false);
    }
  };

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const customFieldCols =
    tasks.length > 0
      ? tasks[0].customFields.map((field) => (
          <th
            key={field.name}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
            onClick={() => requestSort(field.id)}
            aria-sort={
              sortConfig.key === field.id
                ? sortConfig.direction
                : 'none'
            }
          >
            {field.name} {getSortIcon(field.id)}
          </th>
        ))
      : null;

  return (
    <>
      <div className="overflow-x-auto w-full">
        <div className="mb-4 flex justify-between items-center">
          <Listbox value={itemsPerPage} onChange={setItemsPerPage}>
            <div className="relative w-32">
              <Listbox.Button
                className="cursor-pointer flex w-full items-center justify-between rounded-md border border-neutral-400 px-3 py-1 text-left text-sm hover:border-purple-500 ui-open:border-purple-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                aria-label="Items per page"
              >
                {itemsPerPage} per page
                <span aria-hidden="true">↓</span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-700 rounded-md shadow-lg">
                {pageSizeOptions.map((option) => (
                  <Listbox.Option
                    key={option}
                    value={option}
                    className="cursor-pointer select-none relative py-1 pl-10 pr-4 text-sm text-neutral-400 ui-active:text-purple-500 dark:text-neutral-300 dark:ui-active:text-purple-500"
                  >
                    {option}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <div className="flex items-center gap-4 pr-5">
            {selectedTasks.size > 0 && (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {selectedTasks.size} item(s) selected
              </span>
            )}
            <Tooltip className="top-full -translate-x-1/2">
              <ul className="grid gap-4">
                <li>
                  <Button
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      if (selectedTasks.size > 0) {
                        setDeleteModalOpen(true);
                      }
                    }}
                  >
                    Bulk Delete
                  </Button>
                </li>

                <li>
                  <Button
                    className="text-purple-500 cursor-pointer"
                    onClick={() => {
                      if (selectedTasks.size > 0) {
                        setBulkUpdateType('status');
                      }
                    }}
                  >
                    Change Status
                  </Button>
                </li>

                <li>
                  <Button
                    className="text-yellow-500 cursor-pointer"
                    onClick={() => {
                      if (selectedTasks.size > 0) {
                        setBulkUpdateType('priority');
                      }
                    }}
                  >
                    Change Priority
                  </Button>
                </li>

                <li>
                  <Button
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      if (selectedTasks.size > 0) {
                        setBulkUpdateType('both');
                      }
                    }}
                  >
                    Change Both
                  </Button>
                </li>
              </ul>
            </Tooltip>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-600 bg-white dark:bg-neutral-700 rounded-md shadow-task">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedTasks.size === sortedData.length}
                  onChange={(e) => {
                    handleSelectAllChange(e);
                  }}
                  aria-label="Select all tasks"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('title')}
                aria-sort={
                  sortConfig.key === 'title'
                    ? sortConfig.direction
                    : 'none'
                }
              >
                Title {getSortIcon('title')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('status')}
                aria-sort={
                  sortConfig.key === 'status'
                    ? sortConfig.direction
                    : 'none'
                }
              >
                Status {getSortIcon('status')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('priority')}
                aria-sort={
                  sortConfig.key === 'priority'
                    ? sortConfig.direction
                    : 'none'
                }
              >
                Priority {getSortIcon('priority')}
              </th>

              {customFieldCols}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-700 divide-y divide-gray-200 dark:divide-neutral-600">
            {paginatedData.map((task) => {
              const { id, priority, status, title, customFields } =
                task;

              return (
                <tr
                  key={id}
                  className={`hover:bg-gray-100 dark:hover:bg-neutral-600 cursor-pointer ${
                    selectedTasks.has(task.id)
                      ? 'bg-gray-300 dark:bg-neutral-500'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedTask(task);
                  }}
                  aria-selected={selectedTasks.has(id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={selectedTasks.has(id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(id);
                      }}
                      aria-label={`Select task ${title}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded ${statusColors[status]}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded ${priorityColors[priority]}`}
                    >
                      {priority}
                    </span>
                  </td>

                  {customFields.map((field) => {
                    return (
                      <td
                        key={field.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400"
                      >
                        {field.value || '-'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer px-3 py-1 border rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-white text-sm"
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="dark:text-white text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="cursor-pointer px-3 py-1 border rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-white text-sm"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskModal
          onClose={() => {
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      )}

      {deleteModalOpen && (
        <DeleteTaskModal
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleBulkDelete}
          title={`Delete ${selectedTasks.size} selected tasks?`}
          subtitle={`Are you sure you want to delete all the ${selectedTasks.size} selected tasks? This action cannot be reversed.`}
        />
      )}

      {bulkUpdateType && (
        <BulkUpdateModal
          onClose={() => {
            setBulkUpdateType(null);
            setSelectedTasks(new Set());
          }}
          type={bulkUpdateType}
          selectedTasks={selectedTasks}
        />
      )}
    </>
  );
};

export default TableView;

import { Button } from '@headlessui/react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useAppDataContext } from '../../context/AppContext';
import { statuses, priorities } from '../../lib/common';
import {
  Task,
  StatusType,
  PriorityType,
  CustomField,
} from '../../lib/types';
import { Tooltip } from '../Tooltip';
import DeleteTaskModal from './DeleteTaskModal';
import Modal from './Modal';
import { Input, Label } from '../forms/FormComponents';
import Select from '../forms/Select';

type TaskModalProps = {
  task?: Task;
  onClose: () => void;
};

export default function TaskModal({ task, onClose }: TaskModalProps) {
  const { dispatch } = useAppDataContext();

  const [title, setTitle] = useState(task?.title ?? '');

  const initialStatus = task
    ? { id: task.status, title: task.status }
    : statuses[0];

  const initialPriority = task
    ? { id: task.priority, title: task.priority }
    : priorities[0];

  const initialCustomFields = task ? task.customFields : [];

  const [status, setStatus] = useState<StatusType>(initialStatus);
  const [priority, setPriority] =
    useState<PriorityType>(initialPriority);

  const [customFields, setCustomFields] = useState<CustomField[]>(
    initialCustomFields
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (task) {
      dispatch({
        type: 'EDIT_TASK',
        payload: {
          ...task,
          title: title,
          status: status.id,
          priority: priority.id,
          customFields,
        },
      });
    } else {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: nanoid(),
          title: title,
          status: status.id,
          priority: priority.id,
          customFields: [],
        },
      });
    }

    onClose();
  };

  const handleDeleteTask = () => {
    if (task) {
      dispatch({
        type: 'DELETE_TASK',
        payload: {
          taskId: task.id,
        },
      });

      onClose();
    }
  };

  const handleCustomFieldChange = (
    fieldId: string,
    value: string
  ) => {
    console.log(value);
    setCustomFields(
      customFields.map((field) =>
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  return (
    <>
      <Modal onClose={onClose}>
        <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
          <header className="flex gap-4">
            <h2 className="grow text-heading-lg text-neutral-900 dark:text-white">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>

            {task && (
              <Tooltip className="top-full -translate-x-1/2">
                <ul className="grid gap-4">
                  <li>
                    <Button
                      className="text-red-600 cursor-pointer"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      Delete Task
                    </Button>
                  </li>
                </ul>
              </Tooltip>
            )}
          </header>

          <Label caption="Title">
            <Input
              name="title"
              placeholder="e.g. Take coffee break"
              value={title}
              onChange={(value) => {
                setTitle(value);
              }}
            />
          </Label>

          <div>
            <h3 className="text-body-md text-neutral-400 dark:text-white">
              Current Status
            </h3>
            <input type="text" name="status" hidden readOnly />
            <div className="relative mt-2">
              <Select
                selected={status}
                onChange={(value) => {
                  setStatus(value as StatusType);
                }}
                options={statuses}
              />
            </div>
          </div>

          <div>
            <h3 className="text-body-md text-neutral-400 dark:text-white">
              Priority
            </h3>
            <input type="text" name="priority" hidden readOnly />
            <div className="relative mt-2">
              <Select
                selected={priority}
                onChange={(value) => {
                  setPriority(value as PriorityType);
                }}
                options={priorities}
              />
            </div>
          </div>

          {/* Custom Fields */}

          {customFields.map((field) => {
            if (field.type === 'checkbox') {
              return (
                <Label caption={field.name}>
                  <input
                    type="checkbox"
                    checked={field.value as boolean}
                    onChange={(e) => {
                      console.log(e.target.checked);

                      handleCustomFieldChange(
                        field.id,
                        e.target.checked.toString()
                      );
                    }}
                    aria-label="Select all tasks"
                  />
                </Label>
              );
            } else {
              return (
                <Label caption={field.name}>
                  <Input
                    name={field.name}
                    value={field.value as string}
                    type={field.type}
                    onChange={(value) =>
                      handleCustomFieldChange(field.id, value)
                    }
                  />
                </Label>
              );
            }
          })}

          <button
            type="submit"
            className="w-full rounded-full bg-purple-500 py-2 text-body-lg font-bold text-white cursor-pointer"
          >
            Save changes
          </button>
        </form>
      </Modal>

      {task && deleteModalOpen && (
        <DeleteTaskModal
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteTask}
          subtitle={`Are you sure you want to delete the ${task.title} task? This action cannot be reversed.`}
        />
      )}
    </>
  );
}

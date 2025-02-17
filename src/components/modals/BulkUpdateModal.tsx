import { useState } from 'react';
import Modal from './Modal';
import {
  BulkUpdateType,
  PriorityType,
  StatusType,
} from '../../lib/types';
import Select from '../forms/Select';

import { statuses, priorities } from '../../lib/common';
import { useAppDataContext } from '../../context/AppContext';

type BulkUpdateModalProps = {
  type: BulkUpdateType;
  onClose: () => void;
  selectedTasks: Set<string>;
};

export default function BulkUpdateModal({
  type,
  selectedTasks,
  onClose,
}: BulkUpdateModalProps) {
  const { dispatch } = useAppDataContext();

  const [status, setStatus] = useState<StatusType>(statuses[0]);
  const [priority, setPriority] = useState<PriorityType>(
    priorities[0]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedTasks.size > 0) {
      dispatch({
        type: 'BULK_EDIT_TASKS',
        payload: {
          taskIds: Array.from(selectedTasks),
          status: status.id,
          priority: priority.id,
          type,
        },
      });
    }

    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
        <header className="flex gap-4">
          <h2 className="grow text-heading-lg text-neutral-900 dark:text-white">
            Bulk update {selectedTasks.size} tasks ?
          </h2>
        </header>

        {(type === 'status' || type === 'both') && (
          <div>
            <h3 className="text-body-md text-neutral-400 dark:text-white">
              Status
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
        )}

        {(type === 'priority' || type === 'both') && (
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
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-purple-500 py-2 text-body-lg font-bold text-white cursor-pointer"
        >
          Save changes
        </button>
      </form>
    </Modal>
  );
}

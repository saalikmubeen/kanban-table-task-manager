import { Button } from '@headlessui/react';
import { useState } from 'react';
import { useAppDataContext } from '../../context/TasksContext';
import CustomFieldModal from '../modals/CustomFieldModal';
import NewTaskButton from '../NewTaskButton';
import { Tooltip } from '../Tooltip';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [customFieldModalOpen, setCustomFieldModalOpen] =
    useState(false);
  const { dispatch, state } = useAppDataContext();

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  return (
    <>
      <header className="relative z-30 flex border-blue-200 bg-white sm:border-b dark:border-neutral-600 dark:bg-neutral-700">
        <div
          className={
            'flex items-center border-blue-200 px-4 py-5 sm:border-r dark:border-neutral-600'
          }
        >
          <ThemeToggle />
        </div>
        <div className="flex grow items-center gap-4 p-4 pl-0 sm:pl-4">
          <NewTaskButton header />

          <Tooltip className="-right-2 top-full mt-4 cursor-pointer">
            <ul className="grid gap-4">
              <li>
                <Button
                  className="text-yellow-500 cursor-pointer"
                  onClick={() => setCustomFieldModalOpen(true)}
                >
                  Manage Fields
                </Button>
              </li>

              <li>
                <Button
                  className="flex items-center gap-2 text-orange-500 hover:text-orange-600 disabled:text-gray-400 cursor-pointer"
                  onClick={handleUndo}
                  disabled={state.historyStates.length === 0}
                >
                  Undo Changes ←
                </Button>
              </li>

              <li>
                <Button
                  className="flex items-center gap-2 text-teal-500 hover:text-teal-600 disabled:text-gray-400 cursor-pointer"
                  onClick={handleRedo}
                  disabled={state.futureStates.length === 0}
                >
                  Redo Changes →
                </Button>
              </li>
            </ul>
          </Tooltip>
        </div>
      </header>

      {customFieldModalOpen && (
        <CustomFieldModal
          onClose={() => setCustomFieldModalOpen(false)}
        />
      )}
    </>
  );
}

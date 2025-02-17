import { useState } from 'react';
import { Button } from '@headlessui/react';
import TaskModal from './modals/TaskModal';

type NewTaskButtonProps = {
  header: boolean;
};

function NewTaskButton({ header }: NewTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className={`items-center rounded-full bg-purple-500 px-[1.125rem] py-[0.625rem] text-heading-md text-white hover:bg-purple-500/75 sm:px-6 sm:py-3 cursor-pointer ${
          header ? 'ml-auto' : ''
        }   `}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <img
          src="/icon-add-task-mobile.svg"
          alt=""
          className={`${header ? 'sm:hidden' : 'hidden'}`}
        />

        <span
          className={` ${header ? 'hidden sm:inline' : 'inline'}  `}
          aria-hidden="true"
        >
          +{' '}
        </span>
        <span
          className={` ${
            header ? 'sr-only sm:not-sr-only' : 'inline'
          } `}
        >
          Add New Task
        </span>
      </Button>

      {isOpen && (
        <TaskModal
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
}

export default NewTaskButton;

import ThemeToggle from './ThemeToggle';
import NewTaskButton from './NewTaskButton';
import { Tooltip } from './Tooltip';
import { Button } from '@headlessui/react';
import { useState } from 'react';
import CustomFieldModal from './CustomFieldModal';

export default function Header() {
  const [customFieldModalOpen, setCustomFieldModalOpen] =
    useState(false);
  return (
    <>
      <header className="relative z-30 flex border-blue-200 bg-white sm:border-b dark:border-neutral-600 dark:bg-neutral-700">
        <div
          className={
            'flex items-center border-blue-200 px-4 py-5 sm:border-r dark:border-neutral-600'
          }
        >
          <Logo />
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
            </ul>
          </Tooltip>

          <ThemeToggle />
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

function Logo() {
  return (
    <a href="/">
      <img src="/logo-mobile.svg" alt="" />
    </a>
  );
}

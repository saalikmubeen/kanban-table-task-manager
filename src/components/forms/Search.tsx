import { Listbox } from '@headlessui/react';
import React from 'react';
import { Input } from './FormComponents';
import { priorities, statuses } from '../../lib/common';
import { PriorityType, StatusType } from '../../lib/types';

type SearchProps = {
  setPriorityFilter: React.Dispatch<
    React.SetStateAction<PriorityType>
  >;
  setStatusFilter: React.Dispatch<React.SetStateAction<StatusType>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  priorityFilter: PriorityType;
  statusFilter: StatusType;
};

const priorityOptions = [...priorities, { id: '', title: 'All' }];
const statusOptions = [...statuses, { id: '', title: 'All' }];

const Search = ({
  setPriorityFilter,
  setStatusFilter,
  setSearchTerm,
  searchTerm,
  priorityFilter,
  statusFilter,
}: SearchProps) => {
  return (
    <div className="m-4 flex flex-col md:flex-row gap-4">
      <Input
        name="search"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(value) => setSearchTerm(value)}
      />
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
        <Listbox value={priorityFilter} onChange={setPriorityFilter}>
          <div className="relative w-full">
            <Listbox.Button className="cursor-pointer flex w-full items-center justify-between rounded-md border border-neutral-400 px-4 py-2 text-left text-body-lg hover:border-purple-500 ui-open:border-purple-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white">
              {priorityFilter.title}
              <span>↓</span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-700 rounded-md shadow-lg">
              {priorityOptions.map((option) => (
                <Listbox.Option
                  key={option.id}
                  value={option}
                  className="cursor-pointer select-none relative py-2 pl-10 pr-4 text-body-lg text-neutral-400 ui-active:text-purple-500 dark:text-neutral-300 dark:ui-active:text-purple-500"
                >
                  {option.title}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
        <Listbox value={statusFilter} onChange={setStatusFilter}>
          <div className="relative w-full">
            <Listbox.Button className="cursor-pointer flex w-full items-center justify-between rounded-md border border-neutral-400 px-4 py-2 text-left text-body-lg hover:border-purple-500 ui-open:border-purple-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white">
              {statusFilter.title}
              <span>↓</span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-700 rounded-md shadow-lg">
              {statusOptions.map((option) => (
                <Listbox.Option
                  key={option.id}
                  value={option}
                  className="cursor-pointer select-none relative py-2 pl-10 pr-4 text-body-lg text-neutral-400 ui-active:text-purple-500 dark:text-neutral-300 dark:ui-active:text-purple-500"
                >
                  {option.title}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default Search;

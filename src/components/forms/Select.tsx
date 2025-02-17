import { Listbox } from '@headlessui/react';
import {
  CustomFieldOptionsType,
  PriorityType,
  StatusType,
} from '../../lib/types';

type SelectProps = {
  selected: PriorityType | StatusType | CustomFieldOptionsType;
  options: StatusType[] | PriorityType[] | CustomFieldOptionsType[];
  onChange(
    value: PriorityType | StatusType | CustomFieldOptionsType
  ): void;
};

export default function StatusSelect({
  selected,
  options,
  onChange,
}: SelectProps) {
  return (
    <Listbox
      as="div"
      value={selected}
      name="board"
      onChange={(option) => {
        onChange(option);
      }}
      className="grow"
    >
      <Listbox.Button
        id="selectButton"
        className="cursor-pointer flex w-full items-center justify-between rounded-[0.25rem] border border-neutral-400 px-4 py-2 text-left text-body-lg hover:border-purple-500 ui-open:border-purple-500 dark:text-white"
      >
        {selected.title}
        <img src="/icon-chevron-down.svg" alt="" />
      </Listbox.Button>
      <Listbox.Options
        id="selectOptions"
        className="z-10 grid w-[var(--select-width)] gap-2 rounded-[0.25rem] bg-white p-4 dark:bg-neutral-700"
      >
        {options.map((entry) => (
          <Listbox.Option
            key={entry.id}
            value={entry}
            className="w-full cursor-pointer text-body-lg text-neutral-400 ui-active:text-purple-500"
          >
            {entry.title}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}

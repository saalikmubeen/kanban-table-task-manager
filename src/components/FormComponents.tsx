import { CustomFieldOptions } from '../lib/types';

export function Label({
  caption: label,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <p className="mb-2 text-body-md text-neutral-400 dark:text-white">
        {label}
      </p>
      {children}
    </label>
  );
}

type InputProps = {
  name: string;
  type?: CustomFieldOptions;
  value?: string | number;
  placeholder?: string;
  autofocus?: boolean;
  onChange(value: string): void;
};

export function Input({
  name,
  value,
  type = 'text',
  placeholder,
  autofocus,
  onChange,
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autofocus}
      className="bg-transparent w-full rounded-[0.25rem] border border-neutral-400/25 px-4 py-2 text-body-lg text-neutral-900 placeholder:text-neutral-400 dark:text-white"
    />
  );
}

import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Input, Label } from '../forms/FormComponents';
import Modal from './Modal';
import { Button } from '@headlessui/react';
import Select from '../forms/Select';
import {
  CustomFieldOptions,
  CustomFieldOptionsType,
} from '../../lib/types';
import { useAppDataContext } from '../../context/TasksContext';

interface CustomField {
  id: string;
  name: string;
  type: CustomFieldOptions;
}

const fieldOptions: CustomFieldOptionsType[] = [
  { id: 'text', title: 'Text' },
  { id: 'number', title: 'Number' },
  { id: 'checkbox', title: 'Checkbox' },
];

interface CustomFieldModalProps {
  onClose: () => void;
}

export default function CustomFieldModal({
  onClose,
}: CustomFieldModalProps) {
  const { dispatch, state } = useAppDataContext();
  const [fields, setFields] = useState<CustomField[]>(state.fields);

  const addField = () => {
    setFields([...fields, { id: nanoid(), name: '', type: 'text' }]);
  };

  const updateField = (
    id: string,
    key: keyof CustomField,
    value: string | string[]
  ) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_CUSTOM_FIELDS',
      payload: { fields: fields },
    });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
        <h2 className="text-heading-lg text-neutral-900 dark:text-white">
          Manage Your Custom Fields
        </h2>

        {fields.map((field) => (
          <div key={field.id} className="flex items-end  gap-4">
            <Label caption="Name of the field">
              <Input
                name="field-name"
                placeholder="Field name"
                value={field.name}
                onChange={(value) =>
                  updateField(field.id, 'name', value)
                }
              />
            </Label>
            <Select
              selected={
                fieldOptions.find(
                  (fieldType) => fieldType.id === field.type
                ) || fieldOptions[0]
              }
              options={fieldOptions}
              onChange={(value) =>
                updateField(field.id, 'type', value.id)
              }
            />
            <Button
              type="button"
              className=" h-full cursor-pointer"
              onClick={() => removeField(field.id)}
            >
              <img
                src="/icon-cross.svg"
                alt="Remove field"
                className="mt-8"
              />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          className="w-full rounded-full bg-blue-500 py-2 text-body-lg font-bold text-white cursor-pointer"
          onClick={addField}
        >
          + Add Field
        </Button>

        <Button
          type="submit"
          className="w-full rounded-full bg-purple-500 py-2 text-body-lg font-bold text-white cursor-pointer"
        >
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}

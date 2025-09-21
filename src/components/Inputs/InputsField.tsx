'use client';

import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  name?: string;
  type?: HTMLInputElement['type'];
  id?: string;
  defaultValue?: string;
  accept?: string;
  autoComplete?: string;
  register?: UseFormRegisterReturn;
}

export default function InputField(props: InputFieldProps) {
  const {
    label,
    name,
    type,
    id,
    defaultValue,
    accept,
    autoComplete,
    register,
  } = props;

  const inputId = id || name;
  const fieldName = register?.name ?? name;

  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={inputId} className="text-sm text-gray-400">
        {label}
      </label>
      <input
        className="input-field"
        type={type || 'text'}
        id={inputId}
        name={fieldName}
        defaultValue={defaultValue}
        accept={accept}
        autoComplete={autoComplete}
        placeholder={label}
        {...register}
      />
    </div>
  );
}

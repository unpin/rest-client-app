'use client';

import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  name?: string;
  type?: string;
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
      <label htmlFor={inputId} className="text-sm text-gray-700">
        {label}
      </label>
      <input
        className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-900 
                   placeholder-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-400 
                   outline-none transition"
        type={type || 'text'}
        id={inputId}
        name={fieldName}
        defaultValue={defaultValue}
        accept={accept}
        autoComplete={autoComplete}
        {...register}
      />
    </div>
  );
}

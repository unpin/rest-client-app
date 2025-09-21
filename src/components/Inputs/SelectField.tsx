import { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';

interface SelectFieldProps {
  label: string;
  name?: string;
  id?: string;
  defaultValue?: string;
  options: string[];
  register?: UseFormRegisterReturn;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}

export default function SelectField({
  label,
  name,
  id,
  defaultValue,
  options,
  register,
  onChange,
  value,
}: SelectFieldProps) {
  const t = useTranslations('Codegen');
  return (
    <div className="flex flex-col space-y-2 w-48">
      <label
        htmlFor={id || name || label}
        className="font-semibold text-sm text-gray-100"
      >
        {label}
      </label>
      <select
        id={id || name || label}
        name={name}
        defaultValue={defaultValue}
        className="h-[25px] rounded-md border px-3 text-sm shadow-sm
             focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
             bg-gray-800 border-neutral-700 text-gray-100 "
        {...register}
        onChange={onChange}
        value={value}
      >
        <option value="" disabled hidden>
          {defaultValue || t('chooseLanguage')}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

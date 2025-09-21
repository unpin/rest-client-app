import { CaretDown } from '@/components/Icon/Icon';
import { useEffect, useRef, useState } from 'react';

export type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

const methods: Method[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
];

type MethodDropdownProps = {
  selected: Method;
  setSelected: (method: Method) => void;
};

export default function MethodDropdown({
  selected,
  setSelected,
}: MethodDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleMethodSelection = (method: Method) => {
    setSelected(method);
    setIsOpen(false);
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', onClickOutside);

    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="button-method flex items-center gap-2 rounded-lg hover:bg-gray-800 py-2 px-4 font-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm ${selected.toLowerCase()}`}>{selected}</span>
        <span className="fill-gray-200">
          <CaretDown />
        </span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-2 bg-gray-900 rounded-lg methods-list">
          {methods.map((method) => (
            <li
              key={method}
              className={`methods-list-item text-sm ${selected === method ? 'selected' : ''} ${method.toLocaleLowerCase()}`}
              onClick={() => handleMethodSelection(method)}
            >
              {method}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

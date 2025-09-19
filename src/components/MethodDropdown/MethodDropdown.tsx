import { CaretDown } from '@/components/Icon/Icon';
import { useEffect, useRef, useState } from 'react';

export type Method = { method: string };

const methods: Method[] = [
  { method: 'GET' },
  { method: 'POST' },
  { method: 'PUT' },
  { method: 'PATCH' },
  { method: 'DELETE' },
  { method: 'HEAD' },
  { method: 'OPTIONS' },
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
        className="button-method flex items-center gap-2 rounded hover:bg-gray-800 py-2 px-4 font-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm ${selected.method.toLowerCase()}`}>
          {selected.method}
        </span>
        <span className="fill-gray-200">
          <CaretDown />
        </span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-2 bg-gray-900 rounded methods-list">
          {methods.map((method) => (
            <li
              key={method.method}
              className={`methods-list-item text-sm ${selected.method === method.method ? 'selected' : ''} ${method.method.toLocaleLowerCase()}`}
              onClick={() => handleMethodSelection(method)}
            >
              {method.method}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

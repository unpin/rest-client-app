'use client';

import { CaretDown } from '@/components/Icon/Icon';
import { useEffect, useRef, useState } from 'react';

type Method = { method: string };

const methods: Method[] = [
  { method: 'GET' },
  { method: 'POST' },
  { method: 'PUT' },
  { method: 'PATCH' },
  { method: 'DELETE' },
  { method: 'HEAD' },
  { method: 'OPTIONS' },
];

function MethodDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(methods[0]);
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
        <span className={selected.method.toLowerCase()}>{selected.method}</span>
        <span className="fill-gray-200">
          <CaretDown />
        </span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-2 bg-gray-900 rounded shadow-lg methods-list">
          {methods.map((method) => (
            <li
              key={method.method}
              className={`methods-list-item ${selected.method === method.method ? 'selected' : ''} ${method.method.toLocaleLowerCase()}`}
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

function RequestBar() {
  const [url, setUrl] = useState('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSend = () => {};

  return (
    <div className="flex grow">
      <hr className="bg-gray-800 mx-2" />
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        className="border-l px-4 border-gray-800 grow text-gray-200"
        placeholder="Enter request URL..."
      />
      <button
        className="font-semibold rounded bg-blue-500 hover:bg-blue-400 px-6 cursor-pointer ml-2"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}

export default function ClientPage() {
  const handleChange = (data: { method: string; url: string }) => {
    console.log('RequestBar change:', data);
  };
  const handleSend = (data: { method: string; url: string }) => {
    console.log('RequestBar send:', data);
  };
  return (
    <div className="max-w-6xl mx-auto px-4 bg-gray-900">
      <div className="rounded border border-gray-800 ">
        <div className="flex p-1 gap-4">
          <MethodDropdown />
          <RequestBar onChange={handleChange} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

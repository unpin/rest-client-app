'use client';
import { useRouter, usePathname } from '@/i18n/navigation';
import { type ChangeEvent, type ReactNode, useTransition } from 'react';
import { Locale } from '@/i18n/routing';

type Props = {
  children: ReactNode;
  defaultValue: string;
};

export default function LocaleSwitcher({ children, defaultValue }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace({ pathname }, { locale: nextLocale });
    });
  }

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        <select
          className={`ml-2 rounded-md border border-gray-300 bg-transparent px-3 py-2
            text-sm outline-none transition-colors
            text-red-600
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500
            dark:border-gray-600 dark:text-red-400 dark:focus:border-blue-400
            ${isPending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          `}
          defaultValue={defaultValue}
          disabled={isPending}
          onChange={onSelectChange}
        >
          {children}
        </select>
      </label>
    </div>
  );
}

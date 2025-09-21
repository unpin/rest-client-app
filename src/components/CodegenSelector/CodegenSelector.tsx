'use client';

import { useForm } from 'react-hook-form';
import SelectField from '@/components/Inputs/SelectField';
import { getLanguageList } from 'postman-code-generators';
import { useState } from 'react';
import { createCodeSample } from '@/utils/codegen/generator';
import { Request as PostmanRequest } from 'postman-collection';

type FormValues = {
  language: string;
  variant: string;
};

type CodegenSelectorProps = {
  request: PostmanRequest;
};

export default function CodegenSelector({ request }: CodegenSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { register } = useForm<FormValues>();
  const languages = getLanguageList();

  const generateCode = async () => {
    const selected = languages.find((obj) => obj.label === selectedLanguage);
    if (!selected) return;

    const data = await createCodeSample(
      selected.key,
      selected.variants[0].key,
      request
    );
    setCode(data);
    setCopied(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="mt-0 rounded-2xl shadow-lg bg-[var(--color-gray-900)]">
      <div className="flex gap-6">
        <div className="flex flex-col gap-4 w-1/3">
          <div className="flex items-end gap-4">
            <SelectField
              onChange={(e) => setSelectedLanguage(e.target.value)}
              value={selectedLanguage}
              label="Choose language"
              name="language"
              options={languages.map((lang) => lang.label)}
              register={register('language')}
            />

            <button
              onClick={generateCode}
              type="button"
              disabled={!selectedLanguage || !request.url?.toString()}
              className={`h-[25px] flex items-center gap-2 px-6 rounded-md text-sm font-semibold transition-colors
  ${
    !selectedLanguage || !request.url?.toString()
      ? 'bg-blue-500 opacity-50 cursor-not-allowed text-white'
      : 'bg-blue-500 hover:bg-blue-400 text-white'
  }
`}
            >
              Generate
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-gray-200">
              Code examples
            </h4>
            <button
              onClick={copyCode}
              disabled={!code}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-700 text-gray-200
             hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed
             cursor-pointer transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <textarea
            className="flex-1 min-h-[200px] rounded-md border border-gray-300 text-sm shadow-sm
                       bg-gray-800 text-gray-100 resize-none"
            placeholder="Code Example"
            value={code}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

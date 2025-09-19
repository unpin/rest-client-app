'use client';

import MethodDropdown, {
  type Method,
} from '@/components/MethodDropdown/MethodDropdown';
import RequestBar from '@/components/RequestBar/RequestBar';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import { MagicWand, Trash } from '../Icon/Icon';
import { Editor } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';

type ClientContainerProps = {
  initialMethod: Method;
  initialUrl: string;
  initialBody: string;
};

type BodyMode = 'json' | 'text';

function parseHeadersFromSearchParams(
  searchParams: string
): { key: string; value: string }[] {
  const headers: { key: string; value: string }[] = [];
  const paramsArray = searchParams.split('&');
  paramsArray.forEach((param) => {
    const [key, value] = param.split('=');
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();
    if (trimmedKey && trimmedValue) {
      headers.push({
        key: decodeURIComponent(trimmedKey.replace(/\+/g, ' ')),
        value: decodeURIComponent(trimmedValue.replace(/\+/g, ' ')),
      });
    }
  });
  return headers;
}

function fromBase64(string: string) {
  try {
    const binary = atob(string);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

function toBase64(string: string) {
  return btoa(
    new TextEncoder()
      .encode(string)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

export default function ClientContainer({
  initialMethod,
  initialUrl,
  initialBody,
}: ClientContainerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState(fromBase64(decodeURIComponent(initialUrl)));
  const [body, setBody] = useState(fromBase64(decodeURIComponent(initialBody)));
  const [bodyMode, setBodyMode] = useState<BodyMode>('json');
  const [prettifyError, setPrettifyError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<Method>(initialMethod);
  const [response, setResponse] = useState<Response | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>(
    () => {
      const parsedHeaders = parseHeadersFromSearchParams(
        searchParams.toString()
      );
      if (parsedHeaders.length) return parsedHeaders;
      return [{ key: '', value: '' }];
    }
  );
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const prettifyBody = () => {
    if (bodyMode === 'json') {
      try {
        const prettified = JSON.stringify(JSON.parse(body), null, 2);
        setBody(prettified);
      } catch {
        setPrettifyError('Invalid JSON');
      }
    }
  };

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();
    headers.forEach(({ key, value }) => {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey && trimmedValue) {
        params.set(trimmedKey, trimmedValue);
      }
    });

    const base64Url = toBase64(url);
    const base64Body = body ? toBase64(body) : undefined;

    let newPath = `/client/${selectedMethod.method}/${base64Url}`;
    if (base64Body) newPath += `/${base64Body}`;
    const query = params.toString() ? `?${params.toString()}` : '';
    router.replace(`${newPath}${query}`);

    setIsLoading(true);
    setResponse(null);

    const requestHeaders = headers.reduce(
      (acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          method: selectedMethod.method,
          headers: requestHeaders,
          body,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHeader = (idx: number, field: string, value: string) => {
    setHeaders((headers) =>
      headers.map((h, i) => (i === idx ? { ...h, [field]: value } : h))
    );
  };

  const deleteHeader = (idx: number) => {
    setHeaders((headers) => headers.filter((_, i) => i !== idx));
  };

  const addHeader = () => {
    setHeaders((headers) => [...headers, { key: '', value: '' }]);
  };

  const handleMethodChange = (newMethod: Method) => {
    setSelectedMethod(newMethod);
  };

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) => {
    editorRef.current = editor;

    monacoInstance.editor.defineTheme('dark-gray', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e2939',
      },
    });
    monacoInstance.editor.setTheme('dark-gray');
  };

  const handleBodyModeChange = (mode: BodyMode) => {
    setPrettifyError(null);
    setBodyMode(mode);
  };

  const handleBodyChange = (value: string) => {
    setPrettifyError(null);
    setBody(value);
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[300px] p-4 rounded bg-gray-900">
      <div className="rounded border border-gray-800 ">
        <div className="flex p-1 gap-1 items-stretch">
          <MethodDropdown
            selected={selectedMethod}
            setSelected={handleMethodChange}
          />
          <div className="shrink-0 w-[1px] min-h-full bg-gray-800"></div>
          <RequestBar onSend={handleSend} url={url} onUrlChange={setUrl} />
        </div>
      </div>
      <div className="flex flex-col mt-4 gap-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-lg text-gray-200">Headers</h3>
          <button
            onClick={addHeader}
            className="py-1 text-white self-start text-sm font-semibold rounded bg-blue-500 hover:bg-blue-400 px-6 cursor-pointer"
          >
            Add header
          </button>
        </div>
        <table className="table">
          <thead className="table-header">
            <tr className="tr">
              <th className="table-cell">Key</th>
              <th className="table-cell">Value</th>
              <th className="table-cell"></th>
            </tr>
          </thead>
          <tbody className="table-body">
            {headers.map((header, idx) => (
              <tr key={idx} className="tr">
                <td className="table-cell">
                  <input
                    value={header.key}
                    onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                    placeholder="Key"
                    className="form-input"
                  />
                </td>
                <td className="table-cell">
                  <input
                    value={header.value}
                    onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                    placeholder="Value"
                    className="form-input"
                  />
                </td>
                <td className="table-cell">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => deleteHeader(idx)}
                      className="fill-red-400 hover:fill-red-300 cursor-pointer"
                    >
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="font-semibold text-lg text-gray-200">Body</h3>
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-1 bg-gray-800 self-start p-1 rounded">
              <button
                type="button"
                className={`button-body-mode ${bodyMode === 'json' ? 'bg-blue-500 hover:bg-blue-400' : 'hover:bg-gray-700'}`}
                onClick={() => handleBodyModeChange('json')}
              >
                JSON
              </button>
              <button
                type="button"
                className={`button-body-mode ${bodyMode === 'text' ? 'bg-blue-500 hover:bg-blue-400' : 'hover:bg-gray-700'}`}
                onClick={() => handleBodyModeChange('text')}
              >
                Text
              </button>
            </div>
            <div
              className={`rounded overflow-hidden border ${prettifyError ? 'border-red-400' : 'border-gray-700'}`}
            >
              <Editor
                height="300px"
                defaultLanguage={bodyMode}
                language={bodyMode}
                defaultValue={body}
                onMount={handleEditorDidMount}
                value={body}
                onChange={(value) => handleBodyChange(value ?? '')}
                theme="dark-gray"
              />
            </div>

            {bodyMode === 'json' && (
              <div className="flex gap-2 items-center">
                <button
                  className="flex items-center gap-2 text-gray-300 fill-gray-300 hover:text-gray-200 hover:fill-gray-200 px-4 py-1 border border-gray-800 hover:border-gray-600 rounded self-start cursor-pointer transition-all"
                  onClick={prettifyBody}
                >
                  <MagicWand />
                  Prettify
                </button>
                <p className="text-red-400 text-sm">
                  {prettifyError && prettifyError}
                </p>
              </div>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-lg text-gray-200">Code examples</h3>
        <div>{/* TODO: Code examples */}</div>

        <h4 className="font-semibold text-lg text-gray-200">Response</h4>
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : response ? (
          <div className="flex flex-col gap-4">
            <div
              className={`font-mono font-semibold text-sm px-2 py-1 self-start rounded ${
                response.status >= 200 && response.status < 300
                  ? 'bg-green-800 text-green-200'
                  : 'bg-red-800 text-red-200'
              }`}
            >
              {response.status} {response.statusText}
            </div>
            <div>
              <h4 className="font-semibold text-gray-300">Headers</h4>
              <pre className="text-sm bg-gray-800 p-2 rounded overflow-x-auto">
                {JSON.stringify(response.headers, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300">Body</h4>
              <pre className="text-sm bg-gray-800 p-2 rounded overflow-x-auto">
                {typeof response.body === 'object'
                  ? JSON.stringify(response.body, null, 2)
                  : response.body}
              </pre>
            </div>
          </div>
        ) : (
          <div className="border border-gray-800 rounded">
            <div className="text-gray-400 text-center p-8">
              Enter the URL and click SEND to get a response
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

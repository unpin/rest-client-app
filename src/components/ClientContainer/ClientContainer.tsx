'use client';

import MethodDropdown, {
  type Method,
} from '@/components/MethodDropdown/MethodDropdown';
import RequestBar from '@/components/RequestBar/RequestBar';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useRef, useState, useMemo } from 'react';
import { MagicWand, Trash } from '../Icon/Icon';
import { Editor } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import CodegenSelector from '@/components/CodegenSelector/CodegenSelector';
import {
  Request as PostmanRequest,
  RequestDefinition,
} from 'postman-collection';

import { ProxyResponseData } from '@/app/api/proxy/route';
import ProxyResponseView from '../ProxyResponseContainer/ProxyResponseContainer';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useLocale } from 'next-intl';
import { useRequestHistory } from '@/hooks/useRequestHistory';
import { useTranslations } from 'next-intl';


type ClientContainerProps = {
  initialMethod: string;
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
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();

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

function methodHasBody(method: Method) {
  return method === 'POST' || method === 'PUT' || method === 'PATCH';
}

export default function ClientContainer({
  initialMethod,
  initialUrl,
  initialBody,
}: ClientContainerProps) {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [url, setUrl] = useState(fromBase64(decodeURIComponent(initialUrl)));
  const [body, setBody] = useState(fromBase64(decodeURIComponent(initialBody)));
  const [bodyMode, setBodyMode] = useState<BodyMode>('json');
  const [prettifyError, setPrettifyError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<Method>(
    initialMethod as Method
  );
  const [response, setResponse] = useState<ProxyResponseData | null>(null);
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
  const [storedVariables] = useLocalStorage<{ key: string; value: string }[]>(
    'variables',
    []
  );
  const [urlError, setUrlError] = useState<string | null>(null);
  const { addItem } = useRequestHistory();

  const variableMap = useMemo(() => {
    return storedVariables.reduce(
      (acc, { key, value }) => {
        if (key) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
  }, [storedVariables]);

  const replaceWithVariables = (input: string) => {
    if (!input) return '';
    return input.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
      return variableMap[key] || match;
    });
  };

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

  const onURLChange = (url: string) => {
    setUrlError(null);
    setUrl(() => url);
  };

  const isURLCorrect = (url: string) => {
    try {
      new URL(replaceWithVariables(url));
    } catch {
      return false;
    }
    return true;
  };

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) return;

    setUrlError(null);
    setResponse(null);

    if (!isURLCorrect(url)) {
      setUrlError('Invalid URL format.');
      return;
    }

    const params = new URLSearchParams();
    headers.forEach(({ key, value }) => {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey && trimmedValue) {
        params.set(trimmedKey, trimmedValue);
      }
    });

    const requestHeaders = headers.reduce(
      (acc, { key, value }) => {
        if (key) acc[key] = replaceWithVariables(value);
        return acc;
      },
      {} as Record<string, string>
    );

    const base64Url = toBase64(url);
    const base64Body = body ? toBase64(body) : undefined;
    let newPath = `/client/${selectedMethod}/${base64Url}`;
    if (base64Body) newPath += `/${base64Body}`;
    const query = params.toString() ? `?${params.toString()}` : '';
    const fullPath = `/${locale}${newPath}${query}`;

    try {
      setIsLoading(true);
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: replaceWithVariables(url),
          method: selectedMethod,
          headers: requestHeaders,
          body: replaceWithVariables(body),
        }),
      });

      const data = (await response.json()) as ProxyResponseData;
      addItem({
        endpointURL: `${newPath}${query}`,
        requestBody: data.requestBody,
        responseBody: data.responseBody,
        requestHeaders: data.requestHeaders,
        status: data.status,
        statusText: data.statusText,
        requestMethod: data.requestMethod,
        requestSize: data.requestSize,
        responseSize: data.responseSize,
        responseHeaders: data.responseHeaders,
        responseTime: data.responseTime,
        timestamp: data.timestamp,
      });
      setResponse(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);

      window.history.replaceState(null, '', fullPath);
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

  const request = useMemo(() => {
    const reg: RequestDefinition = {
      url: replaceWithVariables(url),
      method: 'POST',
      header: headers.map((header) => {
        return {
          key: header.key,
          value: replaceWithVariables(header.value),
        };
      }),
      body: body
        ? {
            mode: 'raw',
            raw: replaceWithVariables(body),
          }
        : undefined,
    };
    return new PostmanRequest(reg);
  }, [url, headers, body, bodyMode, variableMap]);
  const t = useTranslations('Client');

  return (
    <div className="max-w-6xl mx-auto min-h-[300px] p-4 rounded-lg bg-gray-900">
      <div className="rounded-lg border border-gray-800">
        <div className="flex p-1 gap-1 items-stretch">
          <MethodDropdown
            selected={selectedMethod}
            setSelected={handleMethodChange}
          />
          <div className="shrink-0 w-[1px] min-h-full bg-gray-800"></div>
          <RequestBar
            onSend={handleSend}
            url={url}
            onUrlChange={onURLChange}
            urlError={urlError}
          />
        </div>
      </div>
      <div className="flex flex-col mt-4 gap-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-lg text-gray-200">
            {t('headers')}
          </h3>
          <button
            onClick={addHeader}
            className="py-1 text-white self-start text-sm font-semibold rounded-lg bg-blue-500 hover:bg-blue-400 px-6 cursor-pointer"
          >
            {t('addHeader')}
          </button>
        </div>
        <table className="table">
          <thead className="table-header">
            <tr className="tr">
              <th className="table-cell">{t('table.key')}</th>
              <th className="table-cell">{t('table.value')}</th>
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
                    placeholder={t('table.key')}
                    className="form-input"
                  />
                </td>
                <td className="table-cell">
                  <input
                    value={header.value}
                    onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                    placeholder={t('table.value')}
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
        <h3 className="font-semibold text-lg text-gray-200 my-2">
          {t('codegen')}
        </h3>
        <CodegenSelector request={request as PostmanRequest} />
        <h3 className="font-semibold text-lg text-gray-200">{t('body')}</h3>
        <div>
          {methodHasBody(selectedMethod) ? (
            <div className="flex flex-col gap-4">
              <div className="flex gap-1 bg-gray-800 self-start p-1 rounded-xl">
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
                  {t('text')}
                </button>
              </div>
              <div
                className={`rounded-lg overflow-hidden border ${prettifyError ? 'border-red-400' : 'border-gray-700'}`}
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
                    className="flex items-center gap-2 text-gray-300 fill-gray-300 hover:text-gray-200 hover:fill-gray-200 px-4 py-1 border border-gray-800 hover:border-gray-600 rounded-lg self-start cursor-pointer transition-all"
                    onClick={prettifyBody}
                  >
                    <MagicWand />
                    {t('prettify')}
                  </button>
                  <p className="text-red-400 text-sm">
                    {prettifyError && prettifyError}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-gray-800 rounded-xl">
              <div className="text-gray-400 text-center p-8">
                {t('bodyOnlyFor')}{' '}
                <span className="text-orange-300 text-sm font-medium bg-orange-300/10 px-2 py-1 rounded-lg border border-orange-200">
                  POST
                </span>
                ,{' '}
                <span className="text-purple-300 text-sm font-medium bg-orange-300/10 px-2 py-1 rounded-lg border border-purple-200">
                  {t('methods.put')}
                </span>
                , and{' '}
                <span className="text-blue-300 text-sm font-medium bg-orange-300/10 px-2 py-1 rounded-lg border border-blue-300">
                  PATCH
                </span>{' '}
                methods
              </div>
            </div>
          )}
        </div>

        <h4 className="font-semibold text-lg text-gray-200">{t('response')}</h4>
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : response ? (
          <ProxyResponseView response={response} />
        ) : (
          <div className="border border-gray-800 rounded-xl">
            <div className="text-gray-400 text-center p-8">
              {t('emptyResponse')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { ProxyResponseData } from '@/app/api/proxy/route';
import { useState } from 'react';

type ProxyResponseContainerProps = {
  response: ProxyResponseData;
};

type ResponseView = 'body' | 'headers';

export default function ProxyResponseView({
  response,
}: ProxyResponseContainerProps) {
  const [view, setView] = useState('body');

  const handleViewChange = (responseView: ResponseView) => {
    setView(() => responseView);
  };

  return (
    <div className="p-2 border border-gray-800 rounded-xl">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-1 bg-gray-800 self-start p-1 rounded-xl">
            <button
              onClick={() => handleViewChange('body')}
              className={`button-body-mode ${view === 'body' ? 'bg-blue-500 hover:bg-blue-400' : 'hover:bg-gray-700'}`}
            >
              Body
            </button>
            <button
              onClick={() => handleViewChange('headers')}
              className={`button-body-mode ${view === 'headers' ? 'bg-blue-500 hover:bg-blue-400' : 'hover:bg-gray-700'}`}
            >
              Headers
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`font-mono font-semibold text-sm px-2 py-1 self-start rounded-lg ${
                response.status >= 200 && response.status < 300
                  ? 'bg-green-800 text-green-200'
                  : 'bg-red-800 text-red-200'
              }`}
            >
              {response.status} {response.statusText}
            </div>
            <div className="text-gray-600">|</div>
            <div className="text-sm text-gray-400">
              {response.responseTime} ms
            </div>
            <div className="text-gray-600">|</div>
            <div className="text-sm text-gray-400">
              {response.responseSize} bytes
            </div>
          </div>
        </div>
        {view === 'body' ? (
          <pre className="text-sm bg-gray-800 p-2 rounded-lg overflow-auto max-h-128 whitespace-pre-wrap break-all">
            {typeof response.responseBody === 'object'
              ? JSON.stringify(response.responseBody, null, 2)
              : response.responseBody}
          </pre>
        ) : (
          <pre className="text-sm bg-gray-800 p-2 rounded-lg overflow-auto max-h-128 whitespace-pre-wrap break-all">
            {JSON.stringify(response.responseHeaders, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

'use client';
import { ProxyResponseData } from '@/app/api/proxy/route';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link, useRouter } from '@/i18n/navigation';

const getStatusColor = (status: number) => {
  if (status >= 500) return 'text-red-400';
  if (status >= 400) return 'text-orange-400';
  if (status >= 300) return 'text-blue-400';
  if (status >= 200) return 'text-green-400';
  return 'text-gray-400';
};

export default function HistoryPage() {
  const [requestHistory, setRequestHistory] = useLocalStorage<
    ProxyResponseData[]
  >('requestHistory', []);
  const router = useRouter();

  const handleGoToRequest = (item: ProxyResponseData) => {
    const { endpointURL } = item;
    router.push(endpointURL);
  };

  const handleClearHistory = () => {
    setRequestHistory([]);
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[300px] p-4 rounded-lg bg-gray-900 text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">History</h1>
        {requestHistory.length > 0 && (
          <button
            onClick={() => handleClearHistory()}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-400 transition-all cursor-pointer "
          >
            Clear History
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {requestHistory.length > 0 ? (
          requestHistory
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`text-sm font-bold w-16 text-center method-${item.requestMethod.toLowerCase()}`}
                    >
                      {item.requestMethod}
                    </span>
                    <span className="font-mono text-gray-300 truncate">
                      {item.endpointURL}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`font-semibold ${getStatusColor(item.status)}`}
                    >
                      {item.status} {item.statusText}
                    </span>
                    <button
                      onClick={() => handleGoToRequest(item)}
                      className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-400 cursor-pointer"
                    >
                      Go to request
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Timestamp: </span>
                    <span className="font-medium">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration: </span>
                    <span className="font-medium">
                      {item.responseTime.toFixed(2)} ms
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Request Size: </span>
                    <span className="font-medium">
                      {item.requestSize} bytes
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Response Size: </span>
                    <span className="font-medium">
                      {item.responseSize} bytes
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-700 text-sm">
                  <details>
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-200 transition-colors">
                      Show Response Body
                    </summary>
                    <pre
                      className={`${item.status >= 400 ? 'text-red-400' : ''} text-xs font-mono bg-gray-900 p-2 rounded-lg mt-2 whitespace-pre-wrap break-all`}
                    >
                      {item.responseBody}
                    </pre>
                  </details>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center text-gray-500 py-16">
            Your request history is empty.{' '}
            <Link className="text-blue-400" href={'/client'}>
              Go to Client
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { FormEventHandler } from 'react';
import { PaperPlaneRight } from '../Icon/Icon';

type RequestBarProps = {
  url: string;
  onUrlChange: (url: string) => void;
  onSend: FormEventHandler<HTMLFormElement>;
  urlError: string | null;
};

export default function RequestBar({
  url,
  onUrlChange,
  onSend,
  urlError,
}: RequestBarProps) {
  return (
    <form onSubmit={onSend} className="flex grow gap-1">
      <input
        type="text"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        className={`px-4 grow focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg text-gray-200 ${urlError ? 'text-red-300' : ''}`}
        placeholder="Enter request URL..."
      />
      <button
        type="submit"
        className="flex gap-2 items-center font-semibold rounded-lg bg-blue-500 hover:bg-blue-400 px-4 cursor-pointer"
      >
        Send
        <span className="fill-gray-200">
          <PaperPlaneRight size={14} />
        </span>
      </button>
    </form>
  );
}

type FormErrorProps = {
  message?: string;
};

export default function ErrorForm({ message }: FormErrorProps) {
  if (!message) {
    return <div className="min-h-[1.5rem]" />;
  }
  return (
    <div className="text-red-600 text-xs overflow-y-auto">
      <p className="leading-snug max-w-xs break-words">{message}</p>
    </div>
  );
}

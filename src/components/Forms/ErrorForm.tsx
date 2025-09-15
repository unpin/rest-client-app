type FormErrorProps = {
  message?: string;
};

export default function ErrorForm({ message }: FormErrorProps) {
  if (!message) {
    return <div className="min-h-[1.5rem]" />;
  }
  return (
    <div className="text-red-600 text-xs min-h-[1.5rem] max-h-[2rem] overflow-y-auto">
      <p className="leading-snug">{message}</p>
    </div>
  );
}

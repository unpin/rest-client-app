type FormErrorProps = {
  message?: string;
};

export default function ErrorForm({ message }: FormErrorProps) {
  return (
    <div data-testid="error-form-container" className="min-h-[1.5rem]">
      {message && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
}

import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import type { ZodFormattedError } from 'zod';
import { RegisterScheme } from '@/Scheme/AuthFormScheme';

type FormErrorProps = {
  dataError?: ZodFormattedError<RegisterScheme>;
  field: keyof RegisterScheme;
  rhfErrors?:
    | string
    | string[]
    | FieldError
    | Merge<FieldError, FieldErrorsImpl>;
};

export default function ErrorForm({
  dataError,
  field,
  rhfErrors,
}: FormErrorProps) {
  let error: string[] = [];

  if (rhfErrors) {
    if (typeof rhfErrors === 'string') {
      error = [rhfErrors];
    } else if (Array.isArray(rhfErrors)) {
      error = rhfErrors;
    } else if (
      typeof rhfErrors === 'object' &&
      'message' in rhfErrors &&
      typeof rhfErrors.message === 'string'
    ) {
      error = [rhfErrors.message];
    }
  } else if (dataError && field in dataError) {
    const fieldError = dataError[field]?._errors;
    if (fieldError?.length) {
      error = fieldError;
    }
  }

  return (
    <div
      className="text-danger"
      style={{
        fontSize: '0.54rem',
        minHeight: '1.5rem',
        maxHeight: '2rem',
        overflowY: 'auto',
      }}
    >
      {error.map((err, i) => (
        <p key={i} className="mb-0">
          {err}
        </p>
      ))}
    </div>
  );
}

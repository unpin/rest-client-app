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
    <div className="text-red-600 text-xs min-h-[1.5rem] max-h-[2rem] overflow-y-auto">
      {error.map((err, i) => (
        <p key={i} className="leading-snug">
          {err}
        </p>
      ))}
    </div>
  );
}

import { type ReactNode, type ReactElement, cloneElement, useId } from 'react';
import './FormField.css';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactElement<{ id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }>;
}

export function FormField({ label, error, children }: FormFieldProps): ReactNode {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const field = cloneElement(children, {
    id: inputId,
    'aria-invalid': !!error,
    'aria-describedby': error ? errorId : undefined,
  });

  return (
    <div className="form-field">
      <label htmlFor={inputId} className="form-field__label">
        {label}
      </label>
      {field}
      {error ? (
        <p id={errorId} className="form-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
import { type InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={`input ${hasError ? 'input--error' : ''} ${className ?? ''}`}
        aria-invalid={hasError}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';
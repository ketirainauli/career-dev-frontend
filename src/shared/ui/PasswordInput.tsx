import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Input } from './Input';
import './PasswordInput.css';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  hasError?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ hasError = false, className, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="password-input">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          hasError={hasError}
          className={`password-input__field ${className ?? ''}`}
          {...rest}
        />
        <button
          type="button"
          className="password-input__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
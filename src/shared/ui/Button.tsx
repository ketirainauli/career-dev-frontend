import { type ButtonHTMLAttributes, forwardRef } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading = false, disabled, children, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`btn btn--${variant} ${isLoading ? 'btn--loading' : ''} ${className ?? ''}`}
        disabled={disabled}
        aria-busy={isLoading}
        {...rest}
      >
        {isLoading ? <span className="btn__spinner" aria-hidden="true" /> : null}
        <span className={isLoading ? 'btn__label--hidden' : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
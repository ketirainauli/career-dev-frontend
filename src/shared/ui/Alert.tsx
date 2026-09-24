import { type ReactNode } from 'react';
import './Alert.css';

interface AlertProps {
  variant?: 'success' | 'error' | 'info';
  children: ReactNode;
}

export function Alert({ variant = 'info', children }: AlertProps) {
  return (
    <div className={`alert alert--${variant}`} role="status">
      {children}
    </div>
  );
}
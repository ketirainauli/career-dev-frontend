import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function SearchBox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (inputValue) {
        next.set('q', inputValue);
      } else {
        next.delete('q');
      }
      next.delete('page');
      setSearchParams(next, { replace: true });
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <input
      type="text"
      placeholder="ძებნა..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
}
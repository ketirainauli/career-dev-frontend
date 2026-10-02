import { useSearchParams } from 'react-router-dom';

export function QuickToggles() {
  const [searchParams, setSearchParams] = useSearchParams();

  const toggle = (key: string) => {
    const next = new URLSearchParams(searchParams);
    if (next.get(key) === 'true') {
      next.delete(key);
    } else {
      next.set(key, 'true');
    }
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="quick-toggles">
      <label>
        <input
          type="checkbox"
          checked={searchParams.get('onSale') === 'true'}
          onChange={() => toggle('onSale')}
        />
        ფასდაკლებული
      </label>
      <label>
        <input
          type="checkbox"
          checked={searchParams.get('inStock') === 'true'}
          onChange={() => toggle('inStock')}
        />
        მხოლოდ მარაგში
      </label>
    </div>
  );
}
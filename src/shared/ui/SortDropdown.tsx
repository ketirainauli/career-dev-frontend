import { useSearchParams } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: 'newest', label: 'უახლესი' },
  { value: 'oldest', label: 'უძველესი' },
  { value: 'price-asc', label: 'ფასი: კლებადობით' },
  { value: 'price-desc', label: 'ფასი: ზრდადობით' },
  { value: 'rating-desc', label: 'რეიტინგით' },
  { value: 'popular', label: 'პოპულარობით' },
  { value: 'title-asc', label: 'სახელით (ა-ჰ)' },
];

export function SortDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get('sort') ?? 'newest';

  const handleChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', value);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <select value={currentSort} onChange={(e) => handleChange(e.target.value)}>
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
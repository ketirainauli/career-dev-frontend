import type { CategoryFilter } from '../../api/catalog';

interface RadioFilterProps {
  filter: CategoryFilter;
  selectedValue: string | null;
  onChange: (value: string | null) => void;
}

export function RadioFilter({ filter, selectedValue, onChange }: RadioFilterProps) {
  return (
    <fieldset className="filter-group">
      <legend className="filter-group__label">{filter.label}</legend>
      {filter.options?.map((option) => (
        <label key={option.value} className="filter-option">
          <input
            type="radio"
            name={filter.key}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
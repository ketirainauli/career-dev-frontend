import type { CategoryFilter } from '../../api/catalog';

interface CheckboxFilterProps {
  filter: CategoryFilter;
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function CheckboxFilter({ filter, selectedValues, onChange }: CheckboxFilterProps) {
  const toggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__label">{filter.label}</legend>
      {filter.options?.map((option) => (
        <label key={option.value} className="filter-option">
          <input
            type="checkbox"
            checked={selectedValues.includes(option.value)}
            onChange={() => toggle(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
import type { CategoryFilter } from '../../api/catalog';

interface ColorFilterProps {
  filter: CategoryFilter;
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function ColorFilter({ filter, selectedValues, onChange }: ColorFilterProps) {
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
      <div className="color-swatches">
        {filter.options?.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`color-swatch ${selectedValues.includes(option.value) ? 'color-swatch--selected' : ''}`}
            style={{ backgroundColor: option.value }}
            title={option.label}
            aria-label={option.label}
            onClick={() => toggle(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}
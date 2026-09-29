import { useState, useEffect } from 'react';
import type { CategoryFilter } from '../../api/catalog';

interface RangeFilterProps {
  filter: CategoryFilter;
  selectedMin: number | null;
  selectedMax: number | null;
  onChange: (min: number | null, max: number | null) => void;
}

export function RangeFilter({ filter, selectedMin, selectedMax, onChange }: RangeFilterProps) {
  const min = filter.min ?? 0;
  const max = filter.max ?? 100;

  const [localMin, setLocalMin] = useState(selectedMin ?? min);
  const [localMax, setLocalMax] = useState(selectedMax ?? max);

  useEffect(() => {
    setLocalMin(selectedMin ?? min);
    setLocalMax(selectedMax ?? max);
  }, [selectedMin, selectedMax, min, max]);

  const commit = () => {
    onChange(localMin === min ? null : localMin, localMax === max ? null : localMax);
  };

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__label">{filter.label}</legend>
      <div className="range-filter">
        <input
          type="number"
          value={localMin}
          min={min}
          max={max}
          onChange={(e) => setLocalMin(Number(e.target.value))}
          onBlur={commit}
        />
        <span>–</span>
        <input
          type="number"
          value={localMax}
          min={min}
          max={max}
          onChange={(e) => setLocalMax(Number(e.target.value))}
          onBlur={commit}
        />
        <span>{filter.unit}</span>
      </div>
    </fieldset>
  );
}
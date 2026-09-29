import { useSearchParams } from 'react-router-dom';
import type { Category } from '../../api/catalog';
import { CheckboxFilter } from './CheckboxFilter';
import { RadioFilter } from './RadioFilter';
import { ColorFilter } from './ColorFilter';
import { RangeFilter } from './RangeFilter';
import './FilterPanel.css';

interface FilterPanelProps {
  category: Category;
}

export function FilterPanel({ category }: FilterPanelProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete('page'); // any filter change resets pagination to page 1
    setSearchParams(next);
  };

  return (
    <div className="filter-panel">
      {category.filters.map((filter) => {
        if (filter.type === 'checkbox') {
          const selectedValues = searchParams.get(filter.key)?.split(',').filter(Boolean) ?? [];
          return (
            <CheckboxFilter
              key={filter.key}
              filter={filter}
              selectedValues={selectedValues}
              onChange={(values) => updateParam(filter.key, values.length ? values.join(',') : null)}
            />
          );
        }

        if (filter.type === 'radio') {
          const selectedValue = searchParams.get(filter.key);
          return (
            <RadioFilter
              key={filter.key}
              filter={filter}
              selectedValue={selectedValue}
              onChange={(value) => updateParam(filter.key, value)}
            />
          );
        }

        if (filter.type === 'color') {
          const selectedValues = searchParams.get(filter.key)?.split(',').filter(Boolean) ?? [];
          return (
            <ColorFilter
              key={filter.key}
              filter={filter}
              selectedValues={selectedValues}
              onChange={(values) => updateParam(filter.key, values.length ? values.join(',') : null)}
            />
          );
        }

        if (filter.type === 'range') {
          const minKey = `min${filter.key.charAt(0).toUpperCase()}${filter.key.slice(1)}`;
          const maxKey = `max${filter.key.charAt(0).toUpperCase()}${filter.key.slice(1)}`;
          const selectedMin = searchParams.get(minKey) ? Number(searchParams.get(minKey)) : null;
          const selectedMax = searchParams.get(maxKey) ? Number(searchParams.get(maxKey)) : null;
          return (
            <RangeFilter
              key={filter.key}
              filter={filter}
              selectedMin={selectedMin}
              selectedMax={selectedMax}
              onChange={(min, max) => {
                const next = new URLSearchParams(searchParams);
                if (min !== null) next.set(minKey, String(min)); else next.delete(minKey);
                if (max !== null) next.set(maxKey, String(max)); else next.delete(maxKey);
                next.delete('page');
                setSearchParams(next);
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
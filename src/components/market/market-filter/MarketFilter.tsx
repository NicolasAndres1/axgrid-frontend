import type { EnergySourceType, EnergyOfferStatus } from '../../../types';
import type { MarketFilters } from '../../../types';
import { ENERGY_OFFER_STATUSES, ENERGY_SOURCE_TYPES } from '../../../types';
import styles from './MarketFilter.module.css';

const SOURCE_TYPES: (EnergySourceType | 'all')[] = [
  'all',
  ...Object.values(ENERGY_SOURCE_TYPES),
];

const OFFER_STATUSES: (EnergyOfferStatus | 'all')[] = [
  'all',
  ...Object.values(ENERGY_OFFER_STATUSES),
];

interface FilterFieldProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

interface MarketFiltersProps {
  filters: MarketFilters;
  onFilterChange: (
    filterType: keyof MarketFilters,
    value: EnergySourceType | EnergyOfferStatus | 'all',
  ) => void;
}

export const MarketFilter = ({
  filters,
  onFilterChange,
}: MarketFiltersProps) => {
  return (
    <div className={styles.container}>
      <FilterField
        id="sourceFilter"
        label="Filter by Source:"
        value={filters.source}
        options={SOURCE_TYPES.map((source) => ({
          value: source,
          label: source,
        }))}
        onChange={(value) =>
          onFilterChange('source', value as EnergySourceType | 'all')
        }
      />

      <FilterField
        id="statusFilter"
        label="Filter by Status:"
        value={filters.status}
        options={OFFER_STATUSES.map((status) => ({
          value: status,
          label: status,
        }))}
        onChange={(value) =>
          onFilterChange('status', value as EnergyOfferStatus | 'all')
        }
      />
    </div>
  );
};

const FilterField = ({
  id,
  label,
  value,
  options,
  onChange,
}: FilterFieldProps) => (
  <div className={styles.filterGroup}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.select}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

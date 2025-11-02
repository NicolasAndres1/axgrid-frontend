import {
  type EnergySourceType,
  type EnergyOfferStatus,
  type MarketFilters,
  FILTER_SOURCE_TYPES,
  FILTER_OFFER_STATUSES,
} from '../../../types';
import styles from './MarketFilter.module.css';

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
    value: EnergySourceType | EnergyOfferStatus,
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
        options={FILTER_SOURCE_TYPES.map((source) => ({
          value: source,
          label: source,
        }))}
        onChange={(value) =>
          onFilterChange('source', value as EnergySourceType)
        }
      />

      <FilterField
        id="statusFilter"
        label="Filter by Status:"
        value={filters.status}
        options={FILTER_OFFER_STATUSES.map((status) => ({
          value: status,
          label: status,
        }))}
        onChange={(value) =>
          onFilterChange('status', value as EnergyOfferStatus)
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

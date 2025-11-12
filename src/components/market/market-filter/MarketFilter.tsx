import { memo } from 'react';
import {
  type EnergySourceType,
  type EnergyOfferStatus,
  type MarketFilters,
  FILTER_SOURCE_TYPES,
  FILTER_OFFER_STATUSES,
} from '../../../types';
import { FilterField } from '../filter-field/FilterField';
import styles from './MarketFilter.module.css';
interface MarketFiltersProps {
  filters: MarketFilters;
  onFilterChange: (
    filterType: keyof MarketFilters,
    value: EnergySourceType | EnergyOfferStatus,
  ) => void;
}

const MarketFiltersComponent = ({
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

export const MarketFilter = memo(MarketFiltersComponent);

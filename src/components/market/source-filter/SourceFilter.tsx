import type { EnergySourceType } from '../../../types/energyOffers.types';

export const SourceFilter = ({
  sourceFilter,
  setSourceFilter,
}: {
  sourceFilter: EnergySourceType | 'all';
  setSourceFilter: (sourceFilter: EnergySourceType | 'all') => void;
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label htmlFor="sourceFilter" style={{ marginRight: '8px' }}>
        Filter by Source:
      </label>
      <select
        id="sourceFilter"
        value={sourceFilter}
        onChange={(e) =>
          setSourceFilter(e.target.value as EnergySourceType | 'all')
        }
      >
        <option value="all">All</option>
        <option value="solar">Solar</option>
        <option value="gas">Gas</option>
      </select>
    </div>
  );
};

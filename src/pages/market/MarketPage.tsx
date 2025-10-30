import { useState } from 'react';
import { useMarketStore } from '../../store/marketStore';
import {
  ENERGY_OFFER_STATUSES,
  type EnergyOffer,
  type EnergyOfferStatus,
  type EnergySourceType,
  type MarketFilters,
} from '../../types';
import { useFilteredOffers } from '../../hooks/useFilteredOffers';
import styles from './MarketPage.module.css';
import { MarketRow } from '../../components/market/table-row/TableRow';
import { MarketFilter } from '../../components/market/market-filter/MarketFilter';
import { OfferDetailsModal } from '../../components/market/offer-details-modal/OfferDetailsModal';

export const MarketPage = () => {
  const [filters, setFilters] = useState<MarketFilters>({
    source: 'all',
    status: 'all',
  });

  const allOffers = useMarketStore((state) => state.offers);
  const setOfferStatus = useMarketStore((state) => state.setOfferStatus);
  const filteredOffers = useFilteredOffers(allOffers, filters);
  const [selectedOffer, setSelectedOffer] = useState<EnergyOffer | null>(null);

  const handleFilterChange = (
    filterType: keyof MarketFilters,
    value: EnergySourceType | EnergyOfferStatus | 'all',
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const handleTrade = (id: string) => {
    setOfferStatus(id, ENERGY_OFFER_STATUSES.COMPLETED);
  };

  const handleCloseDetailsModal = () => {
    setSelectedOffer(null);
  };

  return (
    <div>
      <h1 className={styles.title}>Energy Market</h1> // TODO: Extract title to
      a component
      <div className={styles.container}>
        // TODO: Consider extracting container to a component
        <p>
          {filteredOffers.length} of {allOffers.length} offers showing
        </p>
        <MarketFilter filters={filters} onFilterChange={handleFilterChange} />
        <hr className={styles.divider} />
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHead}>
              <th className={styles.tableHeader}>Source</th>
              <th className={styles.tableHeader}>Vendor</th>
              <th className={styles.tableHeader}>Price (€/MWh)</th>
              <th className={styles.tableHeader}>Quantity (MWh)</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.map((offer: EnergyOffer) => (
              <MarketRow
                key={offer.id}
                offer={offer}
                onTrade={() => handleTrade(offer.id)}
                onDetails={setSelectedOffer}
              />
            ))}
          </tbody>
        </table>
        {selectedOffer && (
          <OfferDetailsModal
            offer={selectedOffer}
            onClose={handleCloseDetailsModal}
          />
        )}
      </div>
    </div>
  );
};

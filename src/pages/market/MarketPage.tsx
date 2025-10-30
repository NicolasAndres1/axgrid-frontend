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

  const handleDetails = (offer: EnergyOffer) => {
    setSelectedOffer(offer);
    console.log('Selected Offer for Details:', offer);
  };

  const handleCloseDetailsModal = () => {
    setSelectedOffer(null);
  };

  return (
    <div>
      <h1 className={styles.title}>Energy Market</h1>

      <hr className={styles.divider} />

      <div className={styles.container}>
        <p>
          {filteredOffers.length} of {allOffers.length} offers showing
        </p>

        <MarketFilter filters={filters} onFilterChange={handleFilterChange} />

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
                onDetails={handleDetails}
              />
            ))}
          </tbody>
        </table>

        {selectedOffer && (
          <div
            className={styles.detailsModalOverlay}
            onClick={handleCloseDetailsModal}
          >
            <div className={styles.detailsModal}>
              <h2>{selectedOffer.vendor}'s Offer</h2>
              <pre>{JSON.stringify(selectedOffer, null, 2)}</pre>
              <button onClick={handleCloseDetailsModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

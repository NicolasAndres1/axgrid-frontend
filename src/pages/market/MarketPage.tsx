import { useState } from 'react';
import { useMarketStore } from '../../store/marketStore';
import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../../types';
import { useFilteredOffers } from '../../hooks/useFilteredOffers';
import styles from './MarketPage.module.css';
import { MarketRow } from '../../components/market/table-row/TableRow';
import { MarketFilter } from '../../components/market/market-filter/MarketFilter';
import { OfferDetailsModal } from '../../components/market/offer-details-modal/OfferDetailsModal';
import { useMarketFilters } from '../../hooks/useMarketFilters';

export const MarketPage = () => {
  const { filters, handleFilterChange } = useMarketFilters();
  const [selectedOffer, setSelectedOffer] = useState<EnergyOffer | null>(null);
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);
  const allOffers = useMarketStore((state) => state.offers);
  const setOfferStatus = useMarketStore((state) => state.setOfferStatus);
  const filteredOffers = useFilteredOffers(allOffers, filters, justCompletedId);

  const handleTrade = (id: string) => {
    setOfferStatus(id, ENERGY_OFFER_STATUSES.COMPLETED);

    // We keep the status of the row that was just completed to handle the animation
    setJustCompletedId(id);
    setTimeout(() => setJustCompletedId(null), 1200);
  };
  const handleCloseDetailsModal = () => setSelectedOffer(null);

  return (
    <div>
      <h1 className={styles.title}>Energy Market</h1>{' '}
      {/* TODO: Extract title to a component */}
      <div className={styles.container}>
        {/* TODO: Consider extracting container to a component */}
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
            handleTrade={() => handleTrade(selectedOffer.id)}
          />
        )}
      </div>
    </div>
  );
};

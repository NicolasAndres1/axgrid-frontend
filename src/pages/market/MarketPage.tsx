import { useMarketStore } from '../../store/marketStore';
import { type EnergyOffer } from '../../types/energyOffers.types';
import styles from './MarketPage.module.css';

export const MarketPage = () => {
  const offers = useMarketStore((state) => state.offers);
  const setOfferStatus = useMarketStore((state) => state.setOfferStatus);

  const handleTrade = (id: string) => {
    setOfferStatus(id, 'completed');
  };

  return (
    <div>
      <h1 className={styles.title}>Energy Market</h1>

      <hr className={styles.divider} />

      <div className={styles.container}>
        <p className={styles.offersCount}>{offers.length} offers available</p>

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
            {offers.map((offer: EnergyOffer) => (
              <tr key={offer.id}>
                <td className={styles.tableCell}>{offer.sourceType}</td>
                <td className={styles.tableCell}>{offer.vendor}</td>
                <td className={styles.tableCell}>{offer.price.toFixed(2)}</td>
                <td className={styles.tableCell}>{offer.quantity}</td>
                <td className={styles.tableCell}>{offer.status}</td>
                <td className={styles.tableCellCentered}>
                  <button
                    className={styles.tradeButton}
                    onClick={() => handleTrade(offer.id)}
                    disabled={offer.status === 'completed'}
                  >
                    Trade
                  </button>
                  {/* Aquí podríamos añadir un botón de "Details" */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

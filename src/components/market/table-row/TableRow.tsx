import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../../../types';
import styles from './TableRow.module.css';
import { useRowFlash } from '../../../hooks/useRowFlashing';

interface MarketRowProps {
  offer: EnergyOffer;
  onTrade: (id: string) => void;
  onDetails: (offer: EnergyOffer) => void;
}

export const MarketRow = ({ offer, onTrade, onDetails }: MarketRowProps) => {
  const flashClass = useRowFlash(offer);
  const rowFlashClass = flashClass ? styles[flashClass] : '';

  return (
    <tr className={rowFlashClass}>
      <td className={styles.tableCell}>{offer.sourceType}</td>
      <td className={styles.tableCell}>{offer.vendor}</td>
      <td className={styles.tableCell}>{offer.price.toFixed(2)}</td>
      <td className={styles.tableCell}>{offer.quantity}</td>
      <td className={styles.tableCell}>{offer.status}</td>
      <td className={styles.tableCellCentered}>
        <button
          className={styles.detailsButton}
          onClick={() => onDetails(offer)}
        >
          Details
        </button>
        <button
          className={styles.tradeButton}
          onClick={() => onTrade(offer.id)}
          disabled={offer.status === ENERGY_OFFER_STATUSES.COMPLETED}
        >
          Trade
        </button>
      </td>
    </tr>
  );
};

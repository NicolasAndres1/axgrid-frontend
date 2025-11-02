import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../../../types';
import styles from './TableRow.module.css';
import { useRowFlash } from '../../../hooks/useRowFlashing';
import { Button } from '../../common';

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
        <Button type="secondary" onClick={() => onDetails(offer)}>
          Details
        </Button>
        <Button
          type="primary"
          onClick={() => onTrade(offer.id)}
          disabled={offer.status === ENERGY_OFFER_STATUSES.COMPLETED}
        >
          Trade
        </Button>
      </td>
    </tr>
  );
};

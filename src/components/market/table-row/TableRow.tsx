import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../../../types';
import { useRowFlash } from '../../../hooks';
import { Button } from '../../common';
import styles from './TableRow.module.css';

interface TableRowProps {
  offer: EnergyOffer;
  onTrade: (id: string) => void;
  onDetails: (offer: EnergyOffer) => void;
}

export const TableRow = ({ offer, onTrade, onDetails }: TableRowProps) => {
  const flashClass = useRowFlash(offer);
  const rowFlashClass = flashClass ? styles[flashClass] : '';

  return (
    <tr className={rowFlashClass} data-testid={offer.id}>
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

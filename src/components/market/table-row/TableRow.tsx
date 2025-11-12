import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../../../types';
import { useRowFlash } from '../../../hooks';
import { Button } from '../../common';
import styles from './TableRow.module.css';
import { memo } from 'react';

interface TableRowProps {
  offer: EnergyOffer;
  onTrade: (id: string) => void;
  onDetails: (offer: EnergyOffer) => void;
}

const TableRowComponent = ({ offer, onTrade, onDetails }: TableRowProps) => {
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

// Custom comparison function to prevent unnecessary re-renders
const areEqual = (
  prevProps: TableRowProps,
  nextProps: TableRowProps,
): boolean => {
  // Compare offer by its properties
  const prevOffer = prevProps.offer;
  const nextOffer = nextProps.offer;

  const offerEqual =
    prevOffer.id === nextOffer.id &&
    prevOffer.sourceType === nextOffer.sourceType &&
    prevOffer.vendor === nextOffer.vendor &&
    prevOffer.price === nextOffer.price &&
    prevOffer.quantity === nextOffer.quantity &&
    prevOffer.status === nextOffer.status &&
    prevOffer.unit === nextOffer.unit &&
    prevOffer.location === nextOffer.location &&
    prevOffer.createdAt === nextOffer.createdAt &&
    prevOffer.updatedAt === nextOffer.updatedAt;

  const handlersEqual =
    prevProps.onTrade === nextProps.onTrade &&
    prevProps.onDetails === nextProps.onDetails;

  return offerEqual && handlersEqual;
};

export const TableRow = memo(TableRowComponent, areEqual);

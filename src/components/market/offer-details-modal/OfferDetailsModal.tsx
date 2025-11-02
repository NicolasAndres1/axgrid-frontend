import React from 'react';
import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../../../types';
import styles from './OfferDetailsModal.module.css';
import { Button } from '../../common';

interface OfferDetailsModalProps {
  offer: EnergyOffer;
  onClose: () => void;
  handleTrade: () => void;
}

export const OfferDetailsModal = ({
  offer,
  onClose,
  handleTrade,
}: OfferDetailsModalProps) => {
  const onContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={onContentClick}>
        <div className={styles.modalHeader}>
          <h2>
            {offer.vendor}'s Offer ({offer.sourceType})
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <p>
            <strong>Price: </strong> {offer.price.toFixed(2)} €/{offer.unit}
          </p>
          <p>
            <strong>Quantity: </strong> {offer.quantity} {offer.unit}
          </p>
          <p>
            <strong>Status: </strong>
            <span className={styles[offer.status]}>{offer.status}</span>
          </p>
          <hr />
          <p>
            <strong>Location: </strong> {offer.location}
          </p>
          <p>
            <strong>Offer ID: </strong>
            <code className={styles.code}>{offer.id}</code>
          </p>
          <p>
            <strong>Created: </strong>
            {new Date(offer.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Last Update: </strong>
            {new Date(offer.updatedAt).toLocaleString()}
          </p>
        </div>

        {offer.status !== ENERGY_OFFER_STATUSES.COMPLETED && (
          <>
            <hr />
            <div className={styles.modalFooter}>
              <Button
                type="primary"
                onClick={() => {
                  handleTrade();
                  onClose();
                }}
              >
                Trade
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

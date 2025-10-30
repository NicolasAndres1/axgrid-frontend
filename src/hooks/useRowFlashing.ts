import { useState, useEffect, useRef } from 'react';
import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../types';

const usePrevious = <T>(value: T) => {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const FlashClass = {
  CREATE: 'flashCreate',
  UPDATE: 'flashUpdate',
  COMPLETED: 'flashCompleted',
} as const;

export const useRowFlash = (offer: EnergyOffer) => {
  const [flashClass, setFlashClass] = useState('');

  const prevUpdatedAt = usePrevious(offer.updatedAt);
  const prevStatus = usePrevious(offer.status);

  useEffect(() => {
    let timer: number;

    const now = Date.now();
    const isNew = now - offer.createdAt < 2000;

    if (isNew && prevUpdatedAt === undefined) {
      setFlashClass(FlashClass.CREATE);
      timer = setTimeout(() => setFlashClass(''), 1000);
      return () => clearTimeout(timer);
    }

    const hasUpdated =
      prevUpdatedAt !== undefined && offer.updatedAt !== prevUpdatedAt;

    if (hasUpdated) {
      const justCompleted =
        prevStatus !== ENERGY_OFFER_STATUSES.COMPLETED &&
        offer.status === ENERGY_OFFER_STATUSES.COMPLETED;

      if (justCompleted) {
        setFlashClass(FlashClass.COMPLETED);
      } else {
        setFlashClass(FlashClass.UPDATE);
      }

      timer = setTimeout(() => setFlashClass(''), 1000);
    }

    return () => clearTimeout(timer);
  }, [
    offer.createdAt,
    offer.updatedAt,
    offer.status,
    prevUpdatedAt,
    prevStatus,
  ]);

  return flashClass;
};

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
  const [flashClass, setFlashClass] = useState<string | null>(null);

  const prevUpdatedAt = usePrevious(offer.updatedAt);
  const prevStatus = usePrevious(offer.status);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const activateFlash = (flashType: string) => {
      setFlashClass(flashType);
      timer = setTimeout(() => setFlashClass(null), 1000);
    };

    // Case: New offer
    // We detect if it is new if: no has prevUpdatedAt (first render)
    // And the offer was created less than 5 seconds ago (to avoid flashes on initial load)
    const isFirstRender = prevUpdatedAt === undefined;
    const isRecentlyCreated = Date.now() - offer.createdAt < 5000;

    if (isFirstRender && isRecentlyCreated) {
      activateFlash(FlashClass.CREATE);
      return () => {
        if (timer) clearTimeout(timer);
      };
    }

    // Case: Updated offer
    // If there is a previous value and the updatedAt changed
    const wasUpdated =
      prevUpdatedAt !== undefined && offer.updatedAt !== prevUpdatedAt;

    if (wasUpdated) {
      const justCompleted =
        prevStatus !== ENERGY_OFFER_STATUSES.COMPLETED &&
        offer.status === ENERGY_OFFER_STATUSES.COMPLETED;

      const flashType = justCompleted
        ? FlashClass.COMPLETED
        : FlashClass.UPDATE;

      activateFlash(flashType);
    }

    // Cleanup: cancel the timer if the effect is re-executed or unmounted
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    offer.createdAt,
    offer.updatedAt,
    offer.status,
    prevUpdatedAt,
    prevStatus,
  ]);

  return flashClass;
};

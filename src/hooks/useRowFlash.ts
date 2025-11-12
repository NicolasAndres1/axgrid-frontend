import { useState, useEffect, useRef } from 'react';
import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../types';
import { useMarketStore } from '../store';

// A helper hook to get the previous value of a prop or state.
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
  const initialLoadTimestamp = useMarketStore(
    (state) => state.initialLoadTimestamp,
  );

  const prevUpdatedAt = usePrevious(offer.updatedAt);
  const prevStatus = usePrevious(offer.status);

  // Create flash logic
  useEffect(() => {
    // Only show flash if the offer was created after the initial load.
    // This prevents old, loaded offers from flashing on initial page load.
    const isRecentlyCreated =
      initialLoadTimestamp !== null && offer.createdAt > initialLoadTimestamp;

    if (isRecentlyCreated) {
      setFlashClass(FlashClass.CREATE);
      const timer = setTimeout(() => setFlashClass(null), 1000);

      // We only need a cleanup for this specific timer
      return () => clearTimeout(timer);
    }
  }, [offer.createdAt, initialLoadTimestamp]);

  // Update flash logic
  useEffect(() => {
    // Skip the first render
    if (prevUpdatedAt === undefined) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    // Check for "Completed"
    // We check this first, as it's the most specific UI feedback.
    const justCompleted =
      prevStatus !== ENERGY_OFFER_STATUSES.COMPLETED &&
      offer.status === ENERGY_OFFER_STATUSES.COMPLETED;

    if (justCompleted) {
      setFlashClass(FlashClass.COMPLETED);

      timer = setTimeout(() => setFlashClass(null), 1000);
    } else if (offer.updatedAt !== prevUpdatedAt) {
      // Check for "Updated"
      // Only if 'updatedAt' changed and it wasn't a 'completed' event.
      setFlashClass(FlashClass.UPDATE);

      timer = setTimeout(() => setFlashClass(null), 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [offer.updatedAt, offer.status, prevUpdatedAt, prevStatus]);

  return flashClass;
};

import { useMemo } from 'react';
import {
  type EnergyOffer,
  type EnergySourceType,
} from '../types/energyOffers.types';

/**
 * Filter market offers
 * @param allOffers - Full offers list
 * @param sourceFilter - Source filter selected
 */
export const useFilteredOffers = (
  allOffers: EnergyOffer[],
  sourceFilter: EnergySourceType | 'all',
) => {
  const filteredOffers = useMemo(() => {
    if (sourceFilter === 'all') {
      return allOffers;
    }

    return allOffers.filter((offer) => offer.sourceType === sourceFilter);
  }, [allOffers, sourceFilter]);

  return filteredOffers;
};

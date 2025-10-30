import { useMemo } from 'react';
import type { EnergyOffer, MarketFilters } from '../types';

export const useFilteredOffers = (
  allOffers: EnergyOffer[],
  filters: MarketFilters,
) => {
  const filteredOffers = useMemo(() => {
    let offers = allOffers;

    // Source filter
    if (filters.source !== 'all') {
      offers = offers.filter((offer) => offer.sourceType === filters.source);
    }

    // Status filter
    if (filters.status !== 'all') {
      offers = offers.filter((offer) => offer.status === filters.status);
    }

    return offers;
  }, [allOffers, filters]);

  return filteredOffers;
};

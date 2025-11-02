import { useMemo } from 'react';
import {
  FILTER_OFFER_STATUSES,
  FILTER_SOURCE_TYPES,
  type EnergyOffer,
  type MarketFilters,
} from '../types';

export type UseFilteredOffersProps = {
  allOffers: EnergyOffer[];
  filters: MarketFilters;
  justCompletedId: string | null;
};

export const useFilteredOffers = ({
  allOffers,
  filters,
  justCompletedId,
}: UseFilteredOffersProps) => {
  const filteredOffers = useMemo(() => {
    let offers = allOffers;

    // Source filter
    if (filters.source !== FILTER_SOURCE_TYPES[0]) {
      offers = offers.filter((offer) => offer.sourceType === filters.source);
    }

    // Status filter
    if (filters.status !== FILTER_OFFER_STATUSES[0]) {
      offers = offers.filter(
        (offer) =>
          offer.status === filters.status || offer.id === justCompletedId,
      );
    }

    return offers;
  }, [allOffers, filters, justCompletedId]);

  return filteredOffers;
};

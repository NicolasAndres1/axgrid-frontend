import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FILTER_SOURCE_TYPES,
  FILTER_OFFER_STATUSES,
  type EnergySourceType,
  type EnergyOfferStatus,
} from '../types';
import { type MarketFilters } from '../types';

const getInitialFilters = (searchParams: URLSearchParams): MarketFilters => {
  const source = searchParams.get('source');
  const status = searchParams.get('status');

  const validSource = FILTER_SOURCE_TYPES.includes(source as EnergySourceType)
    ? (source as EnergySourceType)
    : FILTER_SOURCE_TYPES[0];

  const validStatus = FILTER_OFFER_STATUSES.includes(
    status as EnergyOfferStatus,
  )
    ? (status as EnergyOfferStatus)
    : FILTER_OFFER_STATUSES[0];

  return { source: validSource, status: validStatus };
};

export const useMarketFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<MarketFilters>(() =>
    getInitialFilters(searchParams),
  );

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.source !== FILTER_SOURCE_TYPES[0]) {
      params.set('source', filters.source);
    }
    if (filters.status !== FILTER_OFFER_STATUSES[0]) {
      params.set('status', filters.status);
    }

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = useCallback(
    (
      filterType: keyof MarketFilters,
      value: EnergySourceType | EnergyOfferStatus,
    ) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: value,
      }));
    },
    [],
  );

  return {
    filters,
    handleFilterChange,
  };
};

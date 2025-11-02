import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  useFilteredOffers,
  type UseFilteredOffersProps,
} from './useFilteredOffers';
import {
  ENERGY_SOURCE_TYPES,
  ENERGY_OFFER_STATUSES,
  type EnergyOffer,
  type MarketFilters,
} from '../types';

const MOCK_OFFERS: EnergyOffer[] = [
  {
    id: '1',
    sourceType: 'solar',
    status: 'active',
    price: 100,
    quantity: 50,
    unit: 'MWh',
    vendor: 'Solaria West',
    location: 'Bilbao, ES',
    createdAt: 123,
    updatedAt: 124,
  },
  {
    id: '2',
    sourceType: 'solar',
    status: 'pending',
    price: 90,
    quantity: 20,
    unit: 'MWh',
    vendor: 'SolarTech Spain',
    location: 'Madrid, ES',
    createdAt: 125,
    updatedAt: 126,
  },
  {
    id: '3',
    sourceType: 'gas',
    status: 'active',
    price: 110,
    quantity: 100,
    unit: 'MWh',
    vendor: 'GasCorp Iberia',
    location: 'Seville, ES',
    createdAt: 127,
    updatedAt: 128,
  },
  {
    id: '4',
    sourceType: 'gas',
    status: 'pending',
    price: 105,
    quantity: 30,
    unit: 'MWh',
    vendor: 'GreenGrid Spain',
    location: 'Málaga, ES',
    createdAt: 129,
    updatedAt: 130,
  },
  {
    id: '5',
    sourceType: 'solar',
    status: 'completed',
    price: 95,
    quantity: 10,
    unit: 'MWh',
    vendor: 'EcoEnergy Ltd',
    location: 'Zaragoza, ES',
    createdAt: 131,
    updatedAt: 132,
  },
];

const defaultProps: UseFilteredOffersProps = {
  allOffers: MOCK_OFFERS,
  filters: { source: 'all', status: 'all' },
  justCompletedId: null,
};

describe('useFilteredOffers Hook', () => {
  it('should return all offers when filters are "all"', () => {
    const { result } = renderHook(() => useFilteredOffers(defaultProps));

    expect(result.current.length).toBe(5);
  });

  it('should filter by source type solar', () => {
    const filters: MarketFilters = {
      source: ENERGY_SOURCE_TYPES.SOLAR,
      status: 'all',
    };

    const { result } = renderHook(() =>
      useFilteredOffers({
        ...defaultProps,
        filters,
      }),
    );

    expect(result.current.length).toBe(3);
    expect(
      result.current.every((o) => o.sourceType === ENERGY_SOURCE_TYPES.SOLAR),
    ).toBe(true);
  });

  it('should filter by status type active', () => {
    const filters: MarketFilters = {
      source: 'all',
      status: ENERGY_OFFER_STATUSES.ACTIVE,
    };

    const { result } = renderHook(() =>
      useFilteredOffers({
        allOffers: MOCK_OFFERS,
        filters,
        justCompletedId: null,
      }),
    );

    expect(result.current.length).toBe(2);
    expect(
      result.current.every((o) => o.status === ENERGY_OFFER_STATUSES.ACTIVE),
    ).toBe(true);
  });

  it('should filter by both source gas and status pending', () => {
    const filters: MarketFilters = {
      source: ENERGY_SOURCE_TYPES.GAS,
      status: ENERGY_OFFER_STATUSES.PENDING,
    };

    const { result } = renderHook(() =>
      useFilteredOffers({
        ...defaultProps,
        filters,
      }),
    );

    expect(result.current.length).toBe(1);
    expect(result.current[0].id).toBe('4');
  });

  it('should keep a row displayed if it matches justCompletedId, even if filtered out', () => {
    const filters: MarketFilters = {
      source: 'all',
      status: ENERGY_OFFER_STATUSES.ACTIVE,
    };

    const updatedOffers: EnergyOffer[] = MOCK_OFFERS.map((offer) =>
      offer.id === '1'
        ? { ...offer, status: ENERGY_OFFER_STATUSES.COMPLETED, updatedAt: 999 }
        : offer,
    );

    const { result } = renderHook(() =>
      useFilteredOffers({
        allOffers: updatedOffers,
        filters,
        justCompletedId: '1',
      }),
    );

    expect(result.current.length).toBe(2);
    expect(result.current.map((o) => o.id)).toContain('1');
    expect(result.current.map((o) => o.id)).toContain('3');
  });

  it('should remove the "zombie" row after justCompletedId is reset to null', () => {
    const filters: MarketFilters = {
      source: 'all',
      status: ENERGY_OFFER_STATUSES.ACTIVE,
    };

    const updatedOffers: EnergyOffer[] = MOCK_OFFERS.map((offer) =>
      offer.id === '1'
        ? { ...offer, status: ENERGY_OFFER_STATUSES.COMPLETED, updatedAt: 999 }
        : offer,
    );

    const initialProps: UseFilteredOffersProps = {
      allOffers: updatedOffers,
      filters: filters,
      justCompletedId: '1',
    };

    const { result, rerender } = renderHook(
      (props: UseFilteredOffersProps) => useFilteredOffers(props),
      {
        initialProps,
      },
    );

    expect(result.current.map((o) => o.id)).toContain('1');

    const nextProps: UseFilteredOffersProps = {
      allOffers: updatedOffers,
      filters: filters,
      justCompletedId: null,
    };

    rerender(nextProps);

    expect(result.current.length).toBe(1);
    expect(result.current[0].id).toBe('3');
  });
});

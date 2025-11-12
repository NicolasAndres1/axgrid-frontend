import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRowFlash } from './useRowFlash';
import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../types';
import { useMarketStore } from '../store';

const MOCK_DATE_NOW = new Date('2025-11-01T10:00:00.000Z').getTime(); // 10:00:00 AM

const MOCK_OLD_OFFER: EnergyOffer = {
  id: '1',
  sourceType: 'solar',
  status: 'active',
  price: 100,
  quantity: 50,
  unit: 'MWh',
  vendor: 'TestInc',
  location: 'CA',
  createdAt: new Date('2025-11-01T09:00:00.000Z').getTime(), // 09:00:00 AM
  updatedAt: new Date('2025-11-01T09:00:00.000Z').getTime(),
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(MOCK_DATE_NOW);
  // Reset the store's initialLoadTimestamp before each test
  useMarketStore.setState({ initialLoadTimestamp: null });
});

afterEach(() => {
  vi.useRealTimers();
  // Clean up the store after each test
  useMarketStore.setState({ initialLoadTimestamp: null });
});

describe('useRowFlash Hook', () => {
  it('should return "flashCreate" for a new offer created after initial load', () => {
    // Simulate initial load happening at 09:59:00 AM
    const initialLoadTime = MOCK_DATE_NOW - 2000; // 09:59:58 AM
    useMarketStore.setState({ initialLoadTimestamp: initialLoadTime });

    // Offer created after initial load
    const newOffer = {
      ...MOCK_OLD_OFFER,
      createdAt: MOCK_DATE_NOW - 1000, // 09:59:59 AM (after initial load)
    };

    const { result } = renderHook(() => useRowFlash(newOffer));

    expect(result.current).toBe('flashCreate');
  });

  it('should not return "flashCreate" for an offer created before initial load', () => {
    // Simulate initial load happening at 10:00:00 AM
    const initialLoadTime = MOCK_DATE_NOW;
    useMarketStore.setState({ initialLoadTimestamp: initialLoadTime });

    // Offer created before initial load
    const oldOffer = {
      ...MOCK_OLD_OFFER,
      createdAt: MOCK_DATE_NOW - 1000, // 09:59:59 AM (before initial load)
    };

    const { result } = renderHook(() => useRowFlash(oldOffer));

    expect(result.current).toBe(null);
  });

  it('should return "flashUpdate" when updatedAt changes', () => {
    const { result, rerender } = renderHook((props) => useRowFlash(props), {
      initialProps: MOCK_OLD_OFFER,
    });
    expect(result.current).toBe(null);

    const updatedOffer = {
      ...MOCK_OLD_OFFER,
      price: 101,
      updatedAt: MOCK_DATE_NOW + 1000,
    };
    rerender(updatedOffer);

    expect(result.current).toBe('flashUpdate');
  });

  it('should return "flashCompleted" when status changes to completed', () => {
    const { result, rerender } = renderHook((props) => useRowFlash(props), {
      initialProps: MOCK_OLD_OFFER,
    });
    expect(result.current).toBe(null);

    const completedOffer = {
      ...MOCK_OLD_OFFER,
      status: ENERGY_OFFER_STATUSES.COMPLETED,
      updatedAt: MOCK_DATE_NOW + 1000,
    };
    rerender(completedOffer);

    expect(result.current).toBe('flashCompleted');
  });
});

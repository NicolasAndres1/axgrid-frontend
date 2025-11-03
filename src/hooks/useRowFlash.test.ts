// src/hooks/useRowFlash.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRowFlash } from './useRowFlash';
import { ENERGY_OFFER_STATUSES, type EnergyOffer } from '../types';

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
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useRowFlash Hook', () => {
  it('should return "flashCreate" for a new offer on initial render', () => {
    const newOffer = {
      ...MOCK_OLD_OFFER,
      createdAt: MOCK_DATE_NOW - 1000, // 09:59:59 AM
    };

    const { result } = renderHook(() => useRowFlash(newOffer));

    expect(result.current).toBe('flashCreate');
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

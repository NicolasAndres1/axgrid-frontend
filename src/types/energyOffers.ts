export interface EnergyOffer {
  id: string; // UUID
  sourceType: EnergySourceType;
  price: number; // EUR/MWh
  quantity: number; // MWh
  unit: EnergyUnit;
  status: EnergyOfferStatus;
  vendor: string;
  location: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

export const ENERGY_SOURCE_TYPES = {
  SOLAR: 'solar',
  GAS: 'gas',
  HYDRO: 'hydro',
} as const;

export type EnergySourceType =
  (typeof ENERGY_SOURCE_TYPES)[keyof typeof ENERGY_SOURCE_TYPES];

export type EnergyUnit = 'MWh';

export const ENERGY_OFFER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export type EnergyOfferStatus =
  (typeof ENERGY_OFFER_STATUSES)[keyof typeof ENERGY_OFFER_STATUSES];

export interface MarketMetrics {
  totalOffers: number;
  activeOffers: number;
  averagePrice: number;
  lastUpdate: number;
}

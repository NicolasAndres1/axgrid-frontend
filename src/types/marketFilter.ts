import {
  ENERGY_OFFER_STATUSES,
  ENERGY_SOURCE_TYPES,
  type EnergyOfferStatus,
  type EnergySourceType,
} from './energyOffers';

export interface MarketFilters {
  source: EnergySourceType | 'all';
  status: EnergyOfferStatus | 'all';
}

export const FILTER_SOURCE_TYPES: (EnergySourceType | 'all')[] = [
  'all',
  ...Object.values(ENERGY_SOURCE_TYPES),
];

export const FILTER_OFFER_STATUSES: (EnergyOfferStatus | 'all')[] = [
  'all',
  ...Object.values(ENERGY_OFFER_STATUSES),
];

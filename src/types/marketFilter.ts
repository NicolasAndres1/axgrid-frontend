import type { EnergyOfferStatus, EnergySourceType } from './energyOffers';

export interface MarketFilters {
  source: EnergySourceType | 'all';
  status: EnergyOfferStatus | 'all';
}

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

export type EnergySourceType = 'solar' | 'gas';
export type EnergyUnit = 'MWh';
export type EnergyOfferStatus =
  | 'pending'
  | 'processing'
  | 'active'
  | 'completed';

export interface MarketMetrics {
  totalOffers: number;
  activeOffers: number;
  averagePrice: number;
  lastUpdate: number;
}

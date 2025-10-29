import { useQuery } from '@tanstack/react-query';
import { fetchEnergyOfferings } from '../api/energyOfferingsService';

export const useEnergyOfferings = () => {
  return useQuery({
    queryKey: ['energyOfferings'],
    queryFn: fetchEnergyOfferings,
    select: (data) => data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

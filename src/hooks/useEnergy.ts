import { useMemo } from 'react';
import { useEnergyOfferings } from '../services/queries/useEnergyOfferings';

export const useEnergy = () => {
  const {
    data: energyOfferingsData,
    isLoading: isEnergyOfferingsLoading,
    error: energyOfferingsError,
    isSuccess: isEnergyOfferingsSuccess,
  } = useEnergyOfferings();

  const energyTypes = useMemo(() => {
    return Object.entries(energyOfferingsData?.sources || {}).map(
      ([key, value]) => ({
        key,
        name: value.label,
      }),
    );
  }, [energyOfferingsData]);

  return {
    energyTypes,
    energyOfferingsData,
    isEnergyOfferingsLoading,
    energyOfferingsError,
    isEnergyOfferingsSuccess,
  };
};

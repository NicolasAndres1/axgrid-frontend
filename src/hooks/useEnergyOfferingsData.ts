import { useMemo } from 'react';
import { useEnergyOfferings } from '../services';

export const useEnergyOfferingsData = () => {
  const {
    data: energyOfferingsData,
    isLoading: isEnergyOfferingsDataLoading,
    error: energyOfferingsDataError,
    isSuccess: isEnergyOfferingsDataSuccess,
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
    isEnergyOfferingsDataLoading,
    energyOfferingsDataError,
    isEnergyOfferingsDataSuccess,
  };
};

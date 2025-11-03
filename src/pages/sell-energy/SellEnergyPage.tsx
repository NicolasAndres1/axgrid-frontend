import { useEnergyOfferingsData } from '../../hooks/useEnergyOfferingsData';
import { DynamicFormGenerator } from '../../components/form/dynamic-form-generator/DynamicFormGenerator';
import { useState, useEffect } from 'react';
import { PageTitle } from '../../components/common';
import { useError } from '../../store';

export const SellEnergyPage = () => {
  const [selectedEnergyType, setSelectedEnergyType] = useState('');
  const setError = useError((state) => state.setError);

  const {
    energyTypes,
    energyOfferingsData,
    isEnergyOfferingsDataLoading,
    energyOfferingsDataError,
    isEnergyOfferingsDataSuccess,
  } = useEnergyOfferingsData();

  const shouldShowForm =
    selectedEnergyType && energyOfferingsData && isEnergyOfferingsDataSuccess;

  useEffect(() => {
    if (energyOfferingsDataError) {
      setError(energyOfferingsDataError.message);
    }
  }, [energyOfferingsDataError, setError]);

  if (isEnergyOfferingsDataLoading) return <div>Loading...</div>;
  if (energyOfferingsDataError) return;

  return (
    <div>
      <PageTitle title="Sell Energy" />
      <label>Select the energy type: </label>
      <select
        id="energyType"
        aria-label="Energy type"
        value={selectedEnergyType}
        onChange={(e) => setSelectedEnergyType(e.target.value)}
      >
        <option value="" disabled>
          -- Please select an energy type --
        </option>
        {energyTypes.map((type) => (
          <option key={type.key} value={type.key}>
            {type.name}
          </option>
        ))}
      </select>

      <hr />

      {shouldShowForm && (
        <DynamicFormGenerator
          energyType={selectedEnergyType}
          config={energyOfferingsData}
        />
      )}
    </div>
  );
};

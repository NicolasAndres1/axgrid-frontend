import { useEnergy } from '../../hooks/useEnergy';
import { DynamicFormGenerator } from '../../components/form/dynamic-form-generator/DynamicFormGenerator';
import { useState } from 'react';

export const SellEnergyPage = () => {
  const [selectedEnergyType, setSelectedEnergyType] = useState('');
  const {
    energyTypes,
    energyOfferingsData,
    isEnergyOfferingsLoading,
    energyOfferingsError,
    isEnergyOfferingsSuccess,
  } = useEnergy();
  const shouldShowForm =
    selectedEnergyType && energyOfferingsData && isEnergyOfferingsSuccess;

  if (isEnergyOfferingsLoading) return <div>Loading...</div>;
  if (energyOfferingsError)
    return <div>Error: {energyOfferingsError.message}</div>;

  return (
    <div>
      <h1>Sell Energy</h1>
      <label>Select the energy type: </label>
      <select
        id="energyType"
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

import { useState } from 'react';
import { useEnergy } from '../hooks/useEnergy';
import { DynamicFormGenerator } from '../components/form/DynamicFormGenerator';

export const SellEnergyPage = () => {
  const [selectedEnergyType, setselectedEnergyType] = useState('');
  const {
    energyTypes,
    isEnergyOfferingsLoading,
    energyOfferingsError,
    isEnergyOfferingsSuccess,
  } = useEnergy();

  if (isEnergyOfferingsLoading) return <div>Loading...</div>;
  if (energyOfferingsError)
    return <div>Error: {energyOfferingsError.message}</div>;

  return (
    <div>
      <h1>Sell Energy Page</h1>
      <label htmlFor="energyType">Select the energy type: </label>
      <select
        id="energyType"
        value={selectedEnergyType}
        onChange={(e) => setselectedEnergyType(e.target.value)}
      >
        {energyTypes.map((type) => (
          <option key={type.key} value={type.key}>
            {type.name}
          </option>
        ))}
      </select>

      <hr />

      {isEnergyOfferingsSuccess && <DynamicFormGenerator />}
    </div>
  );
};

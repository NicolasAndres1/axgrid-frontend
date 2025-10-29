import { useEnergy } from '../hooks/useEnergy';
import { DynamicFormGenerator } from '../components/form/DynamicFormGenerator/DynamicFormGenerator';

interface SellEnergyPageProps {
  selectedEnergyType: string;
  setSelectedEnergyType: (value: string) => void;
}

export const SellEnergyPage = ({
  selectedEnergyType,
  setSelectedEnergyType,
}: SellEnergyPageProps) => {
  const {
    energyTypes,
    energyOfferingsData,
    isEnergyOfferingsLoading,
    energyOfferingsError,
    isEnergyOfferingsSuccess,
  } = useEnergy();

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

      {isEnergyOfferingsSuccess &&
        selectedEnergyType &&
        energyOfferingsData && (
          <DynamicFormGenerator
            energyType={selectedEnergyType}
            config={energyOfferingsData}
          />
        )}
    </div>
  );
};

import { API_BASE_URL } from '../../config';
import type { ApiFormConfig } from '../../types/forms.types';

export const fetchEnergyOfferings = async (): Promise<ApiFormConfig> => {
  const response = await fetch(`${API_BASE_URL}/energy-offerings`);

  if (!response.ok) {
    throw new Error('Failed to fetch energy offerings');
  }

  return response.json();
};

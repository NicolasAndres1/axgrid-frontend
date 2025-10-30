export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox-group';
  required: boolean;
  unit?: string;
  placeholder?: string;
  options?: FormFieldOption[];
}

export interface EnergySourceConfig {
  label: string;
  fields: FormField[];
}

export interface ApiFormConfig {
  common: FormField[];
  sources: {
    [sourceKey: string]: EnergySourceConfig;
  };
  uiHints: {
    order: string[];
    displayUnits: boolean;
  };
}

export interface EnergyTypeOption {
  key: string;
  name: string;
}

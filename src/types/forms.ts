export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  key: string;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'checkbox-group'
    | 'textarea'
    | 'file';
  required: boolean;
  unit?: string;
  placeholder?: string;
  options?: FormFieldOption[];
  accept?: string; // For file input
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

import type { FormField, FormFieldOption } from '../../../types';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import styles from './DynamicFormField.module.css';

interface DynamicFormFieldProps<TFieldValues extends FieldValues> {
  field: FormField;
  register: UseFormRegister<TFieldValues>;
}

export const DynamicFormField = <TFieldValues extends FieldValues>({
  field,
  register,
}: DynamicFormFieldProps<TFieldValues>) => {
  const { key, label, type, required, unit, placeholder, options, accept } =
    field;
  const registrationProps = register(key as Path<TFieldValues>, {
    required: required,
  });

  const fieldLabel = (
    <label htmlFor={key}>
      {label}
      {required && <span className={styles.required}> *</span>}
    </label>
  );

  // Set of functions to render the different types of fields with multiple options
  // Extracted for better readability
  // ------------------------------------------------------------
  const renderSelectOption = (opt: FormFieldOption) => (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  );

  const renderRadioOption = (opt: FormFieldOption) => (
    <label key={opt.value} className={styles.radioLabel}>
      <input type="radio" value={opt.value} {...registrationProps} />
      {opt.label}
    </label>
  );

  const renderCheckboxOption = (opt: FormFieldOption) => (
    <label key={opt.value} className={styles.checkboxLabel}>
      <input type="checkbox" value={opt.value} {...registrationProps} />
      {opt.label}
    </label>
  );
  // ------------------------------------------------------------

  switch (type) {
    case 'text':
    case 'number':
      return (
        <div className={styles.field} data-testid={key}>
          {fieldLabel}
          <div>
            <input
              id={key}
              type={type}
              placeholder={placeholder || ''}
              {...registrationProps}
            />
            {unit && <span className={styles.unit}>{unit}</span>}
          </div>
        </div>
      );

    case 'textarea':
      return (
        <div className={styles.field} data-testid={key}>
          {fieldLabel}
          <textarea
            id={key}
            placeholder={placeholder || ''}
            {...registrationProps}
          />
        </div>
      );

    case 'select':
      return (
        <div className={styles.field} data-testid={key}>
          {fieldLabel}
          <select id={key} {...registrationProps}>
            {options?.map(renderSelectOption)}
          </select>
        </div>
      );

    case 'radio':
      return (
        <div className={styles.field} data-testid={key}>
          <fieldset className={styles.fieldset}>
            <legend>{fieldLabel} </legend>
            <div className={styles.radioContainer}>
              {options?.map(renderRadioOption)}
            </div>
          </fieldset>
        </div>
      );

    case 'checkbox':
      return (
        <div className={styles.field} data-testid={key}>
          {/* El label de un checkbox singular envuelve al input */}
          <label className={styles.checkboxLabel}>
            <input id={key} type="checkbox" {...registrationProps} />
            {label}
            {required && <span className={styles.required}> *</span>}
          </label>
        </div>
      );

    case 'checkbox-group':
      return (
        <div className={styles.field} data-testid={key}>
          <fieldset className={styles.fieldset}>
            <legend>{fieldLabel}</legend>
            <div>{options?.map(renderCheckboxOption)}</div>
          </fieldset>
        </div>
      );

    case 'file':
      return (
        <div className={styles.field} data-testid={key}>
          {fieldLabel}
          <input
            id={key}
            type="file"
            accept={accept || ''} // Possible prop name, not confirmed in the API docs
            {...registrationProps}
          />
        </div>
      );

    default:
      return (
        <div className={styles.field}>
          <p>Unsupported field type: {type}</p>
        </div>
      );
  }
};

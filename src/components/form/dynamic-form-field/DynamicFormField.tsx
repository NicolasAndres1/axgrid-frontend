import { useMemo, useCallback } from 'react';
import type { FormField, FormFieldOption } from '../../../types/forms';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import styles from './DynamicFormField.module.css';

interface FieldProps<TFieldValues extends FieldValues> {
  field: FormField;
  register: UseFormRegister<TFieldValues>;
}

export const DynamicFormField = <TFieldValues extends FieldValues>({
  field,
  register,
}: FieldProps<TFieldValues>) => {
  const { key, label, type, required, unit, placeholder, options } = field;

  const fieldLabel = useMemo(
    () => (
      <label htmlFor={key}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
    ),
    [key, label, required],
  );

  // Set of functions to render the different types of fields with multiple options
  // Extracted for better readability
  // ------------------------------------------------------------
  const renderSelectOption = useCallback(
    (opt: FormFieldOption) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ),
    [],
  );

  const renderRadioOption = useCallback(
    (opt: FormFieldOption) => (
      <label key={opt.value} className={styles.radioLabel}>
        <input
          type="radio"
          value={opt.value}
          {...register(key as Path<TFieldValues>, { required: required })}
        />
        {opt.label}
      </label>
    ),
    [key, register, required],
  );

  const renderCheckboxOption = useCallback(
    (opt: FormFieldOption) => (
      <label key={opt.value} className={styles.checkboxLabel}>
        <input
          type="checkbox"
          value={opt.value}
          {...register(key as Path<TFieldValues>, { required: required })}
        />
        {opt.label}
      </label>
    ),
    [key, register, required],
  );
  // ------------------------------------------------------------

  switch (type) {
    case 'text':
    case 'number':
      return (
        <div className={styles.field}>
          {fieldLabel}
          <div>
            <input
              id={key}
              type={type}
              placeholder={placeholder || ''}
              {...register(key as Path<TFieldValues>, { required: required })}
            />
            {unit && <span className={styles.unit}>{unit}</span>}
          </div>
        </div>
      );

    case 'select':
      return (
        <div className={styles.field}>
          {fieldLabel}
          <select
            id={key}
            {...register(key as Path<TFieldValues>, { required: required })}
          >
            {options?.map(renderSelectOption)}
          </select>
        </div>
      );

    case 'radio':
      return (
        <div className={styles.field}>
          <fieldset className={styles.fieldset}>
            <legend>{fieldLabel} </legend>
            <div className={styles.radioContainer}>
              {options?.map(renderRadioOption)}
            </div>
          </fieldset>
        </div>
      );

    case 'checkbox-group':
      return (
        <div className={styles.field}>
          <fieldset className={styles.fieldset}>
            <legend>{fieldLabel}</legend>
            <div>{options?.map(renderCheckboxOption)}</div>
          </fieldset>
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

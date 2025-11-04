import { useEffect, useMemo } from 'react';
import type { ApiFormConfig } from '../../../types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { DynamicFormField } from '../dynamic-form-field/DynamicFormField';
import { Button } from '../../common';
import styles from './DynamicFormGenerator.module.css';

interface DynamicFormGeneratorProps {
  energyType: string;
  config: ApiFormConfig;
}

type FormData = {
  [key: string]: string | number | string[];
};

export const DynamicFormGenerator = ({
  energyType,
  config,
}: DynamicFormGeneratorProps) => {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const fieldsToRender = useMemo(() => {
    const specificFields = config?.sources[energyType]?.fields || [];

    return [...config.common, ...specificFields];
  }, [energyType, config]);

  useEffect(() => {
    reset();
  }, [energyType, reset]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('FORM SUBMITTED:', data);
    alert('Offer published successfully (Check console to see the data)');
    reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {fieldsToRender.map((field) => (
        <DynamicFormField key={field.key} field={field} register={register} />
      ))}

      <Button type="primary" onClick={handleSubmit(onSubmit)}>
        Publish Offer
      </Button>
      <Button type="secondary" onClick={() => reset()}>
        Clear Form
      </Button>
    </form>
  );
};

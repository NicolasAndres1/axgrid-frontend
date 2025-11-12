import styles from './FilterField.module.css';

interface FilterFieldProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

export const FilterField = ({
  id,
  label,
  value,
  options,
  onChange,
}: FilterFieldProps) => (
  <div>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

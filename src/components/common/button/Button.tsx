import styles from './Button.module.css';

export const Button = ({
  children,
  onClick,
  type = 'primary',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
}) => (
  <button className={styles[type]} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

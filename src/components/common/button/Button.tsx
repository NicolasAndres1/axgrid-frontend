import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  type = 'primary',
  disabled = false,
}: ButtonProps) => (
  <button className={styles[type]} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

import styles from './ErrorBanner.module.css';

interface ErrorBannerProps {
  message: string;
  onClose?: () => void;
}

export const ErrorBanner = ({ message, onClose }: ErrorBannerProps) => {
  return (
    <div className={styles.banner}>
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close error banner"
        >
          &times;
        </button>
      )}
    </div>
  );
};

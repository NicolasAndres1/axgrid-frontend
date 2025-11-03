import { useState } from 'react';
import styles from './ErrorBanner.module.css';
import { useError } from '../../../store/useError';

interface ErrorBannerProps {
  message: string;
}

export const ErrorBanner = ({ message }: ErrorBannerProps) => {
  const setError = useError((state) => state.setError);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (isClosing || e.animationName.includes('bannerAnimation')) {
      setError(null);
    }
  };

  return (
    <div
      className={`${styles.banner} ${isClosing ? styles.closing : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close error banner"
      >
        &times;
      </button>
    </div>
  );
};

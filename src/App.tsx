import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { MarketPage, SellEnergyPage } from './pages';
import styles from './App.module.css';
import { useError, useMarketStore } from './store';
import { ErrorBanner } from './components';

export default function App() {
  const connect = useMarketStore((state) => state.connect);
  const disconnect = useMarketStore((state) => state.disconnect);
  const connectionStatus = useMarketStore((state) => state.connectionStatus);

  const error = useError((state) => state.error);
  const setError = useError((state) => state.setError);

  useEffect(() => {
    connect();
    return () => {
      // Clean up the socket when the component unmounts
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (connectionStatus === 'error') {
      setError('Connection Failed. Could not connect to the server.');
    }
  }, [connectionStatus, setError]);

  const errorBanner = error && <ErrorBanner message={error} />;

  return (
    <div className={styles.container}>
      {errorBanner}
      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>
          Market
        </Link>
        <Link to="/sell" className={styles.link}>
          Sell Energy
        </Link>
      </nav>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<MarketPage />} />
          <Route path="/sell" element={<SellEnergyPage />} />
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </main>
    </div>
  );
}

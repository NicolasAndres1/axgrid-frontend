import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { MarketPage } from './pages/market/MarketPage';
import { SellEnergyPage } from './pages/sell-energy/SellEnergyPage';
import styles from './App.module.css';
import { useMarketStore } from './store/marketStore';

export default function App() {
  const connect = useMarketStore((state) => state.connect);
  const disconnect = useMarketStore((state) => state.disconnect);

  useEffect(() => {
    connect();

    return () => {
      // Clean up the socket when the component unmounts
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div className={styles.container}>
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

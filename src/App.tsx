import { Routes, Route, Link } from 'react-router-dom';
import { MarketPage } from './pages/MarketPage';
import { SellEnergyPage } from './pages/SellEnergyPage';
import styles from './App.module.css';

export default function App() {
  return (
    <div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>
          AxGrid - Market
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

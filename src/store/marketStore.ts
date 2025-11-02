import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import {
  type EnergyOffer,
  type EnergyOfferStatus,
  type MarketMetrics,
} from '../types/energyOffers';

interface MarketState {
  offers: EnergyOffer[];
  metrics: MarketMetrics;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';

  connect: () => void;
  disconnect: () => void;
  setOfferStatus: (id: string, status: EnergyOfferStatus) => void;
}

const SOCKET_URL = 'http://localhost:4001';
const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

export const useMarketStore = create<MarketState>((set, get) => ({
  offers: [],
  metrics: {
    totalOffers: 0,
    activeOffers: 0,
    averagePrice: 0,
    lastUpdate: 0,
  },
  isConnected: false,
  connectionStatus: 'disconnected',

  setOfferStatus: (id: string, status: EnergyOfferStatus) => {
    const eventName = `offers:${status}`;
    console.log(`Socket: Emitting ${eventName}`, { id });
    socket.emit(eventName, { id });
  },

  connect: () => {
    // We avoid multiple connections
    if (get().isConnected) return;

    set({ connectionStatus: 'connecting' });
    socket.connect();

    socket.on('connect', () => {
      console.log('Socket: Connected');
      set({ isConnected: true, connectionStatus: 'connected' });
      socket.emit('offers:list');
    });

    socket.on('disconnect', () => {
      console.log('Socket: Disconnected');

      set({ isConnected: false, connectionStatus: 'disconnected' });
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket: Connection attempt failed', err.message);
      set({ connectionStatus: 'connecting' });
    });

    socket.io.on('reconnect_failed', () => {
      console.error('Socket: Reconnection failed permanently.');
      set({ isConnected: false, connectionStatus: 'error' });
    });

    socket.on('offers:init', (initialOffers: EnergyOffer[]) => {
      console.log('Socket: offers:init', initialOffers.length);

      set({ offers: initialOffers });
    });

    socket.on('offers:created', (newOffer: EnergyOffer) => {
      console.log('Socket: offers:created', newOffer.id);

      set((state) => ({
        offers: [...state.offers, newOffer],
      }));
    });

    socket.on('offers:updated', (updatedOffer: EnergyOffer) => {
      console.log('Socket: offers:updated', updatedOffer.id);

      set((state) => ({
        offers: state.offers.map((offer) =>
          offer.id === updatedOffer.id ? updatedOffer : offer,
        ),
      }));
    });

    socket.on('offers:removed', ({ id }: { id: string }) => {
      console.log('Socket: offers:removed', id);

      set((state) => ({
        offers: state.offers.filter((offer) => offer.id !== id),
      }));
    });

    socket.on('ops:metric', (newMetrics: Partial<MarketMetrics>) => {
      set((state) => ({
        metrics: { ...state.metrics, ...newMetrics },
      }));
    });
  },

  disconnect: () => {
    console.log('Socket: Disconnecting...');

    socket.disconnect();
    socket.off();

    set({ isConnected: false, offers: [], connectionStatus: 'disconnected' });
  },
}));

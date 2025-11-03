import { create } from 'zustand';

interface ErrorState {
  error: string | null;
  setError: (message: string | null) => void;
}

export const useError = create<ErrorState>((set) => ({
  error: null,
  setError: (message: string | null) => {
    set({ error: message });
  },
}));

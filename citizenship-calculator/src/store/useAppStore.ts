import { create } from 'zustand'

export interface FormData {
  dob: Date | null;
  whatsapp: string;
}

type AppState =
  | { status: 'form' }
  | { status: 'searching' }
  | { status: 'reveal' };

interface AppStore {
  state: AppState;
  setForm: () => void;
  setSearching: () => void;
  setReveal: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  state: { status: 'form' },
  setForm: () => set({ state: { status: 'form' } }),
  setSearching: () => set({ state: { status: 'searching' } }),
  setReveal: () => set({ state: { status: 'reveal' } }),
}));

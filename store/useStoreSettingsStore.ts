import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreSettings {
  phoneNumber: string;
  whatsappNumber: string;
  storeName: string;
  storeAddress: string;
}

interface StoreSettingsState extends StoreSettings {
  setSettings: (settings: Partial<StoreSettings>) => void;
}

export const useStoreSettingsStore = create<StoreSettingsState>()(
  persist(
    (set) => ({
      phoneNumber: "+62 812-3456-7890",
      whatsappNumber: "+62 812-3456-7890",
      storeName: "Kkomi Korean Cafe",
      storeAddress: "Jl. Contoh Alamat No. 123, Jakarta",
      setSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    { name: "store-settings" }
  )
);

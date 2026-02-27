import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  isLoading: boolean;
  isOnline: boolean;
  theme: "light" | "dark";

  setLoading: (value: boolean) => void;
  setOnline: (value: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoading: false,
      isOnline: false,
      theme: "light",

      setLoading: (value) => set({ isLoading: value }),
      setOnline: (value) => set({ isOnline: value }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ theme: state.theme }), // Only persist the theme
    }
  )
);

export default useAppStore;

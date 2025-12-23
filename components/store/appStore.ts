import { create } from "zustand";

interface AppState {
  isLoading: boolean;
  isOnline: boolean;
  theme: "light" | "dark";

  setLoading: (value: boolean) => void;
  setOnline: (value: boolean) => void;
  toggleTheme: () => void;
}

const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  isOnline: false,
  theme: "light",

  setLoading: (value) => set({ isLoading: value }),
  setOnline: (value) => set({ isOnline: value }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
}));

export default useAppStore;

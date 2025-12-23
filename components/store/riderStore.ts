import { create } from "zustand";

interface RiderState {
  riderStatus: "online" | "offline" | "busy";
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;

  setRiderStatus: (status: RiderState["riderStatus"]) => void;
  setLocation: (lat: number, lng: number) => void;
}

const userRiderStore = create<RiderState>((set) => ({
  riderStatus: "offline",
  currentLocation: null,

  setRiderStatus: (status) => set({ riderStatus: status }),
  setLocation: (latitude, longitude) =>
    set({ currentLocation: { latitude, longitude } }),
}));

export default userRiderStore;

import {
    getUserProfile,
    refreshAccessToken,
} from "@/components/services/api/authApi";
import * as AsyncStore from "@/components/services/storage/asyncStore";
import * as SecureStore from "@/components/services/storage/secureStore";
import { STORAGE_KEYS } from "@/components/services/storage/storageKeys";
import { create } from "zustand";

interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  is_email_verified?: boolean;
  role: "shipper" | "carrier";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: "shipper" | "carrier";

  phoneNumber: string | null;
  country: string | null;

  login: (
    accessToken: string,
    refreshToken: string,
    user: User
  ) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: "shipper" | "carrier") => void;
  loadAuth: () => Promise<void>;
  setPhoneNumber: (phone: string) => void;
  setCountry: (country: string) => void;
  fetchUserProfile: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  clearSignupData: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  role: "shipper",
  phoneNumber: null,
  country: null,

  login: async (accessToken, refreshToken, user) => {
    await SecureStore.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await SecureStore.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    await AsyncStore.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    await AsyncStore.setItem(STORAGE_KEYS.USER_TYPE, user.role);
    console.log(accessToken);
    
    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await SecureStore.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
    await AsyncStore.removeItem(STORAGE_KEYS.USER);
    await AsyncStore.removeItem(STORAGE_KEYS.USER_TYPE);

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  loadAuth: async () => {
    const accessToken = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = await SecureStore.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const userString = await AsyncStore.getItem(STORAGE_KEYS.USER);

    if (accessToken && refreshToken && userString) {
      set({
        accessToken,
        refreshToken,
        user: JSON.parse(userString),
        isAuthenticated: true,
      });
    }
  },

  fetchUserProfile: async () => {
    const { accessToken } = get();
    if (!accessToken) {
      throw new Error("No access token available");
    }

    try {
      const userData = await getUserProfile(accessToken);
      await AsyncStore.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      set({ user: userData });
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  refreshAuthToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await refreshAccessToken(refreshToken);
      const newAccessToken = response.access;

      await SecureStore.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
      set({ accessToken: newAccessToken });
    } catch (error: any) {
      console.error("Error refreshing token:", error);
      await get().logout();
      throw error;
    }
  },
  setRole: (role: "shipper" | "carrier") => {
    set({ role });
  },
  setPhoneNumber: (phoneNumber: string) => {
    set({ phoneNumber });
  },
  setCountry: (country: string) => {
    set({ country });
  },
  clearSignupData: () => {
    set({ phoneNumber: null, country: null });
  },
}));

export default useAuthStore;

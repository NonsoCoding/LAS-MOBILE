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
  role: "carrier" | "shipper";
  email?: string;
  phone_number?: string;
  is_email_verified?: boolean;
  // Rider specific fields
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number | string;
  vehicle_color?: string;
  vehicle_type?: number | string | { id: number };
  vehicle_photo_front?: string;
  vehicle_photo_back?: string;
  vehicle_photo_left?: string;
  vehicle_photo_right?: string;
  drivers_license?: string;
  insurance_certificate?: string;
  terms_accepted_at?: string;
  drivers_license_uploaded?: boolean;
  insurance_certificate_uploaded?: boolean;
  is_online?: boolean;
  profile_review_status?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: "carrier" | "shipper";
  phoneNumber: string | null;
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
  login: (
    accessToken: string,
    refreshToken: string,
    user: User
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isOnline: false,
  role: "carrier",
  phoneNumber: null,
  login: async (accessToken, refreshToken, user) => {
    await SecureStore.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await SecureStore.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    await AsyncStore.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    await AsyncStore.setItem(STORAGE_KEYS.USER_TYPE, user.role);

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
      const currentUser = get().user;
      
      let finalUserData = { ...currentUser, ...userData };
      
      // If user is a carrier, also fetch carrier-specific profile data
      if (finalUserData.role === "carrier") {
        try {
          const { getCarrierProfile } = await import("@/components/services/api/carriersApi");
          const carrierData = await getCarrierProfile(accessToken);
          finalUserData = { ...finalUserData, ...carrierData };
        } catch (error) {
          console.error("Error fetching carrier specific profile:", error);
        }
      }
      
      await AsyncStore.setItem(STORAGE_KEYS.USER, JSON.stringify(finalUserData));
      set({ user: finalUserData });
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  setIsOnline: (isOnline: boolean) => {
    set({isOnline})
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
}));

export default useAuthStore;

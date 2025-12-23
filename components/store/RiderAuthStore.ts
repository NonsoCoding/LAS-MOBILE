import {
  getUserProfile,
  refreshAccessToken,
} from "@/components/services/api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  is_email_verified?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null; // Property
  isAuthenticated: boolean;

  login: (
    accessToken: string,
    refreshToken: string,
    user: User
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  refreshAuthToken: () => Promise<void>; // Renamed from refreshToken to refreshAuthToken
}

const useRiderAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  login: async (accessToken, refreshToken, user) => {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("user");

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  loadAuth: async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const userString = await AsyncStorage.getItem("user");

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
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      set({ user: userData });
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  refreshAuthToken: async () => {
    // Renamed method
    const { refreshToken } = get();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await refreshAccessToken(refreshToken);
      const newAccessToken = response.access;

      await AsyncStorage.setItem("accessToken", newAccessToken);
      set({ accessToken: newAccessToken });
    } catch (error: any) {
      console.error("Error refreshing token:", error);
      // If refresh fails, logout user
      get().logout();
      throw error;
    }
  },
}));

export default useRiderAuthStore;

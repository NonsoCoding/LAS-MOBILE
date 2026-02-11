import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  USER_TYPE: "userType", // "user" | "rider"
} as const;

export const appStorage = {
  // Secure Storage (Sensitive Data)
  async saveSecure(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error saving secure item (${key}):`, error);
    }
  },

  async getSecure(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting secure item (${key}):`, error);
      return null;
    }
  },

  async deleteSecure(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error deleting secure item (${key}):`, error);
    }
  },

  // Regular Storage (Non-Sensitive Data)
  async save(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error saving item (${key}):`, error);
    }
  },

  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item (${key}):`, error);
      return null;
    }
  },

  async delete(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting item (${key}):`, error);
    }
  },
};

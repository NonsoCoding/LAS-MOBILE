import * as SecureStore from 'expo-secure-store';

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error setting SecureStore item ${key}:`, error);
  }
}

export async function getItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting SecureStore item ${key}:`, error);
    return null;
  }
}

export async function deleteItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting SecureStore item ${key}:`, error);
  }
}

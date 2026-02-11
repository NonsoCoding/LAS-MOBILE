import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting AsyncStorage item ${key}:`, error);
  }
}

export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting AsyncStorage item ${key}:`, error);
    return null;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing AsyncStorage item ${key}:`, error);
  }
}

export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
}

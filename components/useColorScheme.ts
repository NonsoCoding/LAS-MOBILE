import { useColorScheme as useSystemColorScheme } from 'react-native';
import useAppStore from './store/appStore';

export function useColorScheme() {
  const storeTheme = useAppStore((state) => state.theme);
  const systemTheme = useSystemColorScheme();
  
  // You can decide if you want to follow system by default or just use the store
  // Here we use the store theme which defaults to 'light'
  return storeTheme;
}

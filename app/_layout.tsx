import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import "react-native-reanimated";

import { AppModeProvider, useAppMode } from "../context/AppModeContext";

import * as AsyncStore from "@/components/services/storage/asyncStore";
import * as SecureStore from "@/components/services/storage/secureStore";
import { STORAGE_KEYS } from "@/components/services/storage/storageKeys";
import useAuthStore from "@/components/store/authStore";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const { mode, setMode } = useAppMode();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded, error] = useFonts({
    [fontFamily.Bold]: require("../assets/fonts/MontserratAlternates-Bold.ttf"),
    [fontFamily.Medium]: require("../assets/fonts/MontserratAlternates-Medium.ttf"),
    [fontFamily.Regular]: require("../assets/fonts/MontserratAlternates-Regular.ttf"),
    [fontFamily.Light]: require("../assets/fonts/MontserratAlternates-Light.ttf"),
    [fontFamily.MontserratEasyBold]: require("../assets/fonts/Montserrat-Bold.ttf"),
    [fontFamily.MontserratEasyMedium]: require("../assets/fonts/Montserrat-Medium.ttf"),
    [fontFamily.MontserratEasyRegular]: require("../assets/fonts/Montserrat-Regular.ttf"),
    [fontFamily.MontserratEasyLight]: require("../assets/fonts/Montserrat-Light.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (!loaded && !error) {
          return;
        }

        // Check authentication
        const loadAuth = useAuthStore.getState().loadAuth;
        await loadAuth();

        const accessToken = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const userType = await AsyncStore.getItem(STORAGE_KEYS.USER_TYPE);

        if (accessToken && userType) {
          if (userType === "carrier") {
            setMode("carrier");
            router.replace("/(Rider-Drawer)");
          } else {
            setMode("shipper");
            router.replace("/(drawer)");
          }
        }
      } catch (error) {
        console.error("Error during app preparation:", error);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [loaded, error]);

  useEffect(() => {
    // Hide splash screen when app is ready
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {mode === "shipper" ? (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: themeColors.background },
          }}
          initialRouteName="index"
        >
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/Auth/User/index"
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="(drawer)"
            options={{ headerShown: false }}
          />
        </Stack>
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: themeColors.background },
          }}
          initialRouteName="(Rider-Drawer)"
        >
          <Stack.Screen
            name="login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/Auth/Rider/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/Auth/Rider/PersonalDetails"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/Auth/Rider/Otp"
            options={{ headerShown: false }}
          />
           <Stack.Screen name="(Rider-Drawer)" options={{ headerShown: false }} />
        </Stack>
      )}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppModeProvider>
      <RootLayoutNav />
    </AppModeProvider>
  );
}
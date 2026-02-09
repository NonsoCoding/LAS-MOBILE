import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import "react-native-reanimated";

import { AppModeProvider, useAppMode } from "../context/AppModeContext";

import { useColorScheme } from "@/components/useColorScheme";
import { fontFamily } from "@/constants/fonts";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "screens/Auth/Intro",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { mode } = useAppMode();
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
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {mode === "user" ? (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
          initialRouteName="(drawer)"
        >
          <Stack.Screen
            name="screens/Auth/User/index"
            options={{ headerShown: false }}
          />
        </Stack>
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
          initialRouteName="(drawer)"
        >
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
          <Stack.Screen name="(rider-tabs)" options={{ headerShown: false }} />
        </Stack>
      )}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // useEffect(() => {
  //   SplashScreen.preventAutoHideAsync();
  // }, []);

  // const [loaded, error] = useFonts({
  //   SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  //   ...FontAwesome.font,
  // });

  // // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  return (
    <AppModeProvider>
      <RootLayoutNav />
    </AppModeProvider>
  );
}

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { AppModeProvider, useAppMode } from "../context/AppModeContext";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "screens/Auth/Intro",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { mode } = useAppMode();

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

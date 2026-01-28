import { FontTheme } from "@/constants/fonts";
import { Text, View } from "react-native";

export default function RiderHomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontFamily: FontTheme.font.MontserratRegular }}>Welcome, Rider!</Text>
    </View>
  );
}

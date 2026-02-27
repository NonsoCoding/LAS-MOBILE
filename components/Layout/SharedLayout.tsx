import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import React from "react";
import { View } from "react-native";

interface SharedLayoutProps {
  children?: React.ReactNode;
}

const SharedLayout = ({ children }: SharedLayoutProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  return <View style={[tw`flex-1 py-15 px-5`, { backgroundColor: themeColors.primaryColor }]}>{children}</View>;
};

export default SharedLayout;

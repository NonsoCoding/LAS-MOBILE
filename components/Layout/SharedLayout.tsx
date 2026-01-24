import tw from "@/constants/tailwind";
import React from "react";
import { View } from "react-native";

interface SharedLayoutProps {
  children?: React.ReactNode;
}

const SharedLayout = ({ children }: SharedLayoutProps) => {
  return <View style={[tw`flex-1 py-15 px-5 bg-[#19488A]`]}>{children}</View>;
};

export default SharedLayout;

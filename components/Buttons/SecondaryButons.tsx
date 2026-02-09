import tw from "@/constants/tailwind";
import React from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  onpress?: () => void;
  text?: React.ReactNode;
  textColor?: string;
  bgColors?: string;
  height?: number;
  disabled?: boolean;
    width?: number;
    borderColor?: string;
    borderWidth?: number;
    icon?: ImageSourcePropType;
}

const SecondaryButton = ({
  bgColors,
  text,
  textColor,
  height,
    disabled,
  icon,
  width,
    onpress,
    borderWidth,
  borderColor
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onpress}
      style={[
        tw`items-center justify-center rounded-md flex-row gap-2 flex-1`,
        { backgroundColor: bgColors, height: height, width: width, borderColor: borderColor, borderWidth: borderWidth },
      ]}
      >
          <Image source={icon} style={[tw`h-3.5 w-3.5`]}/>
      <Text style={[tw`text-center text-xs`, { color: textColor, fontFamily: "MontserratBold" }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

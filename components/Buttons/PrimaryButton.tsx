import tw from "@/constants/tailwind";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  onpress?: () => void;
  text?: React.ReactNode;
  textColor?: string;
  bgColors?: string;
  height?: number;
  disabled?: boolean;
  width?: number;
}

const PrimaryButton = ({
  bgColors,
  text,
  textColor,
  height,
  disabled,
  width,
  onpress,
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onpress}
      style={[
        tw`items-center justify-center rounded-md`,
        { backgroundColor: bgColors, height: height, width: width },
      ]}
    >
      <Text style={[tw`font-semibold`, { color: textColor, fontFamily: "MontserratRegular" }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

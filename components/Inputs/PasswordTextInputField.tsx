import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { Eye, EyeOff, LucideIcon } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardTypeOptions,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "../useColorScheme";

interface TextInputFieldsProps {
  placeholderText?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: any) => void;
  icon?: LucideIcon;
  iconSize?: number;
  keyboardType?: KeyboardTypeOptions;
  placeholderTextColor?: string;
  iconColor?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
}

const PasswordTextInputFields = ({
  placeholderText,
  onChangeText,
  icon: Icon,
  value,
  iconColor,
  iconSize = 20,
  keyboardType = "default",
  autoCapitalize = "none",
  onBlur,
  placeholderTextColor = "#999",
  secureTextEntry = false,
}: TextInputFieldsProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View
      style={[
        tw`bg-[#19488A11] text-[17px] gap-2 flex-row items-center rounded-full border border-gray-200 px-3`,
        {},
      ]}
    >
      {Icon && (
        <View style={[tw``]}>
          <Icon size={iconSize} color={iconColor} />
        </View>
      )}
      <TextInput
        placeholder={placeholderText}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={placeholderTextColor}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        style={[tw`flex-1 font-light text-black py-3.5`, {
          color: themeColors.text,
          fontFamily: fontFamily.MontserratEasyRegular
        }]}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility} style={tw`ml-2`}>
          {isPasswordVisible ? (
            <EyeOff size={iconSize} color={iconColor || "#19488A"} />
          ) : (
            <Eye size={iconSize} color={iconColor || "#19488A"} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PasswordTextInputFields;

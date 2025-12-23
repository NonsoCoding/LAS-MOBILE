import tw from "@/constants/tailwind";
import { LucideIcon } from "lucide-react-native";
import { KeyboardTypeOptions, TextInput, View } from "react-native";

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

const TextInputFields = ({
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
  return (
    <View
      style={[
        tw`py-4.5 text-[17px] gap-2 flex-row items-center rounded border border-gray-200 px-3`,
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
        secureTextEntry={secureTextEntry}
        style={[tw`w-full font-light`, {}]}
      />
    </View>
  );
};

export default TextInputFields;

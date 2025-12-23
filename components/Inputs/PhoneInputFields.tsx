import tw from "@/constants/tailwind";
import { Text, TextInput, View } from "react-native";

interface TextInputFieldsProps {
  placeholderText?: string;
  value?: string;
  onChangeText?: (text: string) => string;
}

const PhoneNumberTextInputFields = ({
  placeholderText,
  onChangeText,
  value,
}: TextInputFieldsProps) => {
  return (
    <View
      style={[
        tw`flex-row border-b border-b-gray-400 items-center pt-6 pb-2 gap-2`,
      ]}
    >
      <Text style={[tw`text-[17px]`]}>(+234)</Text>
      <View
        style={[
          tw`border-r h-4.5`,
          {
            borderWidth: 0.1,
          },
        ]}
      />
      <TextInput
        placeholder={placeholderText}
        onChangeText={onChangeText}
        value={value}
        style={[tw`w-full text-[17px]`, {}]}
      />
    </View>
  );
};

export default PhoneNumberTextInputFields;

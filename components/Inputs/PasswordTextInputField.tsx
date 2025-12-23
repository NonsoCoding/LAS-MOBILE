import tw from "@/constants/tailwind";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface PasswordTextInputFieldsProps {
  placeholderText?: string;
  value?: string;
  onChangeText: (text: string) => void;
}

const PasswordTextInputFields = ({
  placeholderText,
  value,
  onChangeText,
}: PasswordTextInputFieldsProps) => {
  const [secure, setSecure] = useState(true);

  return (
    <View style={tw`flex-row items-center border-b border-b-gray-400`}>
      <TextInput
        placeholder={placeholderText}
        style={[tw`flex-1 text-[17px] pt-4 pb-2`, {}]}
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        onPress={() => setSecure((prev) => !prev)}
        style={tw`ml-2`}
      >
        <Ionicons name={secure ? "eye-off" : "eye"} size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordTextInputFields;

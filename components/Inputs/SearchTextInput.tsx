import { FontTheme } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { Fontisto } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

interface SearchTextInputProps {
    placeholderText?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: any) => void;
}

const SearchTextInput = ({
    placeholderText,
    value,
    onChangeText,
    onBlur
}: SearchTextInputProps) => {
    return (
        <View style={tw`border-1 border rounded-full items-center-center flex-row px-3 py-4 gap-2 border-[#19488A]`}>
            <Fontisto name="search" size={16} color="#19488A" />
            <TextInput
                placeholder={placeholderText}
                placeholderTextColor={"black"}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
                style={[tw`text-[12px] uppercase`, {
                    fontFamily: FontTheme.font.MontserratRegular
                }]}
            />
        </View>
    );
};

export default SearchTextInput;
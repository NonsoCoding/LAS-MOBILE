import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { Fontisto } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { useColorScheme } from "../useColorScheme";

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

     const colorScheme = useColorScheme();
     const themeColors = Colors[colorScheme ?? "light"];

    return (
        <View style={[tw`rounded-full items-center px-4 gap-2 flex-row border border-gray-200`, {
            backgroundColor: themeColors.textInputBg
        }]}>
            <Fontisto name="search" size={16} color="#19488A" />
            <View style={[tw`border border-[1px] h-5 border-[#19488A22]`]} />
            <TextInput
                placeholder={placeholderText}
                placeholderTextColor={"black"}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
                style={[tw`text-[12px] py-3`, {
                    fontFamily: fontFamily.MontserratEasyRegular
                }]}
            />
        </View>
    );
};

export default SearchTextInput;
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { Image, ImageSourcePropType, TextInput, View } from "react-native";

interface ProfiletextinputProps {
    placeholder: string;
    icon: ImageSourcePropType;
    bgColor?: string;
}

const Profiletextinput = ({placeholder, icon, bgColor = "transparent"}: ProfiletextinputProps) => {
    return (
        <View style={[tw`border flex-1 border-1 flex-row justify-between border-[#19488A33] rounded-full items-center p-4 px-5`, {backgroundColor: bgColor}]}>
            <TextInput
                style={[tw`flex-1 text-xs`, {
                    fontFamily: fontFamily.MontserratEasyRegular
                }]}
                placeholder={placeholder}
                placeholderTextColor={"#19488A88"}
            />
            <Image source={icon} style={[tw`h-4 w-4`]} resizeMode="contain" />
        </View>
    )
}

export default Profiletextinput;
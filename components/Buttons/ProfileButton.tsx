import tw from "@/constants/tailwind";
import { ChevronRight, InfoIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";


interface ProfileButtonProps {
    text: string;
    onPress: () => void;
    bgColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
    borderStrokeColor: string;
}

const ProfileButton = ({text, onPress, bgColor, borderColor, textColor, iconColor, borderStrokeColor}: ProfileButtonProps) => {
    return (
        <TouchableOpacity onPress={() => {
            onPress();
        }}
            style={[tw`flex-row justify-between items-center border border-1 p-4 px-5 rounded-full`, {backgroundColor: bgColor, borderColor: borderColor}]}>
            <View style={[tw`flex-row items-center gap-3 w-[90%]`]}>
            <InfoIcon size={18} color={iconColor}/>
                <View style={[tw`border border-[1px] h-5`, {borderColor: borderStrokeColor}]} />
                <Text style={[tw`uppercase text-xs`, {color: textColor}]}>{text}</Text>
            </View>
            <ChevronRight size={18} color={iconColor}/>
        </TouchableOpacity>
    )
}

export default ProfileButton;
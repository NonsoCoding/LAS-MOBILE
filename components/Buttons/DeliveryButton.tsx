import tw from "@/constants/tailwind";
import { ChevronRight } from "lucide-react-native";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";


interface IDeliveryButtonProps {
    icon: ImageSourcePropType;
    text: string;
    onPress: () => void;
}

const DeliveryButton = ({icon, text, onPress}: IDeliveryButtonProps) => {
    return (
        <TouchableOpacity onPress={() => {
            onPress()
        }}
            style={[tw`flex-row justify-between items-center border border-1 border-[#19488A] p-3 px-5 rounded-full`]}>
            <View style={[tw`flex-row items-center gap-3`]}>
            <Image style={[tw`h-3.5 w-3.5`]} source={icon}/>
                <View style={[tw`border border-[1px] h-5 border-[#19488A22]`]}/>
                <Text style={[tw`uppercase text-xs`]}>{text}</Text>
            </View>
            <ChevronRight size={18}/>
        </TouchableOpacity>
    )
}

export default DeliveryButton
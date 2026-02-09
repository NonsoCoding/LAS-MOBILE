import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface RiderStatsCardProps {
    statsTitle: string;
    amount: number;
    onPress: () => void;
}

const RiderStatsCard = ({statsTitle, amount, onPress}: RiderStatsCardProps) => {
    return (
        <View style={[tw`bg-[#00000011] flex-1 p-4 rounded-lg`]}>
            <View style={[tw`gap-2`]}>
                <Text style={[tw`text-[10px] uppercase`, {
                fontFamily: fontFamily.MontserratEasyMedium
            }]}>{statsTitle}</Text>
                <Text style={[tw`text-2xl uppercase`, {
                fontFamily: fontFamily.MontserratEasyMedium
            }]}>N{amount}</Text>
            </View>
            <TouchableOpacity style={[tw`h-11 w-11 rounded-full items-center justify-center bg-[#00000022] self-end`]} onPress={onPress}>
                <ChevronRight/>
            </TouchableOpacity>
        </View>
    )
}

export default RiderStatsCard;
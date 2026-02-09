import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { Image, ImageSourcePropType, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import TertiaryButton from "../Buttons/TertiaryButtons";

interface CarrierCardIprops {
    image: ImageSourcePropType;
    name: string;
    amount: number;
    carrierType: "Ship" | "Car" | "Rider";
    totalRides: number;
    rating: number;
    time: string;
    acceptOnPress: () => void;
    declineOnPress: () => void;
}

const CarrierCard = ({
    image,
    name,
    amount,
    time,
    carrierType,
    acceptOnPress,
    declineOnPress,
    totalRides,
    rating
}: CarrierCardIprops) => {

    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? "light"];

    return (
        <TouchableOpacity style={[tw`flex-row gap-4 items-center bg-[#FFFFFF99] p-3 rounded-lg`]}>
            <Image source={image} style={[tw`h-20 w-20 rounded-full`]} />
            <View style={[tw`flex-1 gap-1`]}>
                <View style={[tw`flex-row justify-between items-center`]}>
                    <View style={[tw`flex-row gap-2 items-center`]}> 
                        <Text style={[tw`uppercase`, {
                        fontFamily: fontFamily.MontserratEasyBold
                    }]}>{name}</Text>
                    <View style={[tw`border border-[#19488A] h-4`]} />
                        <Text style={[tw`text-xs`, {
                        fontFamily: fontFamily.MontserratEasyMedium
                    }]}>⭐{rating}</Text>
                    </View>
                    <Text style={[tw`text-xl text-[#19488A]`, {
                        fontFamily: fontFamily.MontserratEasyRegular
                    }]}>N{amount}</Text>
                </View>
                <View style={[tw`flex-row items-center justify-between`]}>
                    <View style={[tw`flex-row items-center gap-3`]}>
                    <Text style={[tw`px-5 py-[0.5px] text-white text-xs rounded-full bg-[#19488A]`, {
                        fontFamily: fontFamily.MontserratEasyMedium 
                    }]}>{carrierType}</Text>
                    <Text style={[tw`text-xs`, {
                        fontFamily: fontFamily.MontserratEasyRegular
                    }]}>{totalRides} rides</Text>
                    </View>
                    <Text style={[tw`text-[#19488A77]`, {
                        fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{time}</Text>
                </View>
                <View style={[tw`flex-row justify-between items-center gap-2`]}>
              <TertiaryButton
                borderColor={themeColors.primaryColor}
                borderWidth={1}
                  text="Decline"
                height={30}
                textColor={themeColors.primaryColor}
                        onpress={() => {
                            declineOnPress();
                }}
              />
              <TertiaryButton
                bgColors={themeColors.primaryColor}
                  text="Accept"
                 
                height={30}
                textColor={"white"}
                onpress={() => {
                    acceptOnPress();
                }}
              />
            </View>
            </View>
        </TouchableOpacity>
    )
}

export default CarrierCard
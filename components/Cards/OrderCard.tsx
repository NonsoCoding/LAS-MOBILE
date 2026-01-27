import Colors from "@/constants/Colors";
import { FontTheme } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface OrderCardProps {
  
}

const OrderCard = ({
  
}: OrderCardProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <View style={[tw`bg-[#19488A22] p-5 gap-5 rounded-3`]}>
      <View style={[tw`flex-row justify-between`]}>
        <View style={[tw`gap-1.5`]}>
          <Text style={[tw`text-[10px] uppercase`, {
            fontFamily: FontTheme.font.MontserratMedium
          }]}>Current Shipping</Text>
          <Text style={[tw`uppercase`, {
            fontFamily: FontTheme.font.MontserratBold
          }]}>ID jf2008063g4200</Text>
        </View>
        <TouchableOpacity style={[tw`bg-white rounded-full w-25  items-center h-6.5 justify-center`, ]}>
          <Text style={[tw`text-[10px] uppercase text-[#19488A]`, {
            fontFamily: FontTheme.font.MontserratMedium
          }]}>See details</Text>
        </TouchableOpacity>
      </View>
      <View style={[tw`bg-white w-full h-10 rounded-full`]}>

      </View>
      <View style={[tw`flex-row justify-between`]}>
        <View style={[tw`gap-1.5`]}>
          <Text style={[tw`text-xs`, {
            fontFamily: FontTheme.font.MontserratMedium
          }]}>pick up: 22-01-2025</Text>
          <Text style={[tw``, {
            fontFamily: FontTheme.font.MontserratBold
          }]}>Ikeja, Lagos</Text>
        </View>
        <View style={[tw`gap-1.5`]}>
          <Text style={[tw`text-xs`, {
            fontFamily: FontTheme.font.MontserratMedium
          }]}>pick up: 22-01-2025</Text>
          <Text style={[tw``, {
            fontFamily: FontTheme.font.MontserratBold
          }]}>Ikeja, Lagos</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderCard;

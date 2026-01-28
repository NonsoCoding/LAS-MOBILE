import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface OrderCardProps {
  cardTitle?: string;
  name?: string;
  issuedTo?: string;
  status?: string;
  statusBgColor?: string;
  statusTextColor?: string;
  date?: string;
  onPress?: () => void;
}

const OrderCard = ({
  cardTitle,
  name,
  status,
  statusBgColor,
  statusTextColor,
  date,
  onPress,
}: OrderCardProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <View style={[tw`bg-[#19488A22] p-5 gap-5 rounded-3`]}>
      <View style={[tw`flex-row justify-between`]}>
        <View style={[tw`gap-1.5`]}>
          <Text style={[tw`text-[10px] uppercase`, {
            fontFamily: fontFamily.Medium
          }]}>Current Shipping</Text>
          <Text style={[tw`uppercase`, {
            fontFamily: fontFamily.Bold
          }]}>ID jf2008063g4200</Text>
        </View>
        <TouchableOpacity style={[tw`bg-white rounded-full w-25  items-center h-6.5 justify-center`, ]}>
          <Text style={[tw`text-[10px] uppercase text-[#19488A]`, {
            fontFamily: fontFamily.Medium
          }]}>See details</Text>
        </TouchableOpacity>
      </View>
      <View style={[tw`bg-white w-full h-10 rounded-full`]}>

      </View>
      <View style={[tw`flex-row justify-between`]}>
        <View style={[tw`gap-1.5`]}>
          <Text style={[tw`text-xs`, {
            fontFamily: fontFamily.Medium
          }]}>pick up: 22-01-2025</Text>
          <Text style={[tw``, {
            fontFamily: fontFamily.Bold
          }]}>Ikeja, Lagos</Text>
        </View>
        <View style={[tw`gap-1.5`]}>
          <Text style={[tw`text-xs`, {
            fontFamily: fontFamily.Medium
          }]}>pick up: 22-01-2025</Text>
          <Text style={[tw``, {
            fontFamily: fontFamily.Bold
          }]}>Ikeja, Lagos</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderCard;

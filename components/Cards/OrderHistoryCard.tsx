import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Box } from "lucide-react-native";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface OrderCardProps {
  cardTitle: string;
  orderInfo: string;
  onPress: () => void;
  status: string;
  date: string;
}

const OrderHistoryCard = ({
  cardTitle,
  orderInfo,
  onPress,
  date,
}: OrderCardProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={[
        tw`p-5 rounded-2xl bg-white gap-5`,
        {
          // iOS shadow properties
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          // Android shadow
          elevation: 3,
        },
      ]}
    >
      <View style={[tw`flex-row items-center justify-between`, {}]}>
        <View style={[tw`flex-row items-center flex-1 justify-between`, {}]}>
          <View style={[tw`flex-row items-center gap-4`]}>
            <View
              style={[
                tw`h-13 w-13 rounded-full items-center justify-center`,
                {
                  backgroundColor: themeColors.secondaryLight,
                },
              ]}
            >
              <Box color={themeColors.secondaryColor} />
            </View>
            <View style={[tw`gap-1`]}>
              <Text
                style={[
                  tw` text-xl font-semibold`,
                  {
                    color: "black",
                  },
                ]}
              >
                {cardTitle}
              </Text>
              <Text style={[tw`font-light w-[70%]`]}>{orderInfo}</Text>
              <Text style={[tw`text-black text-gray-600 font-light text-xs`]}>
                {date}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderHistoryCard;

import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Box, Clock } from "lucide-react-native";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface OrderCardProps {
  cardTitle: string;
  name: string;
  issuedTo?: string;
  onPress: () => void;
  status: string;
  statusTextColor: string;
  statusBgColor: string;
  date: string;
}

const OrderCard = ({
  cardTitle,
  name,
  issuedTo,
  onPress,
  status,
  statusBgColor,
  date,
  statusTextColor,
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
          <View style={[tw`flex-row items-center gap-2`]}>
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
            <View>
              <Text
                style={[
                  tw` text-2xl font-semibold`,
                  {
                    color: "black",
                  },
                ]}
              >
                {cardTitle}
              </Text>
              <Text style={[tw`font-light`]}>{name}</Text>
            </View>
          </View>
          <View
            style={[
              tw`py-1 px-3 rounded-full flex-row gap-2 items-center`,
              {
                backgroundColor: statusBgColor || themeColors.secondaryColor,
              },
            ]}
          >
            <Text
              style={[
                tw`text-[11px] font-light`,
                {
                  color: statusTextColor || "#FFAA00",
                },
              ]}
            >
              {status}
            </Text>
            <FontAwesome
              name="circle"
              size={14}
              color={statusTextColor || "#FFAA00"}
            />
          </View>
        </View>
      </View>
      <View style={[tw`flex-row gap-2 items-center`, {}]}>
        {/* <View style={[tw`bg-[#2f95dc22] p-2 rounded-full`]}> */}
        <Clock color={"black"} size={16} />
        {/* </View> */}
        <Text style={[tw`text-black text-gray-600 font-light text-xs`]}>
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

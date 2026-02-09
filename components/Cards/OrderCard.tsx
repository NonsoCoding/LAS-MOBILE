import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface OrderCardProps {
  cardTitle?: string;
  name?: string;
  issuedTo?: string;
  status?: "pending" | "picked" | "in-transit" | "delivered";
  statusBgColor?: string;
  statusTextColor?: string;
  date?: string;
  onPress?: () => void;
}

const OrderCard = ({
  cardTitle,
  name,
  status = "pending",
  statusBgColor,
  statusTextColor,
  date,
  onPress,
}: OrderCardProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  const statuses = [
    { key: "pending", label: "PENDING" },
    { key: "picked", label: "PICKED" },
    { key: "in-transit", label: "IN-TRANSIT" },
    { key: "delivered", label: "DELIVERED" },
  ];

  const getStatusIndex = (currentStatus: string) => {
    return statuses.findIndex(s => s.key === currentStatus);
  };

  const currentStatusIndex = getStatusIndex(status);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`bg-white rounded-2xl p-4 mb-4 bg-[#19488A11]`,
      ]}
    >
      <View style={tw`justify-between flex-row mb-4`}>
        <View style={[tw`gap-2`]}>
        <Text
          style={[
            tw`text-[10px] uppercase`,
            { fontFamily: fontFamily.MontserratEasyRegular },
          ]}
        >
          Current Shipping ID
        </Text>
        <Text
          style={[
            tw`uppercase`,
            { fontFamily: fontFamily.MontserratEasyMedium},
          ]}
        >
          jf2008063g4200
        </Text>
        </View>
      <TouchableOpacity style={tw`mb-6 bg-white rounded-full px-4 py-1`}>
        <Text
          style={[
            tw`text-[10px] text-right uppercase`,
            { color: themeColors.primaryColor, fontFamily: fontFamily.MontserratEasyMedium },
          ]}
        >
          See details
        </Text>
      </TouchableOpacity>
      </View>


      {/* Status Progress Bar */}
      <View style={tw`mb-6 bg-white rounded-full px-4 py-1`}>
        <View style={tw`flex-row justify-between items-center relative h-12`}>
          {statuses.map((statusItem, index) => {
            const isActive = index <= currentStatusIndex;
            const isCurrentStatus = index === currentStatusIndex;

            return (
              <View
                key={statusItem.key}
                style={tw`flex-1 items-center relative`}
              >
                {/* Connecting Line (Left) */}
                {index > 0 && (
                  <View
                    style={[
                      tw`absolute h-0.5 left-0`,
                      {
                        width: "50%",
                        top: 4,
                        backgroundColor: isActive ? themeColors.primaryColor : "#E5E5EA",
                      },
                    ]}
                  />
                )}

                {/* Status Dot */}
                <View
                  style={[
                    tw`w-2 h-2 rounded-full z-10`,
                    {
                      backgroundColor: isActive ? themeColors.primaryColor : "#E5E5EA",
                    },
                  ]}
                />

                {/* Connecting Line (Right) */}
                {index < statuses.length - 1 && (
                  <View
                    style={[
                      tw`absolute h-0.5 right-0`,
                      {
                        width: "50%",
                        top: 4,
                        backgroundColor:
                          index < currentStatusIndex ? themeColors.primaryColor : "#E5E5EA",
                      },
                    ]}
                  />
                )}

                {/* Status Label - Centered under dot */}
                <Text
                  style={[
                    tw`text-[9px] mt-2 text-center`,
                    {
                      color: isActive ? themeColors.primaryColor : "#8E8E93",
                      fontFamily: fontFamily.MontserratEasyMedium,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {statusItem.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={tw`flex-row justify-between`}>
        <View>
          <Text
            style={[
              tw`text-xs mb-1 uppercase`,
              { fontFamily: fontFamily.MontserratEasyRegular },
            ]}
          >
            pick up: 22-01-2025
          </Text>
          <Text
            style={[
              tw`text-sm uppercase`,
              { fontFamily: fontFamily.MontserratEasyMedium },
            ]}
          >
            Ikeja, Lagos
          </Text>
        </View>
        <View style={tw`items-end`}>
          <Text
            style={[
              tw`text-xs mb-1 uppercase`,
              { fontFamily: fontFamily.MontserratEasyRegular },
            ]}
          >
            pick up: 22-01-2025
          </Text>
          <Text
            style={[
              tw`text-sm uppercase`,
              { fontFamily: fontFamily.MontserratEasyMedium },
            ]}
          >
            Ikeja, Lagos
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
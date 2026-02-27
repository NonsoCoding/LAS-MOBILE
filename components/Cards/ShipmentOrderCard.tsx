import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import useShipmentStore from "../store/shipmentStore";

interface ShipmentOrderCardProps {
  cardTitle?: string;
  shippingId?: string;
  pickupLocation?: string;
  destinationLocation?: string;
  pickupDate?: string;
  status?: "pending" | "picked" | "in-transit" | "delivered" | "searching" | "cancelled";
  trackingStatus?: "waiting" | "trackable";
  isAssigned?: boolean;
  statusBgColor?: string;
  statusTextColor?: string;
  onPress?: () => void;
  onTrackPress?: () => void;
  fullData?: any;
}

const ShipmentOrderCard = ({
  cardTitle,
  shippingId,
  pickupLocation,
  destinationLocation,
  pickupDate,
  status = "pending",
  trackingStatus,
  isAssigned = false,
  statusBgColor,
  statusTextColor,
  onPress,
  onTrackPress,
  fullData,
}: ShipmentOrderCardProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const { setSelectedShipment } = useShipmentStore();

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
    <View
      style={[
        tw` rounded-2xl p-4 mb-4 bg-[#19488A22]`, {
         
        }
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
          {cardTitle || "Current Shipping ID"}
        </Text>
        <Text
          style={[
            tw`uppercase`,
            { fontFamily: fontFamily.MontserratEasyMedium},
          ]}
        >
          {shippingId || "NULL"}
        </Text>
        </View>
      <TouchableOpacity 
        onPress={() => setSelectedShipment(fullData)}
        style={tw`mb-6 bg-white rounded-full px-4 py-1.5`}
      >
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
        <View style={tw`flex-1`}>
          <Text
            style={[
              tw`text-xs mb-1 uppercase`,
              { fontFamily: fontFamily.MontserratEasyRegular },
            ]}
          >
            pick up: {pickupDate || "22-01-2025"}
          </Text>
          <Text
            style={[
              tw`text-sm uppercase`,
              { fontFamily: fontFamily.MontserratEasyMedium },
            ]}
            numberOfLines={1}
          >
            {pickupLocation || "Ikeja, Lagos"}
          </Text>
        </View>
        <View style={tw`items-end flex-1`}>
          <Text
            style={[
              tw`text-xs mb-1 uppercase`,
              { fontFamily: fontFamily.MontserratEasyRegular },
            ]}
          >
            destination:
          </Text>
          <Text
            style={[
              tw`text-sm uppercase`,
              { fontFamily: fontFamily.MontserratEasyMedium },
            ]}
            numberOfLines={1}
          >
            {destinationLocation || "Ikeja, Lagos"}
          </Text>
        </View>
      </View>

      {/* Tracking Action */}
      {(trackingStatus === "waiting" && isAssigned === false) && (
        <View style={[tw`flex-row items-center justify-center gap-2 py-3 mt-3 rounded-full border`, { borderColor: "#19488A" }]}>
          <ActivityIndicator size="small" color="#19488A" />
          <Text style={[tw`text-xs`, { fontFamily: fontFamily.MontserratEasyBold, color: "#19488A" }]}>Waiting for carrier...</Text>
        </View>
      )}
      {(trackingStatus === "trackable" || isAssigned === true) && (
        <TouchableOpacity
          onPress={onTrackPress}
          style={[tw`flex-row items-center justify-center gap-2 py-3 mt-3 rounded-full`, { backgroundColor: "#19488A" }]}
        >
          <View style={[tw`w-2 h-2 rounded-full bg-green-400` ]} />
          <Text style={[tw`text-xs text-white`, { fontFamily: fontFamily.MontserratEasyBold }]}>Track Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ShipmentOrderCard;
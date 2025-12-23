import OrderHistoryCard from "@/components/Cards/OrderHistoryCard";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { AlignCenter, ArrowLeft, Bell } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface UserHomePageProps {}

const OrdersScreen = ({}: UserHomePageProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [isEnabled, setIsEnabled] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = useState(false);

  const { user, fetchUserProfile, isAuthenticated } = useAuthStore();

  const OrderList = [
    {
      cardTitle: "Order Created",
      OrderInfo: "Order #233 was created and is awaiting driver acceptance.",
      status: "Pending",
    },
    {
      cardTitle: "Driver Assigned",
      OrderInfo: "Driver John Doe has been assigned to your order.",
      status: "Assigned",
    },
    {
      cardTitle: "Order Accepted",
      OrderInfo: "Driver accepted the order and is heading to pickup location.",
      status: "Accepted",
    },
    {
      cardTitle: "Arrived at Pickup",
      OrderInfo: "Driver has arrived at Danziyal Plaza for package pickup.",
      status: "At Pickup",
    },
    {
      cardTitle: "Package Picked Up",
      OrderInfo:
        "Package collected successfully and en route to delivery location.",
      status: "In Transit",
    },
    {
      cardTitle: "Delivered",
      OrderInfo:
        "Order successfully delivered to Wuse, Central Business District.",
      status: "Delivered",
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch fresh user data when component mounts
      fetchUserProfile().catch(console.error);
    }
  }, [isAuthenticated]);

  const handleAcceptOrder = () => {
    setOrderAccepted(true);
  };

  const handleDeclineOrder = () => {
    console.log("Order declined");
  };

  return (
    <View style={[tw`flex-1`]}>
      <View
        style={[
          tw`h-[30%] rounded-b-[30px]`,
          {
            backgroundColor: themeColors.primaryColor,
          },
        ]}
      >
        <View style={[tw`flex-1 px-5 py-15 justify-between`]}>
          <View style={[tw`flex-row items-center gap-3 justify-between`, {}]}>
            <View style={[tw`flex-row  gap-3 items-center`]}>
              <TouchableOpacity
                style={[
                  tw`p-2.5 rounded-full self-start`,
                  {
                    backgroundColor: themeColors.tintLight,
                  },
                ]}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <AlignCenter color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Bell color={"white"} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                tw`px-3.5 flex-row items-center gap-2 py-1 rounded-full`,
                {
                  backgroundColor: themeColors.tintLight,
                },
              ]}
            >
              <Text style={[tw`text-white text-xs`]}>
                {" "}
                {isOnline ? "ONLINE" : "OFFLINE"}
              </Text>
              <FontAwesome name="circle" size={14} color={"white"} />
            </View>
          </View>
          <View style={[tw`flex-row items-center justify-between`]}>
            <View style={[tw`flex-row items-center gap-3`]}>
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={[
                  tw`h-10 w-10 rounded-full items-center justify-center`,
                  {
                    backgroundColor: themeColors.tintLight,
                  },
                ]}
              >
                <ArrowLeft color={"white"} />
              </TouchableOpacity>
              <Text style={[tw`font-bold text-2xl text-white`]}>
                Order Details
              </Text>
            </View>
            <View
              style={[
                tw`px-3 py-1 rounded-full`,
                {
                  backgroundColor: orderAccepted ? "#27AE6022" : "#F2994A22",
                },
              ]}
            >
              <Text
                style={[
                  tw`text-xs`,
                  { color: orderAccepted ? "#27AE60" : "#F2994A" },
                ]}
              >
                {orderAccepted ? "Accepted" : "Pending"}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[tw`px-5 bottom-8 flex-1`]}>
        <ScrollView showsVerticalScrollIndicator={false} style={[tw`flex-1`]}>
          <View style={[tw`gap-4`, {}]}>
            {OrderList.map((items, index) => {
              return (
                <OrderHistoryCard
                  onPress={() => {}}
                  key={index}
                  cardTitle={items.cardTitle}
                  orderInfo={items.OrderInfo}
                  status=""
                  date="02 Sept, 2022"
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default OrdersScreen;

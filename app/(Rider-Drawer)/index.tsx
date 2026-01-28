import OrderCard from "@/components/Cards/OrderCard";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { AlignCenter, Bell } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface UserHomePageProps {}

const RiderHomePage = ({}: UserHomePageProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [isEnabled, setIsEnabled] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = useState(false);

  const { user, fetchUserProfile, isAuthenticated } = useAuthStore();

  const OrderList = [
    { cardTitle: "Order #123", name: "Godson Ogundare", status: "Delivered" },
    { cardTitle: "Order #123", name: "Godson Ogundare", status: "Delivered" },
    { cardTitle: "Order #123", name: "Godson Ogundare", status: "Delivered" },
    { cardTitle: "Order #123", name: "Godson Ogundare", status: "Delivered" },
    { cardTitle: "Order #123", name: "Godson Ogundare", status: "Delivered" },
    { cardTitle: "Order #123", name: "Godson Ogundare", status: "Delivered" },
    { cardTitle: "Order #123", name: "Godson Ogundare", status: "Delivered" },
    { cardTitle: "Order #123", name: "Godson Ogundare", status: "Delivered" },
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
                  backgroundColor: isOnline
                    ? themeColors.secondaryLight
                    : themeColors.tintLight,
                },
              ]}
            >
              <Text
                style={[
                  tw`text-white text-xs`,
                  {
                    color: isOnline ? themeColors.secondaryColor : "white",
                    fontFamily: fontFamily.Bold
                  },
                ]}
              >
                {" "}
                {isOnline ? "ONLINE" : "OFFLINE"}
              </Text>
              <FontAwesome
                name="circle"
                size={14}
                color={isOnline ? themeColors.secondaryColor : "white"}
              />
            </View>
          </View>
          <View style={[tw`gap-2`]}>
            <View style={[tw`flex-row items-center justify-between`, {}]}>
              <Text style={[tw`text-3xl text-white`, { fontFamily: fontFamily.Bold }]}>
                {user?.full_name}
              </Text>
              <View
                style={[
                  tw`flex-row rounded-2xl p-1.5`,
                  {
                    backgroundColor: themeColors.tintLight,
                  },
                ]}
              >
                <TouchableOpacity
                  style={tw`px-2 py-1 rounded-2xl ${
                    !isOnline ? "bg-white" : ""
                  }`}
                  onPress={() => setIsOnline(false)}
                >
                  <Text
                    style={[tw`text-xs`, {
                      color: !isOnline ? "#CC1A21" : "white",
                      fontFamily: fontFamily.Bold
                    }]}
                  >
                    OFF
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`px-2.5 py-1 rounded-2xl ${
                    isOnline ? "bg-white" : ""
                  }`}
                  onPress={() => setIsOnline(true)}
                >
                  <Text
                    style={[tw`text-xs`, {
                      color: isOnline ? "text-green-700" : "white",
                      fontFamily: fontFamily.Bold
                    }]}
                  >
                    ON
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={[tw`text-white`, { fontFamily: fontFamily.Light }]}>
                Toggle switch to go online
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
                <OrderCard
                  onPress={() => {
                    router.push("/(Rider-Drawer)/orderInfo");
                  }}
                  key={index}
                  cardTitle={items.cardTitle}
                  name={items.name}
                  issuedTo=""
                  status={items.status}
                  statusBgColor={themeColors.secondaryLight}
                  statusTextColor={themeColors.secondaryColor}
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

export default RiderHomePage;

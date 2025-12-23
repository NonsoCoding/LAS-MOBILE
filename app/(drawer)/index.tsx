import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import {
  AlignCenter,
  Bell,
  Book,
  Box,
  Car,
  ChevronRight,
  CreditCard,
  History,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface UserHomePageProps {}

const UserHomePage = ({}: UserHomePageProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [isEnabled, setIsEnabled] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = useState(false);

  const { user, fetchUserProfile, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch fresh user data when component mounts
      fetchUserProfile().catch(console.error);
    }
  }, [isAuthenticated]);

  const buttonList = [
    { name: "Create New Order", icon: <Car /> },
    { name: "Saved Address", icon: <Book /> },
    { name: "Payment Methods", icon: <CreditCard /> },
    { name: "Order History", icon: <History /> },
  ];

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
          <View style={[tw`gap-2`]}>
            <View style={[tw`flex-row items-center justify-between`, {}]}>
              <Text style={[tw`text-3xl font-bold text-white`, {}]}>
                Hey {user?.first_name}!
              </Text>
            </View>
            <View>
              <Text style={[tw`text-white font-light`]}>Welcome back</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[tw`px-5 bottom-8 flex-1`]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[tw`gap-4`]}
          style={[tw`flex-1`]}
        >
          <View
            style={[
              tw`flex-row bg-white p-7 rounded-md justify-between`,
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
            <View>
              <Text
                style={[
                  tw`font-light text-xs`,
                  {
                    color: themeColors.primaryTextColor,
                  },
                ]}
              >
                Active Orders
              </Text>
              <Text
                style={[
                  tw`text-2xl font-semibold`,
                  {
                    color: themeColors.primaryTextColor,
                  },
                ]}
              >
                2
              </Text>
            </View>
            <View
              style={[
                tw`self-start p-2 rounded-full`,
                {
                  backgroundColor: themeColors.tintLight,
                },
              ]}
            >
              <Box color={themeColors.primaryColor} />
            </View>
          </View>
          <View
            style={[
              tw`flex-row p-7 bg-white rounded-md justify-between`,
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
            <View>
              <Text
                style={[
                  tw`font-light text-xs`,
                  {
                    color: "#4CB050",
                  },
                ]}
              >
                Completed Orders
              </Text>
              <Text
                style={[
                  tw`text-2xl font-semibold`,
                  {
                    color: "#4CB050",
                  },
                ]}
              >
                43
              </Text>
            </View>
            <View
              style={[
                tw`self-start p-2 rounded-full`,
                {
                  backgroundColor: "#4CB05033",
                },
              ]}
            >
              <Box color={"#4CB050"} />
            </View>
          </View>
          <View
            style={[
              tw`flex-row bg-white p-7 rounded-md justify-between`,
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
            <View>
              <Text
                style={[
                  tw`font-light text-xs`,
                  {
                    color: "#F2994A",
                  },
                ]}
              >
                Active Orders
              </Text>
              <Text
                style={[
                  tw`text-2xl font-semibold`,
                  {
                    color: "#F2994A",
                  },
                ]}
              >
                153K
              </Text>
            </View>
            <View
              style={[
                tw`self-start p-2 rounded-full`,
                {
                  backgroundColor: "#F2994A33",
                },
              ]}
            >
              <Box color={"#F2994A"} />
            </View>
          </View>
          <View style={[tw`bg-white px-4 rounded-lg`]}>
            {buttonList.map((items, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    tw`py-7 flex-row items-center gap-4 justify-between`,
                    {
                      borderBottomWidth: 0.6,
                      borderColor: "#D3D3D3",
                    },
                  ]}
                >
                  <View style={[tw`flex-row items-center gap-3`, {}]}>
                    <View>{items.icon}</View>
                    <Text style={[tw`font-light`]}>{items.name}</Text>
                  </View>
                  <ChevronRight />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default UserHomePage;

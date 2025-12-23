import StatusModal from "@/components/Modals/StatusModal";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import {
  AlignCenter,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bell,
  Box,
  LocateIcon,
  PhoneCall,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface UserHomePageProps {}

const OrderInfo = ({}: UserHomePageProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [isEnabled, setIsEnabled] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("in-transit");

  const handleStatusChange = (newStatus: string) => {
    console.log("New status selected:", newStatus);
    setCurrentStatus(newStatus);
    // Add your API call or state update logic here
    setModalVisible(false);
  };

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
          tw`h-[27%] rounded-b-[30px]`,
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
      <View style={[tw`px-5 bottom-5 flex-1`]}>
        {!orderAccepted ? (
          // Original content before accepting order
          <ScrollView
            style={[tw`gap-3`]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[tw`gap-4`]}
          >
            <View style={[tw`bg-white p-8 rounded-lg gap-4`]}>
              <View style={[tw`flex-row justify-between items-center`]}>
                <Text style={[tw`text-2xl`, {}]}>Shipper's Details</Text>
                <PhoneCall color={themeColors.primaryColor} />
              </View>
              <View
                style={[
                  tw`border-b`,
                  {
                    borderColor: themeColors.primaryColor,
                  },
                ]}
              />
              <View style={[tw`gap-6`]}>
                <View style={[tw`flex-row gap-2 items-center`, {}]}>
                  <LocateIcon color={themeColors.primaryColor} />
                  <Text style={[tw`font-light text-[16px] w-[95%]`, {}]}>
                    Danziyal Plaza, Olusegun Obasanjo Way, Central Business
                    District
                  </Text>
                </View>
                <View style={[tw`flex-row gap-2 items-center`, {}]}>
                  <Box color={themeColors.primaryColor} />
                  <Text style={[tw`font-light text-[16px]`, {}]}>
                    Product 01 ~ Leg wammer
                  </Text>
                </View>
                <View style={[tw`flex-row gap-2 items-center`, {}]}>
                  <Banknote color={themeColors.primaryColor} />
                  <Text style={[tw`font-light text-[16px]`, {}]}>₦ 2000</Text>
                </View>
              </View>
            </View>
            <View
              style={[
                tw`flex-row items-center bg-white p-5 rounded-lg justify-between`,
              ]}
            >
              <Text style={[tw`text-xl font-semibold`]}>View Map</Text>
              <TouchableOpacity
                style={[
                  tw`rounded-full h-10 w-10 items-center justify-center`,
                  {
                    backgroundColor: themeColors.primaryColor,
                  },
                ]}
              >
                <ArrowRight color={"white"} />
              </TouchableOpacity>
            </View>
            <View style={[tw`gap-3 bg-white p-5 rounded-lg`]}>
              <View style={[tw`gap-1`]}>
                <View style={[tw`flex-row justify-between items-center`]}>
                  <View style={[tw`flex-row items-center gap-2`]}>
                    <LocateIcon color={themeColors.primaryColor} />
                    <Text style={[tw`font-light text-[16px]`]}>
                      Pick Up Location
                    </Text>
                  </View>
                  <ArrowDown color={themeColors.primaryColor} />
                </View>
                <View
                  style={[
                    tw``,
                    {
                      borderBottomWidth: 0.7,
                      borderColor: themeColors.primaryColor,
                    },
                  ]}
                />
              </View>
              <Text style={[tw`font-light text-[16px]`]}>
                Danziyal Plaza, Olusegun Obasanjo Way, Central Business District
              </Text>
            </View>
            <View style={[tw`gap-3 bg-white p-5 rounded-lg`]}>
              <View style={[tw`gap-1`]}>
                <View style={[tw`flex-row justify-between items-center`]}>
                  <View style={[tw`flex-row items-center gap-2`]}>
                    <LocateIcon color={themeColors.primaryColor} />
                    <Text style={[tw`font-light text-[16px]`]}>
                      Delivery Location
                    </Text>
                  </View>
                  <ArrowDown color={themeColors.primaryColor} />
                </View>
                <View
                  style={[
                    tw``,
                    {
                      borderBottomWidth: 0.7,
                      borderColor: themeColors.primaryColor,
                    },
                  ]}
                />
              </View>
              <Text style={[tw`font-light text-[16px]`]}>
                Wuse, Central Business District, Abuja
              </Text>
            </View>
          </ScrollView>
        ) : (
          // New content after accepting order
          <ScrollView
            style={[tw`gap-3`]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[tw`gap-4`]}
          >
            <View style={[tw`bg-white p-8 rounded-lg gap-4`]}>
              <View style={[tw`flex-row justify-between items-center`]}>
                <Text style={[tw`text-2xl`, {}]}>Shipper's Details</Text>
                <PhoneCall color={themeColors.primaryColor} />
              </View>
              <View
                style={[
                  tw`border-b`,
                  {
                    borderColor: themeColors.primaryColor,
                  },
                ]}
              />
              <View style={[tw`gap-6`]}>
                <View style={[tw`flex-row gap-2 items-center`, {}]}>
                  <LocateIcon color={themeColors.primaryColor} />
                  <Text style={[tw`font-light text-[16px] w-[95%]`, {}]}>
                    Danziyal Plaza, Olusegun Obasanjo Way, Central Business
                    District
                  </Text>
                </View>
                <View style={[tw`flex-row gap-2 items-center`, {}]}>
                  <Box color={themeColors.primaryColor} />
                  <Text style={[tw`font-light text-[16px]`, {}]}>
                    Product 01 ~ Leg wammer
                  </Text>
                </View>
                <View style={[tw`flex-row gap-2 items-center`, {}]}>
                  <Banknote color={themeColors.primaryColor} />
                  <Text style={[tw`font-light text-[16px]`, {}]}>₦ 2000</Text>
                </View>
              </View>
            </View>
            <View>
              <ImageBackground
                source={require("../../assets/images/IntroImages/maps1.png")}
                style={[tw`h-30 rounded-lg overflow-hidden`]}
              >
                {/* Dark overlay */}
                <View
                  style={[
                    tw`absolute inset-0 bg-black`,
                    {
                      opacity: 0.4, // Adjust this value: 0.3 for lighter, 0.5 for darker
                    },
                  ]}
                />

                {/* Content */}
                <View style={[tw`flex-1 items-center gap-2 justify-center`]}>
                  <TouchableOpacity
                    style={[
                      tw`rounded-full h-10 w-10 items-center justify-center`,
                      {
                        backgroundColor: themeColors.primaryColor,
                      },
                    ]}
                  >
                    <ArrowRight color={"white"} />
                  </TouchableOpacity>
                  <Text style={[tw`font-light text-xl`]}>Live Tracking</Text>
                </View>
              </ImageBackground>
            </View>
            <View style={[tw`bg-white p-8 rounded-lg gap-4`]}>
              <Text style={[tw`text-xl font-semibold`]}>Order Summary</Text>
              <View
                style={[
                  tw`border-b`,
                  {
                    borderColor: themeColors.primaryColor,
                  },
                ]}
              />
              <View style={[tw`gap-4`]}>
                <View style={[tw`flex-row gap-2 items-center`]}>
                  <Box color={themeColors.primaryColor} />
                  <Text style={[tw`font-light text-[16px]`]}>
                    Product 01 ~ Leg wammer
                  </Text>
                </View>
                <View style={[tw`flex-row gap-2 items-center`]}>
                  <Banknote color={themeColors.primaryColor} />
                  <Text style={[tw`font-light text-[16px]`]}>₦ 2000</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                tw`flex-row items-center bg-white p-5 rounded-lg justify-between`,
              ]}
            >
              <Text style={[tw`text-xl font-semibold`]}>
                View Order history
              </Text>
              <View
                style={[
                  tw`rounded-full h-10 w-10 items-center justify-center`,
                  {
                    backgroundColor: themeColors.primaryColor,
                  },
                ]}
              >
                <ArrowRight color={"white"} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
      <View
        style={[
          tw`flex-row w-[100%] px-6 pb-10 gap-3 pt-7`,
          {
            backgroundColor: "white",
          },
        ]}
      >
        {!orderAccepted ? (
          <>
            <TouchableOpacity
              onPress={handleAcceptOrder}
              style={[
                tw`flex-1 h-12 justify-center rounded-full items-center`,
                {
                  backgroundColor: themeColors.primaryColor,
                },
              ]}
            >
              <Text style={[tw`text-white`]}>Accept Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={[
                tw`w-12 justify-center rounded-full items-center`,
                {
                  backgroundColor: "#BF161633",
                },
              ]}
            >
              <X color={"#CC1A21"} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={[tw`flex-row flex-1 items-center`]}>
            <View style={[tw`flex-1`]}>
              <Text style={[tw`font-semibold text-xl`]}>Order Status</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                // Navigate to delivery/tracking screen
                console.log("Proceed to delivery");
              }}
              style={[
                tw`h-12 w-12 justify-center rounded-full items-center`,
                {
                  backgroundColor: themeColors.tintLight,
                },
              ]}
            >
              <ArrowDown color={themeColors.primaryColor} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <StatusModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentStatus={currentStatus}
        onStatusChange={handleStatusChange}
      />
    </View>
  );
};

export default OrderInfo;

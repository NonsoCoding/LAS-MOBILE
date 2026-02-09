import OrderCard from "@/components/Cards/OrderCard";
import SearchTextInput from "@/components/Inputs/SearchTextInput";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import {
  Book,
  Car,
  CreditCard,
  History
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
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

  const orderHistory = [
    {id: "id jf2008063g4200", name: "Electronics", state: "In-transit"},
    {id: "id jf2008063g4200", name: "Electronics", state: "In-transit"},
    {id: "id jf2008063g4200", name: "Electronics", state: "In-transit"},
  ]

  const handleAcceptOrder = () => {
    setOrderAccepted(true);
  };

  const handleDeclineOrder = () => {
    console.log("Order declined");
  };

  return (
    <View style={[tw`flex-1 bg-[#19488A] justify-end`, {
    }]}>
      <View style={[tw`flex-row items-center p-5 justify-between`]}>
        <View style={[tw`items-center flex-row gap-3`]}>
        <Image style={[tw`h-13 w-13`]} source={require("../../assets/images/IntroImages/profile.png")} />
        <View>
          <Text style={[tw`uppercase text-[15px] text-white`, {
            fontFamily: fontFamily.Bold
          }]}>Welcome, Godson</Text>
          <View style={[tw`flex-row gap-1 items-center`]}>
            <Feather name="map-pin" color={"white"} size={13} />
              <Text style={[tw`text-white text-xs`, {
            fontFamily: fontFamily.Medium
          }]}>Gwarimpa first avenue</Text>
          </View>
        </View>
        </View>
        <TouchableOpacity style={[tw`h-10 w-10 bg-white rounded-full items-center justify-center`]}>
          <AntDesign name="bell" size={20} color={themeColors.primaryColor} />
        </TouchableOpacity>
      </View>
      <View style={[tw`h-[80%] bg-white rounded-t-5 gap-7 p-5`]}>
        <SearchTextInput
                    placeholderText='TRACK YOUR SHIPMENT'
                  />
        <OrderCard/>
       <View>
        <View style={[tw`flex-row justify-between items-center`]}>
            <Text style={[tw`uppercase`, {
              fontFamily: fontFamily.Bold
            }]}>Recent Activities</Text>
               <TouchableOpacity style={[tw`bg-[#19488A22] rounded-full w-20  items-center h-6.5 justify-center`, ]}>
          <Text style={[tw`text-[10px] uppercase text-[#19488A]`, {
            fontFamily: fontFamily.Medium
          }]}>See all</Text>
        </TouchableOpacity>
        </View>
        </View>
        <View style={[tw`gap-10`]}>
          {orderHistory.map((item, index) => {
            return (
              <View key={index} style={[tw`flex-row justify-between`]}>
                <View style={tw`gap-3`}>
                  <Text style={[tw`uppercase`, {
                    fontFamily: fontFamily.Bold
                  }]}>{item.id}</Text>
                  <Text style={[tw`uppercase text-[10px] text-[#19488A]`, {
                      fontFamily: fontFamily.Medium
                  }]}>{item.name}</Text>
                </View>
                <Text style={[tw`uppercase text-[10px] text-[#19488A]`, {
                    fontFamily: fontFamily.Medium
                }]}>{item.state}</Text>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  );
};

export default UserHomePage;

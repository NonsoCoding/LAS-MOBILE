import TertiaryButton from "@/components/Buttons/TertiaryButtons";
import RiderStatsCard from "@/components/Cards/RiderStatsCard";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { AlignCenter, ChevronRight, GiftIcon, InfoIcon } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface UserHomePageProps {}

const RiderHomePage = ({}: UserHomePageProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const snapPoints = useMemo(() => ["10%", "45%"], []);
  const themeColors = Colors[colorScheme ?? "light"];
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isEnabled, setIsEnabled] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { user, fetchUserProfile, isAuthenticated } = useAuthStore();


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
    <View style={[tw`flex-1 justify-end`, {
      backgroundColor: themeColors.background
    }]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={[tw`flex-1`]}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
        coordinate={{
          latitude: 37.78825,
          longitude: -122.4324
        }}
        />
        <TouchableOpacity
                style={[
                  tw`p-2.5 rounded-full self-start ml-5 mt-15`,
                  {
                    backgroundColor: themeColors.background,
                  },
                ]}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <AlignCenter color={"black"} />
              </TouchableOpacity>
      </MapView>
      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
      >
          <BottomSheetView style={[tw`px-5 justify-center pb-10`]}
        >
          {step === 1 && (
            <View style={[tw`gap-4`]}> 
               <View style={[tw`flex-row rounded-lg gap-3 p-4 py-6 justify-between items-center bg-[#D37A0F22]`, {
                borderLeftWidth: 3,
                borderColor: "#D37A0F"
              }]}>
                <View style={[tw`flex-row items-center w-[70%] gap-2`]}>
                <InfoIcon color={"#D37A0F"}  />
                <Text style={[tw`text-[#D37A0F] uppercase text-[11px]`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>Visit your profile to complete your registration</Text>
                </View>
                <TouchableOpacity style={[tw`bg-[#D37A0F99] h-9 w-9 rounded-full flex-row items-center justify-center`]}>
                  <ChevronRight size={16} color={"white"}/>
                </TouchableOpacity>
              </View>
              <View style={[tw`flex-row items-center justify-between`]}>
                <View style={[tw`flex-row gap-4 items-center`]}>
                <View style={[tw`h-12 w-12 rounded-full bg-[#19488A] flex-row items-center justify-center`]}>
                  <GiftIcon color={"white"}/>
                </View>
                  <View>
                    <View style={[tw`flex-row items-end`]}>
                    <Text style={[tw`uppercase text-[12px]`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>Earn N</Text>
                    <Text style={[tw`uppercase`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>20,000</Text>
                    </View>
                    <Text style={[tw`text-[11px]`, {
                    fontFamily: fontFamily.MontserratEasyRegular
                  }]}>Invite your friends (the more the merrier)</Text>
                </View>
                </View>
                <TouchableOpacity>
                  <ChevronRight/>
                </TouchableOpacity>
              </View>
              <View style={[tw`flex-row gap-3`]}>
                <RiderStatsCard
                  statsTitle="Total Earnings"
                  amount={4000}
                  onPress={() => {
                    
                  }}
                />
                <RiderStatsCard
                  statsTitle="Total Request"
                  amount={254}
                  onPress={() => {

                  }}
                />
              </View>
              <TertiaryButton
                text="You are offline"

                onpress={() => {

                }}
                height={50}
                disabled={false}
                bgColors="#D37A0F22"
                textColor="#D37A0F"
              />
            </View>
          )}
        </BottomSheetView>
        </BottomSheet>
    </View>
  );
};

export default RiderHomePage;

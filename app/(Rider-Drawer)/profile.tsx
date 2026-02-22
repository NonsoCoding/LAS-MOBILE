import DeliveryButton from "@/components/Buttons/DeliveryButton";
import TertiaryButton from "@/components/Buttons/TertiaryButtons";
import RiderStatsCard from "@/components/Cards/RiderStatsCard";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { AlignCenter, BellIcon, ChevronRight, InfoIcon, MapPin } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import tw from "twrnc";



const ProfileScreen = () => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const colorScheme = useColorScheme();
    const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ["10%", "45%"], []);
  const themeColors = Colors[colorScheme ?? "light"];
      const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const navigation = useNavigation();
  const { user, fetchUserProfile, isAuthenticated } = useAuthStore();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const navRoute = [
    { title: "View wallet", route: "/screens/Rider/CompleteProfile" },
    { title: "Basic Information", route: "/screens/Rider/CompleteProfile" },
    { title: "Vehicle Information", route: "/screens/Rider/CompleteProfile" },
    { title: "Support", route: "/screens/Rider/CompleteProfile" }
  ] as const;

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile().catch(console.error);
    }
  }, [isAuthenticated]);

  const MenuItem = ({ icon, title, color = "#000" }: any) => (
    <TouchableOpacity
      style={tw`flex-row items-center justify-between py-4 px-5 border-b border-gray-100`}
    >
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-xl mr-3`}>{icon}</Text>
        <Text style={tw`text-base font-medium`}>{title}</Text>
      </View>
      <Text style={tw`text-2xl text-gray-300`}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        tw`flex-1 bg-blue-500`,
      ]}
    >
      <MapView style={[tw`flex-1`]}
          provider={PROVIDER_GOOGLE}
  ref={mapRef}
  region={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  showsUserLocation={true}
  showsMyLocationButton={false} // Custom button looks better
  showsPointsOfInterest={false} // Cleaner for logistics
  showsBuildings={false} // Less visual clutter
  showsIndoors={false}
  showsCompass={false} // Use custom compass
  showsScale={false}
  mapType="standard"
  rotateEnabled={true}
  pitchEnabled={false} // Keep 2D for logistics clarity
  toolbarEnabled={false}
  loadingEnabled={true}
  loadingIndicatorColor="#yourBrandColor"
  loadingBackgroundColor="#ffffff"
      >
        <Marker
           coordinate={{
          latitude: 37.78825,
          longitude: -122.4324
        }}
          title="Current Location"
          description="You are here"
        />

      </MapView>
       <TouchableOpacity
                style={[
                  tw`p-2.5 absolute left-5 top-15 rounded-full self-start`,
                  {
                    backgroundColor: themeColors.background,
                  },
                ]}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <AlignCenter color={themeColors.primaryColor} />
        </TouchableOpacity>
      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
      >
          <BottomSheetView style={[tw`justify-center pb-10`]}
        >
          {step === 1 && (
            <View style={[tw`gap-5`]}>
              <View style={[tw`py-5 px-4 justify-center`, {
                backgroundColor: themeColors.primaryColor,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }]}>
                <View style={[tw`flex-row justify-between items-center`]}>
                  <View style={[tw`flex-row items-center gap-3`]}>
                <Image source={require("../../assets/images/pfp.png")} style={[tw`h-16 w-16 rounded-full`]}/>
                <View style={[tw``]}>
                      <Text style={[tw`uppercase text-white`, {
                      fontFamily: fontFamily.MontserratEasyBold
                    }]}>Welcome, {user?.first_name || "User"}</Text>
                    <View style={[tw`flex-row items-center gap-1`]}>
                      <MapPin size={12} color={"white"}/>
                  <Text style={[tw`text-white uppercase text-[10px]`]}>{user?.phone_number || "No location available"}</Text>
                    </View>
                  </View>
                  </View>
                  <TouchableOpacity onPress={() => {
                    router.navigate("/(Rider-Drawer)/notification")
                  }} style={[tw`h-12 w-12 rounded-full flex-row items-center justify-center bg-white`]}>
                    <BellIcon/>
                  </TouchableOpacity>
                </View>
              </View>
            <View style={[tw`gap-4 px-4`]}> 
                <View style={[tw`flex-row rounded-lg gap-3 p-4 py-6 justify-between items-center bg-[#D37A0F22]`, {
                  borderLeftWidth: 3,
                  borderColor: user?.profile_review_status === "under_review" ? "#10B981" : "#D37A0F",
                  backgroundColor: user?.profile_review_status === "under_review" ? "#10B98122" : "#D37A0F22"
                }]}>
                  <View style={[tw`flex-row items-center w-[70%] gap-2`]}>
                  <InfoIcon color={user?.profile_review_status === "under_review" ? "#10B981" : "#D37A0F"} />
                  <Text style={[tw`uppercase text-[11px]`, {
                    fontFamily: fontFamily.MontserratEasyMedium,
                    color: user?.profile_review_status === "under_review" ? "#10B981" : "#D37A0F"
                  }]}>
                    {user?.profile_review_status === "under_review" ? "Submitted Documents Under Review" : "Visit your profile to complete your registration"}
                  </Text>
                  </View>
                    <TouchableOpacity
                      onPress={() => {
                        router.navigate("/screens/Rider/CompleteProfile")
                    }}
                      style={[tw`h-9 w-9 rounded-full flex-row items-center justify-center`, {
                        backgroundColor: user?.profile_review_status === "under_review" ? "#10B98199" : "#D37A0F99"
                      }]}>
                    <ChevronRight size={16} color={"white"}/>
                  </TouchableOpacity>
                </View>
             
              <View style={[tw`flex-row gap-3`]}>
                <RiderStatsCard
                  statsTitle="Total Earnings"
                  amount={4000}
                  onPress={() => {
                    router.navigate("/screens/Rider/CompleteProfile")
                  }}
                />
                <RiderStatsCard
                  statsTitle="Total Request"
                  amount={254}
                  onPress={() => {

                  }}
                />
              </View>
              
                <View style={[tw`gap-3`]}>
                  {navRoute.map((item, index) => {
                    return (
                      <DeliveryButton
                        key={index}
                            icon={require("../../assets/images/IntroImages/icon/Details.png")}
                            text={item.title}
                        onPress={() => {
                          router.navigate(item.route);
                            }}
                          />
                 )
               })}
                </View>
                <TertiaryButton
                text="Logout"
                onpress={() => {

                }}
                height={50}
                disabled={false}
                bgColors="#CC1A2122"
                textColor="#CC1A21"
              />
              </View>
            </View>
          )}
        </BottomSheetView>
        </BottomSheet>
    </View>
  );
};

export default ProfileScreen;

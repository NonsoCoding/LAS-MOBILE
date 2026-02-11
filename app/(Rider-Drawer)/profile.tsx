import DeliveryButton from "@/components/Buttons/DeliveryButton";
import TertiaryButton from "@/components/Buttons/TertiaryButtons";
import RiderStatsCard from "@/components/Cards/RiderStatsCard";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { BellIcon, ChevronRight, InfoIcon, MapPin } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import tw from "twrnc";

const ProfileScreen = () => {
  const [isOnline, setIsOnline] = useState(false);
  const colorScheme = useColorScheme();
  const snapPoints = useMemo(() => ["10%", "45%"], []);
  const themeColors = Colors[colorScheme ?? "light"];
      const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const navigation = useNavigation();
  const { user, fetchUserProfile, isAuthenticated } = useAuthStore();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const pprofileButtons = [
    {name}
  ]

  return (
    <View
      style={[
        tw`flex-1 bg-blue-500`,
      ]}
    >
      <MapView style={[tw`flex-1`]}
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
          title="Current Location"
          description="You are here"
        />

      </MapView>
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
                    }]}>Welcome, Godson</Text>
                    <View style={[tw`flex-row items-center gap-1`]}>
                      <MapPin size={12} color={"white"}/>
                  <Text style={[tw`text-white uppercase text-[10px]`]}>Gwarimpa first avenu</Text>
                    </View>
                  </View>
                  </View>
                  <TouchableOpacity style={[tw`h-12 w-12 rounded-full flex-row items-center justify-center bg-white`]}>
                    <BellIcon/>
                  </TouchableOpacity>
                </View>
              </View>
            <View style={[tw`gap-4 px-4`]}> 
               <View style={[tw`flex-row rounded-lg gap-3 p-4 py-6 justify-between items-center bg-[#D37A0F22]`, {
                borderLeftWidth: 3,
                borderColor: "#D37A0F"
              }]}>
                <View style={[tw`flex-row items-center w-[70%] gap-2`]}>
                <InfoIcon color={"#D37A0F"} />
                <Text style={[tw`text-[#D37A0F] uppercase text-[11px]`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>Visit your profile to complete your registration</Text>
                </View>
                <TouchableOpacity style={[tw`bg-[#D37A0F99] h-9 w-9 rounded-full flex-row items-center justify-center`]}>
                  <ChevronRight size={16} color={"white"}/>
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
              
                <View style={[tw`gap-3`]}>
                <DeliveryButton
                      icon={require("../../assets/images/IntroImages/icon/Details.png")}
                      text="View Wallet"
                  onPress={() => {
                    
                      }}
                    />
                <DeliveryButton
                      icon={require("../../assets/images/IntroImages/icon/Details.png")}
                      text="Basic Information"
                  onPress={() => {
                    
                      }}
                    />
                <DeliveryButton
                      icon={require("../../assets/images/IntroImages/icon/Details.png")}
                      text="Vehicle Information"
                  onPress={() => {
                    
                      }}
                    />
                <DeliveryButton
                      icon={require("../../assets/images/IntroImages/icon/Details.png")}
                      text="Support"
                  onPress={() => {
                    
                      }}
                    />
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

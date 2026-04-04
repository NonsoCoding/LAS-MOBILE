import RiderStatsCard from "@/components/Cards/RiderStatsCard";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { AlignCenter } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import tw from "twrnc";

const WalletScreen = () => {
  const [isOnline, setIsOnline] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
    const snapPoints = useMemo(() => ["10%", "45%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [step, setStep] = useState(1);

  return (
   <View style={[tw`flex-1 justify-end`, {
         backgroundColor: themeColors.background
       }]}>
         <MapView
           provider={PROVIDER_GOOGLE}
     ref={mapRef}
     style={[tw`flex-1`]}
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
           >
           </Marker>
      </MapView>
        <TouchableOpacity
                style={[
                  tw`p-2.5 absolute rounded-full self-start ml-5 top-15`,
                  {
                    backgroundColor: themeColors.background,
                  },
                ]}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <AlignCenter color={"black"} />
      </TouchableOpacity>
       <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
      >
          <BottomSheetView style={[tw`px-5 justify-center pb-10`]}
        >
          {step === 1 && (
            <View style={[tw`gap-4`]}> 
                {/* <View style={[tw`flex-row rounded-lg gap-3 p-4 py-6 justify-between items-center bg-[#D37A0F22]`, {
                  borderLeftWidth: 3,
                  borderColor: user?.profile_review_status === "under_review" ? "#10B981" : "#D37A0F",
                  backgroundColor: user?.profile_review_status === "under_review" ? "#10B98122" : "#D37A0F22"
                }]}>
                  <View style={[tw`flex-row items-center w-[70%] gap-2`]}>
                  <InfoIcon color={user?.profile_review_status === "under_review" ? "#10B981" : "#D37A0F"}  />
                  <Text style={[tw`uppercase text-[11px]`, {
                    fontFamily: fontFamily.MontserratEasyMedium,
                    color: user?.profile_review_status === "under_review" ? "#10B981" : "#D37A0F"
                  }]}>
                    {user?.profile_review_status === "under_review" ? "Submitted Documents Under Review" : "Visit your profile to complete your registration"}
                  </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => router.navigate("/screens/Rider/CompleteProfile")}
                    style={[tw`h-9 w-9 rounded-full flex-row items-center justify-center`, {
                      backgroundColor: user?.profile_review_status === "under_review" ? "#10B98199" : "#D37A0F99"
                    }]}>
                    <ChevronRight size={16} color={"white"}/>
                  </TouchableOpacity>
                </View> */}
              <View style={[tw`h-35 rounded-lg bg-[#003B95] p-4 justify-between`]}>
                <View style={[tw`flex-row items-center justify-between gap-2`]}>
                  <Image source={require("../../assets/images/LasIconpng.png")} style={[tw`h-10 w-10`]} />
                  <Text style={[tw`text-white uppercase`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>Godson Ogundare</Text>
                </View>
                <View>
                  <Text style={[tw`text-white text-[10px] uppercase`, {
                    fontFamily: fontFamily.MontserratEasyLight
                  }]}>Available Balance</Text>
                  <View style={[tw`flex-row items-end`]}>
                    <Text style={[tw`text-white text-xl uppercase`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>N</Text>
                  <Text style={[tw`text-white text-3xl uppercase`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>4000</Text>
                  </View>
                </View>
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
              {/* <TertiaryButton
                text={isOnline ? "You are online" : "You are offline"}
                onpress={handleToggleStatus}
                height={50}
                disabled={false}
                bgColors={isOnline ? "#10B98122" : "#D37A0F22"}
                textColor={isOnline ? "#10B981" : "#D37A0F"}
              /> */}
            </View>
          )}
        </BottomSheetView>
        </BottomSheet>
        </View>
  );
};

export default WalletScreen;

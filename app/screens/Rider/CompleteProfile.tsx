import BackButton from "@/components/Buttons/BackButton";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import ProfileButton from "@/components/Buttons/ProfileButton";
import Profiletextinput from "@/components/Inputs/Profiletextinput";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { BellIcon, CarFront, Check, MapPin, Scooter, Van } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

type SheetSection =
  | "basic_information"
  | "vehicle_information"
  | "vehicle_photos"
  | "drivers_license"
  | "insurance_certificate"
  | null;

interface CompleteProfileProps {}

const CompleteProfile = ({}: CompleteProfileProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ["50%"], []);
  const detailSheetSnapPoints = useMemo(() => ["85%"], []);
  const continueSheetSnapPoints = useMemo(() => ["85%"], []);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeSheet, setActiveSheet] = useState<SheetSection>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const detailSheetRef = useRef<BottomSheet>(null);
  const continueSheetRef = useRef<BottomSheet>(null);
  const { user, fetchUserProfile, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
      if (isAuthenticated) {
        fetchUserProfile().catch(console.error);
      }
    }, [isAuthenticated]);
  

  const profileButtons = [
    {
      title: "Basic Information",
      key: "basic_information" as SheetSection,
      bgColor: "#D37A0F11",
      borderColor: "#D37A0F",
      textColor: "#D37A0F",
      iconColor: "#D37A0F",
      borderStrokeColor: "#D37A0F22",
    },
    {
      title: "Vehicle Information",
      key: "vehicle_information" as SheetSection,
      bgColor: "#D37A0F11",
      borderColor: "#D37A0F",
      textColor: "#D37A0F",
      iconColor: "#D37A0F",
      borderStrokeColor: "#D37A0F22",
    },
    {
      title: "Vehicle Photos",
      key: "vehicle_photos" as SheetSection,
      bgColor: "#D37A0F11",
      borderColor: "#D37A0F",
      textColor: "#D37A0F",
      iconColor: "#D37A0F",
      borderStrokeColor: "#D37A0F22",
    },
    {
      title: "Drivers License",
      key: "drivers_license" as SheetSection,
      bgColor: "#D37A0F11",
      borderColor: "#D37A0F",
      textColor: "#D37A0F",
      iconColor: "#D37A0F",
      borderStrokeColor: "#D37A0F22",
    },
    {
      title: "Insurance Certificate",
      key: "insurance_certificate" as SheetSection,
      bgColor: "#D37A0F11",
      borderColor: "#D37A0F",
      textColor: "#D37A0F",
      iconColor: "#D37A0F",
      borderStrokeColor: "#D37A0F22",
    },
  ];

  const openDetailSheet = useCallback((section: SheetSection) => {
    setActiveSheet(section);
    bottomSheetRef.current?.close();
    detailSheetRef.current?.expand();
  }, []);

  const closeDetailSheet = useCallback(() => {
    detailSheetRef.current?.close();
    setActiveSheet(null);
    bottomSheetRef.current?.expand();
  }, []);

  const openContinueSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    continueSheetRef.current?.expand();
  }, []);

  const closeContinueSheet = useCallback(() => {
    continueSheetRef.current?.close();
    bottomSheetRef.current?.expand();
  }, []);

  const getSheetTitle = (section: SheetSection): string => {
    switch (section) {
      case "basic_information":
        return "Basic Information";
      case "vehicle_information":
        return "Vehicle Information";
      case "vehicle_photos":
        return "Vehicle Photos";
      case "drivers_license":
        return "Drivers License";
      case "insurance_certificate":
        return "Insurance Certificate";
      default:
        return "";
    }
  };

  const vehicleTypes = [
    {name: "Bike", icon: <Scooter color={themeColors.primaryColor} size={50}/>},
    {name: "Car", icon: <CarFront color={themeColors.primaryColor} size={50}/>},
    {name: "Van", icon: <Van color={themeColors.primaryColor} size={50}/>},
  ]

  const vehiclePics = [
    { name: "FrontView", img: require("../../../assets/images/IntroImages/icon/img-box.png") },
    { name: "BackView", img: require("../../../assets/images/IntroImages/icon/img-box.png") },
    { name: "LeftView", img: require("../../../assets/images/IntroImages/icon/img-box.png") },
    { name: "RightView", img: require("../../../assets/images/IntroImages/icon/img-box.png") }
  ];

  const vehicleRequirements = [
    { name: "Valid drivers licence (not expired)" },
    { name: "Clear & readable text" },
    { name: "All corners should be visible" },
    {name: "No glare"}
  ]

  const insuranceRequirements = [
    { name: "Valid insurance required by law" },
  ]

  const reviewProcess = [
    { name: "Document Verification" },
    { name: "Background check" },
    { name: "Final approval" },
  ]

  const renderDetailContent = (section: SheetSection) => {
    switch (section) {
      case "basic_information":
        return <View style={[tw``]}>
          <View style={[tw`gap-2 pb-10`]}>
          <Profiletextinput
            placeholder={user?.first_name + " " + user?.last_name as string}
            bgColor="#19488A11"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          <Profiletextinput
            placeholder={user?.email as string}
            bgColor="#19488A11"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          <Profiletextinput
            placeholder={user?.phone_number as string}
            bgColor="#19488A11"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          <Profiletextinput
            placeholder="Chnage Password"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          <Profiletextinput
            placeholder="NIN"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          <Profiletextinput
            placeholder="BVN"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          </View>
          <PrimaryButton
            text="Continue"
            onpress={() => {
              closeDetailSheet();
            }}
            bgColors="#19488A"
            textColor="#FFFFFF"
            height={50}
          />
        </View>;
      case "vehicle_information":
        return <View style={[tw``]}>
          <View style={[tw`gap-5`]}>
            <Text style={[tw``, {
              fontFamily: fontFamily.MontserratEasyMedium
            }]}>Select Vehicle Type</Text>
            <View style={[tw`flex-row justify-between gap-4`]}>
              {vehicleTypes.map((item, index) => (
                <TouchableOpacity key={index}
                  style={[tw`flex-1 gap-4 items-center justify-center h-25 border border-1 border-[#19488A33] rounded-lg`]}
                  onPress={() => {
                    
                  }}
                >
                  {item.icon}
                  <Text style={[tw`uppercase text-[#19488A]`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[tw`gap-10`]}>
              <View style={[tw`gap-2`]}>
               <Profiletextinput
                icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
                placeholder="Vehicle Make"
              />
               <Profiletextinput
                icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
                placeholder="Vehicle Model"
              />
              <View style={[tw`flex-row gap-2`]}>
              <Profiletextinput
                icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
                  placeholder="Year"

              />
              <Profiletextinput
                icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
                placeholder="Make"
                />
              </View>
               <Profiletextinput
                icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
                placeholder="Color"
              />
              </View>
               <PrimaryButton
            text="Continue"
            onpress={() => {
              closeDetailSheet();
            }}
            bgColors="#19488A"
            textColor="#FFFFFF"
            height={50}
          />
            </View>
          </View>
          </View>;
      case "vehicle_photos":
        return <View style={[tw``]}>
          <View>
            <Text style={[tw`pb-4`, {
              fontFamily: fontFamily.MontserratEasyMedium
            }]}>Take 4 clear photos of your vehicle</Text>
            <View style={[tw`gap-5 pb-4`]}>
            {vehiclePics.map((item, index) => (
              <TouchableOpacity style={[tw`items-center py-3 border border-1 border-dashed rounded-lg`, {
                
              }]} key={index}>
                <Image style={[tw`h-10 w-10`]} source={item.img} />
                <Text style={[tw`uppercase text-[#19488A]`, {
                  fontFamily: fontFamily.MontserratEasyBold
                }]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            </View>
             <PrimaryButton
            text="Continue"
            onpress={() => {
              closeDetailSheet();
            }}
            bgColors="#19488A"
            textColor="#FFFFFF"
            height={50}
          />
          </View>
        </View>;
      case "drivers_license":
        return <View style={[tw``]}>
          <View>
            <Text style={[tw`pb-4`, {
              fontFamily: fontFamily.MontserratEasyMedium
            }]}>Upload drivers License</Text>
            <View style={[tw`gap-4`]}>
              <View style={[tw`border border-1 border-dashed gap-4 p-4 rounded-lg`]}>
              <Image style={[tw`h-20 w-20 self-center`]} source={require("../../../assets/images/IntroImages/icon/img-box.png")} />
              <TouchableOpacity>
                <Text style={[tw`uppercase text-xs self-center`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>upload license</Text>
                
              </TouchableOpacity>
              <Text style={[tw`uppercase text-xs self-center`, {
                fontFamily: fontFamily.MontserratEasyMedium
              }]}>Or</Text>
              <TouchableOpacity style={[tw`bg-[#19488A77] py-3 items-center rounded-full`]}>
                <Text style={[tw`uppercase text-xs text-white`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>Take a picture</Text>
              </TouchableOpacity>
              </View>
              <View style={[tw`bg-[#19488A33] p-4 gap-3 rounded-lg`]}>
                <Text>Requirements</Text>
                <View style={[tw`gap-2`]}> 
                  {vehicleRequirements.map((item, index) => (
                    <View key={index} style={[tw`flex-row items-center gap-2`]}>
                      <Check size={15}/>
                    <Text style={[tw`text-xs`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{item.name}</Text>
                  </View>
                ))}
                </View>
            </View>
            <PrimaryButton
            text="Continue"
            onpress={() => {
              closeDetailSheet();
            }}
            bgColors="#19488A"
            textColor="#FFFFFF"
            height={50}
          />
            </View>
          </View>
        </View>;
      case "insurance_certificate":
        return <View style={[tw``]}>
           <View>
            <Text style={[tw`pb-4`, {
              fontFamily: fontFamily.MontserratEasyMedium
            }]}>Upload Insurance Certificate</Text>
            <View style={[tw`gap-4`]}>
              <View style={[tw`border border-1 border-dashed gap-4 p-4 rounded-lg`]}>
              <Image style={[tw`h-20 w-20 self-center`]} source={require("../../../assets/images/IntroImages/icon/img-box.png")} />
              <TouchableOpacity>
                <Text style={[tw`uppercase text-xs self-center`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>upload license</Text>
                
              </TouchableOpacity>
              <Text style={[tw`uppercase text-xs self-center`, {
                fontFamily: fontFamily.MontserratEasyMedium
              }]}>Or</Text>
              <TouchableOpacity style={[tw`bg-[#19488A77] py-3 items-center rounded-full`]}>
                <Text style={[tw`uppercase text-xs text-white`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>Take a picture</Text>
              </TouchableOpacity>
              </View>
              <View style={[tw`bg-[#19488A33] p-4 gap-3 rounded-lg`]}>
                <Text>Requirements</Text>
                <View style={[tw`gap-2`]}> 
                  {insuranceRequirements.map((item, index) => (
                    <View style={[tw`flex-row items-center gap-2`]}>
                      <Check size={15}/>
                    <Text key={index} style={[tw`text-xs`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{item.name}</Text>
                  </View>
                ))}
                </View>
            </View>
            <PrimaryButton
            text="Continue"
            onpress={() => {
              closeDetailSheet();
            }}
            bgColors="#19488A"
            textColor="#FFFFFF"
            height={50}
          />
            </View>
          </View>
        </View>;
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={[tw`flex-1`]}>
      <View style={[tw`flex-1`]}>
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
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          showsBuildings={false}
          showsIndoors={false}
          showsCompass={false}
          showsScale={false}
          mapType="standard"
          rotateEnabled={true}
          pitchEnabled={false}
          toolbarEnabled={false}
          loadingEnabled={true}
          loadingIndicatorColor="#yourBrandColor"
          loadingBackgroundColor="#ffffff"
        >
        </MapView>
          <View style={[tw`absolute top-15 left-5 z-10`]}>
          <BackButton
            
            onPress={() => {
              closeDetailSheet();
          }}
          />
          </View>

        {/* Main profile completion sheet */}
        <BottomSheet
          snapPoints={snapPoints}
          ref={bottomSheetRef}
          enablePanDownToClose={false}
        >
          <BottomSheetView style={[tw`px-5 justify-center pb-10`]}>
            <View style={[tw`gap-5`]}>
              <View
                style={[
                  tw`py-5 px-4 justify-center`,
                  {
                    backgroundColor: themeColors.primaryColor,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                ]}
              >
                <View style={[tw`flex-row justify-between items-center`]}>
                  <View style={[tw`flex-row items-center gap-3`]}>
                    <Image
                      source={require("../../../assets/images/pfp.png")}
                      style={[tw`h-16 w-16 rounded-full`]}
                    />
                    <View>
                      <Text
                        style={[
                          tw`uppercase text-white`,
                          { fontFamily: fontFamily.MontserratEasyBold },
                        ]}
                      >
                        Welcome, {user?.first_name || "User"}
                      </Text>
                      <View style={[tw`flex-row items-center gap-1`]}>
                        <MapPin size={12} color={"white"} />
                        <Text style={[tw`text-white uppercase text-[10px]`]}>
                          Gwarimpa first avenu
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      tw`h-12 w-12 rounded-full flex-row items-center justify-center bg-white`,
                    ]}
                  >
                    <BellIcon />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text
                  style={[
                    tw`text-2xl`,
                    {
                      fontFamily: fontFamily.MontserratEasyBold,
                      color: themeColors.primaryColor,
                    },
                  ]}
                >
                  Complete your profile
                </Text>
              </View>
              <View style={[tw`gap-2`]}>
                {profileButtons.map((item, index) => (
                  <ProfileButton
                    key={index}
                    text={item.title}
                    bgColor={item.bgColor}
                    borderColor={item.borderColor}
                    onPress={() => openDetailSheet(item.key)}
                    borderStrokeColor={item.borderStrokeColor}
                    textColor={item.textColor}
                    iconColor={item.iconColor}
                  />
                ))}
              </View>
              <View style={[tw`flex-row gap-2`]}>
                <TouchableOpacity style={[tw`h-6 w-6 rounded-full border-1 border items-center justify-center`]}>
                {/* <Check size={15}/> */}
                </TouchableOpacity>
                <Text style={[tw`flex-1 text-xs`, {
                  fontFamily: fontFamily.MontserratEasyBold
                }]}>I agree to the terms & conditions and carrier agreement</Text>
              </View>
              <PrimaryButton
                text="Continue"
                textColor="white"
                height={50}
                bgColors={themeColors.primaryColor}
                onpress={() => openContinueSheet()}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>

        {/* Detail sheet — opens when a profile button is tapped */}
        <BottomSheet
          snapPoints={detailSheetSnapPoints}
          ref={detailSheetRef}
          enablePanDownToClose={true}
          index={-1}
          onClose={() => {
            setActiveSheet(null);
            bottomSheetRef.current?.expand();
          }}
        >
          <BottomSheetView style={[tw`px-5 pb-10`]}>
            <View style={[tw`gap-5`]}>
              {/* Profile header */}
              <View
                style={[
                  tw`py-5 px-4 justify-center`,
                  {
                    backgroundColor: themeColors.primaryColor,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                ]}
              >
                <View style={[tw`flex-row justify-between items-center`]}>
                  <View style={[tw`flex-row items-center gap-3`]}>
                    <Image
                      source={require("../../../assets/images/pfp.png")}
                      style={[tw`h-16 w-16 rounded-full`]}
                    />
                    <View>
                      <Text
                        style={[
                          tw`uppercase text-white`,
                          { fontFamily: fontFamily.MontserratEasyBold },
                        ]}
                      >
                        Welcome, Godson
                      </Text>
                      <View style={[tw`flex-row items-center gap-1`]}>
                        <MapPin size={12} color={"white"} />
                        <Text style={[tw`text-white uppercase text-[10px]`]}>
                          Gwarimpa first avenu
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      tw`h-12 w-12 rounded-full flex-row items-center justify-center bg-white`,
                    ]}
                  >
                    <BellIcon />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Back button + title */}
              <View style={[tw`flex-row items-center gap-3`]}>
                <Text
                  style={[
                    tw`text-xl`,
                    {
                      fontFamily: fontFamily.MontserratEasyBold,
                      color: themeColors.primaryColor,
                    },
                  ]}
                >
                  {getSheetTitle(activeSheet)}
                </Text>
              </View>

              {/* Section-specific content (empty for now) */}
              {renderDetailContent(activeSheet)}
            </View>
          </BottomSheetView>
        </BottomSheet>

        {/* Continue sheet — opens when Continue is pressed on main sheet */}
        <BottomSheet
          snapPoints={continueSheetSnapPoints}
          ref={continueSheetRef}
          enablePanDownToClose={true}
          index={-1}
          onClose={() => {
            bottomSheetRef.current?.expand();
          }}
        >
          <BottomSheetView style={[tw`px-5 pb-10`]}>
            <View style={[tw`gap-5`]}>
              {/* Profile header */}
              <View
                style={[
                  tw`py-5 px-4 justify-center`,
                  {
                    backgroundColor: themeColors.primaryColor,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                ]}
              >
                <View style={[tw`flex-row justify-between items-center`]}>
                  <View style={[tw`flex-row items-center gap-3`]}>
                    <Image
                      source={require("../../../assets/images/pfp.png")}
                      style={[tw`h-16 w-16 rounded-full`]}
                    />
                    <View>
                      <Text
                        style={[
                          tw`uppercase text-white`,
                          { fontFamily: fontFamily.MontserratEasyBold },
                        ]}
                      >
                        Welcome, Godson
                      </Text>
                      <View style={[tw`flex-row items-center gap-1`]}>
                        <MapPin size={12} color={"white"} />
                        <Text style={[tw`text-white uppercase text-[10px]`]}>
                          Gwarimpa first avenu
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      tw`h-12 w-12 rounded-full flex-row items-center justify-center bg-white`,
                    ]}
                  >
                    <BellIcon />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content placeholder */}
              <View>
                <Text
                  style={[
                    tw`text-xl`,
                    {
                      fontFamily: fontFamily.MontserratEasyBold,
                      color: themeColors.primaryColor,
                    },
                  ]}
                >
                  Insurance
                </Text>
                <View style={[tw`items-center gap-3 pb-3`]}>
                <View style={[tw`items-center bg-green-100 h-50 w-50 items-center justify-center rounded-full border border-1 border-dashed border-green-600`]}>
                  <View style={[tw`bg-green-600 rounded-full items-center justify-center h-20 w-20`]}>
                  <Check style={[tw``]} color={"white"} size={60}/>
                  </View>
                  </View>
                  <Text style={[tw`text-xl uppercase text-green-500`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>Application Submitted</Text>
                </View>
                   <View style={[tw`bg-[#19488A33] p-4 mb-10 gap-3 rounded-lg`]}>
                <Text>Requirements</Text>
                <View style={[tw`gap-2`]}> 
                  {reviewProcess.map((item, index) => (
                    <View key={index} style={[tw`flex-row items-center gap-2`]}>
                      <Check size={15}/>
                    <Text style={[tw`text-xs`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{item.name}</Text>
                  </View>
                ))}
                </View>
                </View>
                 <PrimaryButton
                text="Go to profile"
                textColor="white"
                height={50}
                bgColors={themeColors.primaryColor}
                  onpress={() => {
                  router.push("/(Rider-Drawer)")
                }}
              />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default CompleteProfile;
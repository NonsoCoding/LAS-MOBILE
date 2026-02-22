import BackButton from "@/components/Buttons/BackButton";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import ProfileButton from "@/components/Buttons/ProfileButton";
import Profiletextinput from "@/components/Inputs/Profiletextinput";
import { updateCarrierProfile } from "@/components/services/api/carriersApi";
import * as AsyncStore from "@/components/services/storage/asyncStore";
import { STORAGE_KEYS } from "@/components/services/storage/storageKeys";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { BellIcon, CarFront, Check, MapPin, Scooter, Van } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, useColorScheme, View } from "react-native";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const detailSheetRef = useRef<BottomSheet>(null);
  const continueSheetRef = useRef<BottomSheet>(null);
  const { user, fetchUserProfile, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    vehicle_make: user?.vehicle_make || "",
    vehicle_model: user?.vehicle_model || "",
    vehicle_year: user?.vehicle_year?.toString() || "",
    vehicle_color: user?.vehicle_color || "",
    vehicle_type: typeof user?.vehicle_type === 'number' ? user.vehicle_type : (user?.vehicle_type as any)?.id || null,
  });

  const [documents, setDocuments] = useState<Record<string, string | null>>({
    vehicle_photo_front: user?.vehicle_photo_front || null,
    vehicle_photo_back: user?.vehicle_photo_back || null,
    vehicle_photo_left: user?.vehicle_photo_left || null,
    vehicle_photo_right: user?.vehicle_photo_right || null,
    drivers_license: user?.drivers_license || null,
    insurance_certificate: user?.insurance_certificate || null,
  });

  const pickImage = async (key: string) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Required", "Please allow access to your photo library to upload documents.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setDocuments(prev => ({ ...prev, [key]: imageUri }));
        
        const { accessToken, user: currentUser } = useAuthStore.getState();
        if (accessToken && currentUser) {
          const formData = new FormData();
          
          // The backend key is the same as our state key now
          const fileData: any = {
            uri: imageUri,
            type: 'image/jpeg',
            name: `${key}.jpg`,
          };
          
          formData.append(key, fileData);
          
          await updateCarrierProfile(accessToken, formData);
          
          // Update store and local storage
          const updatedUser = { 
            ...currentUser, 
            [key]: imageUri,
            // Also update the boolean flags used for completion tracking if needed, 
            // though the presence of the URI should be enough.
            [`${key}_uploaded`]: true 
          };
          useAuthStore.setState({ user: updatedUser });
          await AsyncStore.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to upload document. Please try again.");
    }
  };

  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({
    basic_information: !!(user?.first_name && user?.last_name && user?.email && user?.phone_number),
    vehicle_information: !!(user?.vehicle_make && user?.vehicle_model && user?.vehicle_year && user?.vehicle_color),
    vehicle_photos: !!(user?.vehicle_photo_front && user?.vehicle_photo_back && user?.vehicle_photo_left && user?.vehicle_photo_right),
    drivers_license: !!(user?.drivers_license_uploaded || user?.drivers_license),
    insurance_certificate: !!(user?.insurance_certificate_uploaded || user?.insurance_certificate),
  });

  const isProfileComplete = useMemo(() => {
    return Object.values(completedSections).every(Boolean);
  }, [completedSections]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile().catch(console.error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setFormData({
        vehicle_make: user?.vehicle_make || "",
        vehicle_model: user?.vehicle_model || "",
        vehicle_year: user?.vehicle_year?.toString() || "",
        vehicle_color: user?.vehicle_color || "",
        vehicle_type: typeof user?.vehicle_type === 'number' ? user.vehicle_type : (user?.vehicle_type as any)?.id || null,
      });
      
      setCompletedSections({
        basic_information: !!(user?.first_name && user?.last_name && user?.email && user?.phone_number),
        vehicle_information: !!(user?.vehicle_make && user?.vehicle_model && user?.vehicle_year && user?.vehicle_color),
        vehicle_photos: !!(user?.vehicle_photo_front && user?.vehicle_photo_back && user?.vehicle_photo_left && user?.vehicle_photo_right),
        drivers_license: !!(user?.drivers_license_uploaded || user?.drivers_license),
        insurance_certificate: !!(user?.insurance_certificate_uploaded || user?.insurance_certificate),
      });

      setDocuments({
        vehicle_photo_front: user?.vehicle_photo_front || null,
        vehicle_photo_back: user?.vehicle_photo_back || null,
        vehicle_photo_left: user?.vehicle_photo_left || null,
        vehicle_photo_right: user?.vehicle_photo_right || null,
        drivers_license: user?.drivers_license || null,
        insurance_certificate: user?.insurance_certificate || null,
      });
    }
  }, [user]);

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { accessToken, user: currentUser } = useAuthStore.getState();
      if (!accessToken || !currentUser) return;

      const submitData = new FormData();
      
      // Add text fields
      submitData.append("vehicle_make", formData.vehicle_make);
      submitData.append("vehicle_model", formData.vehicle_model);
      submitData.append("vehicle_year", formData.vehicle_year);
      submitData.append("vehicle_color", formData.vehicle_color);
      submitData.append("vehicle_type", String(formData.vehicle_type));
      submitData.append("terms_accepted_at", new Date().toISOString());

      // Add files if they are local URIs
      const fileKeys = [
        "vehicle_photo_front",
        "vehicle_photo_back",
        "vehicle_photo_left",
        "vehicle_photo_right",
        "drivers_license",
        "insurance_certificate"
      ];

      fileKeys.forEach(key => {
        const uri = documents[key];
        if (uri && uri.startsWith('file://')) {
          submitData.append(key, {
            uri,
            type: 'image/jpeg',
            name: `${key}.jpg`,
          } as any);
        }
      });

      const response = await updateCarrierProfile(accessToken, submitData);
      
      // Update store and local storage
      const updatedUser = { 
        ...currentUser, 
        ...response,
        profile_review_status: "under_review" 
      };
      
      useAuthStore.setState({ user: updatedUser });
      await AsyncStore.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      openContinueSheet();
    } catch (error: any) {
      console.error("Final submission failed:", error);
      Alert.alert("Submission Error", error.message || "Failed to submit profile. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  

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
            placeholder="First Name"
            value={user?.first_name as string}
            bgColor="#19488A11"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          <Profiletextinput
            placeholder="Last Name"
            value={user?.last_name as string}
            bgColor="#19488A11"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          <Profiletextinput
            placeholder="Email"
            value={user?.email as string}
            bgColor="#19488A11"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          <Profiletextinput
            placeholder="Phone Number"
            value={user?.phone_number as string}
            bgColor="#19488A11"
            icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
          />
          </View>
             <PrimaryButton
            text="Continue"
            onpress={async () => {
              try {
                const { accessToken, user } = useAuthStore.getState();
                if (accessToken && user) {
                  // Basic info is usually handled once, but we'll mark it in store for completion logic
                  const updatedUser = { ...user }; // Currently no changes to basic info in this form
                  useAuthStore.setState({ user: updatedUser });
                  await AsyncStore.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
                }
              } catch (error) {
                console.error("Failed to persist basic info:", error);
              }
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
                  style={[tw`flex-1 gap-4 items-center justify-center h-25 border border-1 border-[#19488A33] rounded-lg`, 
                    formData.vehicle_type === index + 1 && { borderColor: '#19488A', borderWidth: 2 }
                  ]}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, vehicle_type: index + 1 }));
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
                value={formData.vehicle_make}
                onChangeText={(text) => setFormData(prev => ({ ...prev, vehicle_make: text }))}
              />
               <Profiletextinput
                icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
                placeholder="Vehicle Model"
                value={formData.vehicle_model}
                onChangeText={(text) => setFormData(prev => ({ ...prev, vehicle_model: text }))}
              />
              <View style={[tw`flex-row gap-2`]}>
              <Profiletextinput
                icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
                  placeholder="Year"
                  value={formData.vehicle_year}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, vehicle_year: text }))}
              />
              <Profiletextinput
                icon={require("../../../assets/images/IntroImages/icon/Vector.png")}
                placeholder="Color"
                value={formData.vehicle_color}
                onChangeText={(text) => setFormData(prev => ({ ...prev, vehicle_color: text }))}
                />
              </View>
              </View>
               <PrimaryButton
            text="Continue"
            onpress={async () => {
              try {
                const { accessToken, user } = useAuthStore.getState();
                if (accessToken && user) {
                  const payload = {
                    ...formData,
                    vehicle_year: parseInt(formData.vehicle_year) || 0,
                  };
                  await updateCarrierProfile(accessToken, payload);
                  const updatedUser = { ...user, ...payload };
                  useAuthStore.setState({ user: updatedUser });
                  await AsyncStore.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
                }
              } catch (error) {
                console.error("Failed to persist vehicle info:", error);
              }
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
            {vehiclePics.map((item, index) => {
              const photoKeys = [
                'vehicle_photo_front',
                'vehicle_photo_back',
                'vehicle_photo_left',
                'vehicle_photo_right'
              ];
              const key = photoKeys[index];
              const isUploaded = !!documents[key];
              
              return (
                <TouchableOpacity style={[tw`items-center py-3 border border-1 border-dashed rounded-lg`, {
                  borderColor: isUploaded ? '#10B981' : '#19488A33',
                  backgroundColor: isUploaded ? '#10B98111' : 'transparent'
                }]} 
                key={index}
                onPress={() => pickImage(key)}
                >
                  {isUploaded ? (
                    <Image source={{ uri: documents[key] as string }} style={[tw`h-16 w-full rounded-lg`]} resizeMode="cover" />
                  ) : (
                    <>
                      <Image style={[tw`h-10 w-10`]} source={item.img} />
                      <Text style={[tw`uppercase text-[#19488A]`, {
                        fontFamily: fontFamily.MontserratEasyBold
                      }]}>{item.name}</Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
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
              <TouchableOpacity 
                style={[tw`border border-1 border-dashed gap-4 p-4 rounded-lg`, {
                  borderColor: documents.drivers_license ? '#10B981' : '#19488A33',
                  backgroundColor: documents.drivers_license ? '#10B98111' : 'transparent'
                }]}
                onPress={() => pickImage('drivers_license')}
              >
              <Image style={[tw`h-20 w-20 self-center`]} source={require("../../../assets/images/IntroImages/icon/img-box.png")} />
              <View>
                <Text style={[tw`uppercase text-xs self-center`, {
                  fontFamily: fontFamily.MontserratEasyMedium,
                  color: documents.drivers_license ? '#10B981' : '#000'
                }]}>{documents.drivers_license ? "License Uploaded" : "upload license"}</Text>
                
              </View>
              <Text style={[tw`uppercase text-xs self-center`, {
                fontFamily: fontFamily.MontserratEasyMedium
              }]}>Or</Text>
              <TouchableOpacity style={[tw`bg-[#19488A77] py-3 items-center rounded-full`]}>
                <Text style={[tw`uppercase text-xs text-white`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>Take a picture</Text>
              </TouchableOpacity>
              </TouchableOpacity>
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
              <TouchableOpacity 
                style={[tw`border border-1 border-dashed gap-4 p-4 rounded-lg`, {
                  borderColor: documents.insurance_certificate ? '#10B981' : '#19488A33',
                  backgroundColor: documents.insurance_certificate ? '#10B98111' : 'transparent'
                }]}
                onPress={() => pickImage('insurance_certificate')}
              >
              <Image style={[tw`h-20 w-20 self-center`]} source={require("../../../assets/images/IntroImages/icon/img-box.png")} />
              <View>
                <Text style={[tw`uppercase text-xs self-center`, {
                  fontFamily: fontFamily.MontserratEasyMedium,
                  color: documents.insurance_certificate ? '#10B981' : '#000'
                }]}>{documents.insurance_certificate ? "Certificate Uploaded" : "upload certificate"}</Text>
                
              </View>
              <Text style={[tw`uppercase text-xs self-center`, {
                fontFamily: fontFamily.MontserratEasyMedium
              }]}>Or</Text>
              <TouchableOpacity style={[tw`bg-[#19488A77] py-3 items-center rounded-full`]}>
                <Text style={[tw`uppercase text-xs text-white`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>Take a picture</Text>
              </TouchableOpacity>
              </TouchableOpacity>
              <View style={[tw`bg-[#19488A33] p-4 gap-3 rounded-lg`]}>
                <Text>Requirements</Text>
                <View style={[tw`gap-2`]}> 
                  {insuranceRequirements.map((item, index) => (
                    <View key={index} style={[tw`flex-row items-center gap-2`]}>
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
              if (activeSheet) {
                closeDetailSheet();
              } else {
                router.back();
              }
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
                {profileButtons.map((item, index) => {
                  const isComplete = completedSections[item.key as string];
                  return (
                    <ProfileButton
                      key={index}
                      text={item.title}
                      bgColor={isComplete ? "#10B98111" : item.bgColor}
                      borderColor={isComplete ? "#10B981" : item.borderColor}
                      onPress={() => openDetailSheet(item.key)}
                      borderStrokeColor={isComplete ? "#10B98122" : item.borderStrokeColor}
                      textColor={isComplete ? "#10B981" : item.textColor}
                      iconColor={isComplete ? "#10B981" : item.iconColor}
                    />
                  );
                })}
              </View>
              <View style={[tw`flex-row items-center gap-2`]}>
                <TouchableOpacity 
                   onPress={() => setTermsAccepted(!termsAccepted)}
                   style={[tw`h-6 w-6 rounded-md border-1 border items-center justify-center`, {
                     borderColor: termsAccepted ? themeColors.primaryColor : "#ccc",
                     backgroundColor: termsAccepted ? themeColors.primaryColor : "transparent"
                   }]}>
                {termsAccepted && <Check size={14} color="white"/>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)} style={[tw`flex-1`]}>
                  <Text style={[tw`text-xs`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>I agree to the terms & conditions and carrier agreement</Text>
                </TouchableOpacity>
              </View>
              <PrimaryButton
                text={isSubmitting ? "Submitting..." : "Continue"}
                textColor="white"
                height={50}
                disabled={!isProfileComplete || !termsAccepted || isSubmitting}
                bgColors={isProfileComplete && termsAccepted ? themeColors.primaryColor : "#ccc"}
                onpress={handleFinalSubmit}
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
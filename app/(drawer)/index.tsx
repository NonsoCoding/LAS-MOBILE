import DeliveryButton from "@/components/Buttons/DeliveryButton";
import SecondaryButton from "@/components/Buttons/SecondaryButons";
import CarrierCard from "@/components/Cards/CarrierCard";
import OrderCard from "@/components/Cards/OrderCard";
import DropDown from "@/components/DropDown/DropDown";
import CustomTextInput from "@/components/Inputs/CustomTextinput";
import RouteNumberTextInput from "@/components/Inputs/RouteNumberTextInput";
import RouteSearchTextInput from "@/components/Inputs/RouteTextInputs";
import SearchTextInput from "@/components/Inputs/SearchTextInput";
import { createShippment } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { DrawerActions } from "@react-navigation/native";
import * as Location from "expo-location";
import { useNavigation, useRouter } from "expo-router";
import { AlignCenter, InfoIcon, MapPin, Minus, Plus, X, XIcon } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

interface UserHomePageProps {}

const UserHomePage = ({}: UserHomePageProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const snapPoints = useMemo(() => ["50%"], []);
  const routeSearchSnapPoints = useMemo(() => ["90%", "90%"], []);
  const orderDetailSearchSnapPoints = useMemo(() => ["90%"], []);
  const offerSnapPoints = useMemo(() => ["43%"], []);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [RouteSearchSheet, setRouteSearchSheet] = useState<boolean>(false);
  const [orderDetailSheet, setOrderDetailSheet] = useState<boolean>(false);
  const [offerSheet, setOfferSheet] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [pickupCoords, setPickupCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [destinationCoords, setDestinationCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [chooseCarrierModal, setchooseCarrierModal] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"building" | "door">("building");
  // New state variables for shipment creation
  const [senderPhone, setSenderPhone] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemValue, setItemValue] = useState<number>(1500);
  const [recipientName, setRecipientName] = useState(""); // UI doesn't have an explicit field for this yet, using recipientPhone or adding one?
  // Assuming vehicle_type_id is selected later or defaults to 1 as per user JSON
  // const [vehicleTypeId, setVehicleTypeId] = useState(1);
  const routeSearchSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const OrderDetailSheetRef = useRef<BottomSheet>(null);
  const offerSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();
  const [origin, setOrigin] = useState<LatLng | null>(null)
  const [duration, setDuration] = useState<number>(0)
  const [distance, setDistance] = useState<number>(0)
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [showDirection, setShowDirection] = useState<boolean>(false);
  const mapRef = useRef<MapView>(null);
  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, {duration: 1000})
    }
  }
  const { user, fetchUserProfile, isAuthenticated, accessToken } = useAuthStore();
  const GoogleApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const edgePaddingValue = 50;

  const edgePadding = {
    top: 100, // Reduced from 300 to show more map
    bottom: 400, // Increased to account for bottom sheet
    left: edgePaddingValue,
    right: edgePaddingValue
  }

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirection(true);
      mapRef.current?.fitToCoordinates([origin, destination], {
        edgePadding,
        animated: true,
      });
      // Snap bottom sheet to 40% (index 0)
      routeSearchSheetRef.current?.snapToIndex(0);
    }
  }

  const trackRouteOnReady = (args: any) => {
    if (args) {
      setDuration(args.duration)
      setDistance(args.distance)
    }
  }

  const paymentaOptions = [
    "Transfer",
    "Card",
    "Cash"
  ]



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      moveTo({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        const parts = [];
        if (address.streetNumber) parts.push(address.streetNumber);
        if (address.street) parts.push(address.street);
        if (address.city) parts.push(address.city);
        if (address.region) parts.push(address.region);
        
        const formattedAddress = parts.join(", ");
         setPickupAddress(formattedAddress);
      }
    })();
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch fresh user data when component mounts
      fetchUserProfile().catch(console.error);
    }
  }, [isAuthenticated]);

  const carrierCardInfo = [
    { name: "Ebenihi", amount: 4200, carrierType: "Toyota Camry", image: require("../../assets/images/EppMeBuyMainLogo.png"), rating: 4.5, totalRides: 100, time: "7 mins" },
    { name: "Ebenihi", amount: 4200, carrierType: "Toyota Camry", image: require("../../assets/images/EppMeBuyMainLogo.png"), rating: 4.5, totalRides: 100, time: "7 mins" },
    { name: "Ebenihi", amount: 4200, carrierType: "Toyota Camry", image: require("../../assets/images/EppMeBuyMainLogo.png"), rating: 4.5, totalRides: 100, time: "7 mins" },
  ];

  const handleCreateEvent = async () => {
    // Basic validation
    if (!pickupAddress || !destinationAddress || !senderPhone || !recipientPhone || !itemDescription) {
      alert("Please fill in all required fields (addresses, phones, description)");
      return;
    }

    const payload = {
      pickup_address: pickupAddress,
      delivery_address: destinationAddress,
      pickup_latitude: origin?.latitude?.toFixed(6) || "",
      pickup_longitude: origin?.longitude?.toFixed(6) || "",
      delivery_latitude: destination?.latitude?.toFixed(6) || "",
      delivery_longitude: destination?.longitude?.toFixed(6) || "",
      package_type: "light_weight", // Default or add selector
      item_description: itemDescription,
      item_value: itemValue.toString(),
      special_instructions: "", // Add field if needed
      delivery_type: deliveryType === "building" ? "to_building" : "to_door",
      recipient_name: recipientName || recipientPhone, // Fallback if no name field
      recipient_phone: recipientPhone,
      recipient_instructions: "",
      sender_phone: senderPhone,
      // vehicle_type_id: vehicleTypeId
    };

    console.log("Creating shipment with payload:", payload);

    try {
      if (!accessToken) {
        Alert.alert("Error", "You must be logged in to create a shipment");
        return;
      }
      const response = await createShippment(payload, accessToken);
      console.log("Shipment created successfully:", response);
      // Handle success (e.g., navigate to next step, show success message)
      setOrderDetailSheet(false);
      setOfferSheet(true); // Move to offer/payment or next logical step
    } catch (error: any) {
      
    }
  }

  return (
    <View style={[tw`flex-1 justify-end`, {
      backgroundColor: themeColors.background,
      ...Platform.select({
        ios: {
          paddingTop: 0
        },
        android: {
          paddingTop: 20
        }
      })
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
        {origin &&
          <Marker
            coordinate={origin}
          >
            <Image style={[tw`w-15 h-15`, {
              resizeMode: "contain"
            }]} source={require("../../assets/images/IntroImages/icon/pin.png")}/>
          </Marker>
        }
        {destination &&
          <Marker
            coordinate={destination}
          >
            <Image style={[tw`w-15 h-15`, {
              resizeMode: "contain"
            }]} source={require("../../assets/images/IntroImages/icon/pin.png")}/>
          </Marker>
        }
        {showDirection && origin && destination &&
       <MapViewDirections 
        origin={origin}
        destination={destination}
        apikey={GoogleApiKey || ""}
        strokeColor={themeColors.primaryColor}
          strokeWidth={6}
          onReady={trackRouteOnReady}
       />
        }
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
      </MapView>
      <Modal
          transparent={true}
          onRequestClose={() => {
            setchooseCarrierModal(false);
          }}
          animationType="slide"
          visible={chooseCarrierModal}
        >
          <View style={[tw`flex-1 px-5 pt-15 bg-black/80 gap-6`]}>
          <TouchableOpacity onPress={() => {
            bottomSheetRef.current?.expand();
              setchooseCarrierModal(false)
            }} style={[tw`bg-[#D37A0F88] flex-row items-center gap-2 px-3 py-2 self-start rounded-full`]}>
              <XIcon color={"white"} size={17}/>
              <Text style={[tw`text-white text-xs`, {
                  fontFamily: fontFamily.MontserratEasyBold
                }]}>Cancel Request</Text>
            </TouchableOpacity>

            <View style={[tw`gap-6`]}>
              <Text style={[tw`text-2xl text-white`, {
                fontFamily: fontFamily.MontserratEasyBold
              }]}>Choose a carrier</Text>
              <View style={[tw`gap-3`]}>
              {carrierCardInfo.map((item, index) => {
                return (
                  <CarrierCard
                    name={item.name}
                    amount={item.amount}
                    carrierType="Rider"
                    image={item.image}
                    acceptOnPress={() => {
                      setchooseCarrierModal(false)
                      bottomSheetRef.current?.expand();
                    }}
                    declineOnPress={() => {
                      setchooseCarrierModal(false)
                      bottomSheetRef.current?.expand();
                    }}
                    rating={item.rating}
                    time={item.time}
                    totalRides={item.totalRides}
                    key={index}
                    
                  />
                )
              })}
              </View>
            </View>
          </View>
      </Modal>
      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
      >
          <BottomSheetView style={[tw`px-5 justify-center pb-10`]}
          >
            
          {step === 1 && (
          <View style={[tw`gap-5`]}>
            <SearchTextInput placeholderText="Track your shipment" />
            <OrderCard />
            <View style={[tw`flex-row justify-between items-center gap-2`]}>
              <SecondaryButton
                borderColor={themeColors.primaryColor}
                borderWidth={1}
                  text="View History"
                  icon={require("../../assets/images/IntroImages/icon/Clock.png")}
                height={50}
                textColor={themeColors.primaryColor}
                onpress={() => {

                }}
              />
              <SecondaryButton
                bgColors={themeColors.primaryColor}
                  text="New Request"
                  icon={require("../../assets/images/IntroImages/icon/TimeCount.png")}
                height={50}
                textColor={"white"}
                onpress={() => {
                  setStep(2)
                }}
              />
            </View>
          </View>
          )}
          {step === 2 && (
            <View style={[tw`gap-5`]}>
              <View style={[tw`flex-row items-center justify-between`]}>
                  <Text style={[tw`text-2xl uppercase`, {
                    fontFamily: fontFamily.MontserratEasyBold,
                    color: themeColors.primaryColor
                  }]}>Delivery Request</Text>
                     <TouchableOpacity 
                    onPress={() => {
                        setStep(1);
                        bottomSheetRef.current?.expand();
                    }}
                    style={[tw`p-2 bg-gray-100 rounded-full`]}
                  >
                    <X size={20} color={themeColors.primaryColor} />
                  </TouchableOpacity>
              </View>
                  <TouchableOpacity style={[tw`flex-row items-center gap-2. ml-5`]} onPress={() => {
                    bottomSheetRef.current?.close();
                    setRouteSearchSheet(true);
                  }}>
                    <Image style={[tw`h-3.5 w-3.5`]} source={require("../../assets/images/IntroImages/LocationMarker.png")}/>
                    <Text style={[tw`uppercase text-xs`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]} numberOfLines={1}>{pickupAddress.length > 20 ? pickupAddress.slice(0, 35) + "..." : pickupAddress || "Pickup location"}</Text>
                  </TouchableOpacity>
              <View style={[tw`gap-3`]}>
                {pickupAddress && destinationAddress ? (
                    <TouchableOpacity style={[tw`flex-row items-center gap-2. ml-5`]} onPress={() => {
                      bottomSheetRef.current?.close();
                      setRouteSearchSheet(true);
                    }}>
                    <Image style={[tw`h-3.5 w-3.5`]} source={require("../../assets/images/IntroImages/LocationMarker2.png")}/>
                    <Text style={[tw`uppercase text-xs`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]} numberOfLines={1}>{destinationAddress.length > 20 ? destinationAddress.slice(0, 35) + "..." : destinationAddress || "Package destination"}</Text>
                  </TouchableOpacity>
                ) : (
                    <View>
                      <DeliveryButton
                      icon={require("../../assets/images/IntroImages/icon/Scope.png")}
                      text={destinationAddress || "Package destination"}
                      onPress={() => {
                        bottomSheetRef.current?.close();
                        setRouteSearchSheet(true);
                      }}
                    />
                </View>
                )}
                {senderPhone && recipientPhone && recipientName && itemDescription && itemValue && deliveryType ? (
                  <DeliveryButton
                      icon={require("../../assets/images/IntroImages/icon/Details.png")}
                      text={(() => {
                        const type = deliveryType.charAt(0).toUpperCase() + deliveryType.slice(1);
                        const str = `To ${type}, From ${senderPhone}, to ${recipientPhone}`;
                        return str.length > 35 ? str.slice(0, 35) + "..." : str;
                      })()}
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    setOrderDetailSheet(true);
                      }}
                    />
                ): (
                    <View>
                       <DeliveryButton
                      icon={require("../../assets/images/IntroImages/icon/Details.png")}
                      text="Order details"
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    setOrderDetailSheet(true);
                      }}
                    />
                      </View>
                )}
                   
                    <DeliveryButton
                      icon={require("../../assets/images/IntroImages/icon/Offer.png")}
                      text="Offer your request"
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    setOfferSheet(true);
                      }}
                    />
              </View>
              <View style={[tw`flex-row rounded-lg gap-3 p-4 items-center bg-[#D37A0F22]`, {
                borderLeftWidth: 3,
                borderColor: "#D37A0F"
              }]}>
                <InfoIcon color={"#D37A0F"} />
                <Text style={[tw`text-[#D37A0F]`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>Recommended price: 2000</Text>
              </View>
              <SecondaryButton
                bgColors={themeColors.primaryColor}
                text="Find Rider"
                height={50}
                textColor={"white"}
                onpress={() => {
                  bottomSheetRef.current?.close();
                  setchooseCarrierModal(true);
                }}
              />
          </View>
          )}
        </BottomSheetView>  
      </BottomSheet>
       {RouteSearchSheet && (
      <BottomSheet
        snapPoints={routeSearchSnapPoints}
        ref={routeSearchSheetRef}
        onClose={() => setRouteSearchSheet(false)}
      >
          <BottomSheetView style={[tw`flex-1 px-5 justify-between pb-15`]}
          >
            <View style={[tw`gap-5`]}>
            <View style={[tw`flex-row justify-between items-center`]}>
                  <Text style={[tw`text-2xl`, {
                    color: themeColors.primaryColor,
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>Enter Your Route</Text>
                  <TouchableOpacity 
                    onPress={() => {
                        setRouteSearchSheet(false);
                        bottomSheetRef.current?.expand();
                    }}
                    style={[tw`p-2 bg-gray-100 rounded-full`]}
                     >
                    <X size={20} color={themeColors.primaryColor} />
                  </TouchableOpacity>
            </View>
            <View style={[tw`gap-2`]}>
                <View style={[tw`z-20`]}>
                  <RouteSearchTextInput
                    direction="FROM"
                    value={pickupAddress}
                    GoogleApiKey={GoogleApiKey || ""}
                    onFocus={() => {
                      routeSearchSheetRef.current?.snapToIndex(1);
                    }}
                    onPlaceSelected={(details) => {
                      setOrigin({
                        latitude: details.latitude,
                        longitude: details.longitude
                      });
                      setPickupAddress(details.description);
                      moveTo({
                        latitude: details.latitude,
                        longitude: details.longitude
                      });
                    }}
                  />
                </View>
                <View style={[tw`z-10`]}>
                  <RouteSearchTextInput
                    direction="TO"
                    value={destinationAddress}
                    GoogleApiKey={GoogleApiKey || ""}
                    onFocus={() => {
                      routeSearchSheetRef.current?.snapToIndex(1);
                    }}
                    onPlaceSelected={(details) => {
                      setDestination({
                        latitude: details.latitude,
                        longitude: details.longitude
                      });
                      setDestinationAddress(details.description);
                      moveTo({
                        latitude: details.latitude,
                        longitude: details.longitude
                      });
                    }}
                  />
                </View>
              </View>
              {distance > 0 && duration > 0 && (
                <View style={tw`flex-row justify-between px-2`}>
                  <Text style={[tw`text-[10px] text-gray-500 uppercase`, { fontFamily: fontFamily.MontserratEasyMedium }]}>
                    distance: {Math.ceil(distance)} km
                  </Text>
                  <Text style={[tw`text-[10px] text-gray-500 uppercase`, { fontFamily: fontFamily.MontserratEasyMedium }]}>
                    duration: {Math.ceil(duration)} minutes
                  </Text>
              </View>
              )}
                <View style={[tw`px-2`]}>
                <TouchableOpacity style={[tw`flex-row items-center gap-2`,]}
                  onPress={() => {
                    traceRoute();
                  }}
                >
                <MapPin size={18} color={themeColors.primaryColor} />
                <Text style={[tw`uppercase text-xs`, {
                  fontFamily: fontFamily.MontserratEasyBold,
                  color: themeColors.primaryColor
                }]}>Show in map</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={tw`mt-5`}>
              <SecondaryButton
                bgColors={themeColors.primaryColor}
                text="Confirm Route"
                height={50}
                textColor={"white"}
                onpress={() => {
                  traceRoute();
                  setRouteSearchSheet(false);
                  bottomSheetRef.current?.expand();
                }}
              />
            </View>
        </BottomSheetView>
  
      </BottomSheet>
      )}
      {orderDetailSheet && (
      <BottomSheet
        snapPoints={orderDetailSearchSnapPoints}
        ref={OrderDetailSheetRef}
        onClose={() => setOrderDetailSheet(false)}
      >
          <BottomSheetView style={[tw`flex-1 px-5 justify-between pb-15`]}
          >
            <View style={[tw`gap-5`]}>
            <View style={[tw`flex-row justify-between items-center`]}>
                 <Text style={[tw`uppercase text-2xl`, {
                   color: themeColors.primaryColor,
                   fontFamily: fontFamily.MontserratEasyBold
                  }]}>Order Detail</Text>
                  <TouchableOpacity 
                    onPress={() => {
                        setOrderDetailSheet(false);
                        bottomSheetRef.current?.expand();
                    }}
                    style={[tw`p-2 bg-gray-100 rounded-full`]}
                  >
                    <X size={20} color={themeColors.primaryColor} />
                  </TouchableOpacity>
              </View>
              <View style={[tw`flex-row justify-between items-center bg-[#19488A11] rounded-lg p-1`]}>
                <TouchableOpacity 
                  style={[tw`flex-1 py-4 rounded-md items-center`, {
                    backgroundColor: deliveryType === "building" ? "#19488A" : "transparent"
                  }]}
                  onPress={() => setDeliveryType("building")}
                >
                  <Text style={[tw`uppercase text-xs`, {
                    fontFamily: fontFamily.MontserratEasyMedium,
                    color: deliveryType === "building" ? "white" : "#19488A"
                  }]}>To Building</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[tw`flex-1 items-center py-4 rounded-md`, {
                    backgroundColor: deliveryType === "door" ? "#19488A" : "transparent"
                  }]}
                  onPress={() => setDeliveryType("door")}
                >
                  <Text style={[tw`uppercase text-xs`, {
                    fontFamily: fontFamily.MontserratEasyMedium,
                    color: deliveryType === "door" ? "white" : "#19488A"
                  }]}>To Door</Text>
                </TouchableOpacity>
              </View>
            <View style={[tw`gap-3`]}>
            <RouteNumberTextInput 
                direction="Sender's Phone Number"
                value={senderPhone}
                onChangeText={setSenderPhone}
              />
              <RouteNumberTextInput 
                direction="Recipient's Phone Number"
                value={recipientPhone}
                onChangeText={setRecipientPhone}
                />
                <CustomTextInput
                  placeholderText="Recipients full name"
                  onChangeText={setRecipientName}
                  value={recipientName}
                />
              </View>
              <View style={[tw`gap-4`]}>
                <View style={[tw`justify-between flex-row items-center`]}>
                <Text style={[tw`text-lg text-[#19488A]`, {
                  fontFamily: fontFamily.MontserratEasyBold
                  }]}>What to deliver</Text>
                  <TouchableOpacity>
                  <InfoIcon size={14} color={themeColors.primaryColor}/>
                  </TouchableOpacity>
                </View>
                <TextInput
                  numberOfLines={5}
                  multiline
                  placeholder="Describe the parcel you wish to be delivered"
                  style={[tw`rounded-md px-4 py-2 bg-[#19488A11] h-25 border border-[0.5px] border-[#19488A22]`, {
                    fontFamily: fontFamily.MontserratEasyRegular
                  }]}
                  value={itemDescription}
                  onChangeText={setItemDescription}
                />
              </View>
              <View style={[tw`gap-4`]}>
                <View style={[tw`justify-between flex-row items-center`]}>
                <Text style={[tw`text-lg text-[#19488A]`, {
                  fontFamily: fontFamily.MontserratEasyBold
                  }]}>Indicate the Value</Text>
                  <TouchableOpacity>
                  <InfoIcon size={14} color={themeColors.primaryColor}/>
                  </TouchableOpacity>
                </View>
                <View style={[tw`flex-row justify-between items-center bg-[#19488A11] p-5 py-7 rounded-md`]}>
                  <TouchableOpacity 
                    style={[tw`p-2 bg-white rounded-full`]}
                    onPress={() => setItemValue(prev => prev + 500)}
                  >
                    <Plus/>
                  </TouchableOpacity>
                  <Text style={[tw`text-5xl text-[#00000055]`, {
                    fontFamily: fontFamily.Medium
                  }]}>{itemValue}</Text>
                  <TouchableOpacity 
                    style={[tw`p-2 bg-white rounded-full`]}
                    onPress={() => setItemValue(prev => Math.max(0, prev - 500))}
                  >
                  <Minus/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={tw`mt-5`}>
              <SecondaryButton
                bgColors={themeColors.primaryColor}
                text="Find Rider"
                height={50}
                textColor={"white"}
                onpress={handleCreateEvent}
              />
            </View>
        </BottomSheetView>
  
      </BottomSheet>
      )}
      {offerSheet && (
      <BottomSheet
        snapPoints={offerSnapPoints}
        ref={offerSheetRef}
        onClose={() => setOfferSheet(false)}
      >
          <BottomSheetView style={[tw`flex-1 px-5 justify-between pb-15`]}
          >
            <View style={[tw`gap-5`]}>
            <View style={[tw`flex-row justify-between items-center`]}>
                 <Text style={[tw`text-xl uppercase`, {
                   color: themeColors.primaryColor,
                   fontFamily: fontFamily.MontserratEasyBold
                  }]}>Offer your price</Text>
                  <TouchableOpacity 
                    onPress={() => {
                        setOfferSheet(false);
                        bottomSheetRef.current?.expand();
                    }}
                    style={[tw`p-2 bg-gray-100 rounded-full`]}
                  >
                    <X size={20} color={themeColors.primaryColor} />
                  </TouchableOpacity>
            </View>
            
              <View style={[tw`gap-4`]}>
                 <DropDown
                  label="Payment method"
                  value={paymentMethod}
                  icon={require("../../assets/images/IntroImages/icon/Offer.png")}
                  onSelect={(value) => setPaymentMethod(value)}
                  placeholder="Select payment method"
                  options={paymentaOptions}
                />
                <View style={[tw`flex-row justify-between items-center bg-[#19488A11] p-5 py-7 rounded-md`]}>
                  <TouchableOpacity style={[tw`p-2 bg-white rounded-full`]}>
                    <Plus/>
                  </TouchableOpacity>
                  <Text style={[tw`text-5xl text-[#00000055]`, {
                    fontFamily: fontFamily.Medium
                  }]}>1500</Text>
                  <TouchableOpacity style={[tw`p-2 bg-white rounded-full` ]} >
                  <Minus/>
                  </TouchableOpacity>
                </View>
              
              </View>
            </View>
            <View style={tw`mt-5`}>
              <SecondaryButton
                bgColors={themeColors.primaryColor}
                text="Find Rider"
                height={50}
                textColor={"white"}
                onpress={() => {
                  setOfferSheet(false);
                  bottomSheetRef.current?.expand();
                }}
              />
            </View>
        </BottomSheetView>
  
      </BottomSheet>
      )}
    
    </View>
  );
};

export default UserHomePage;



import DeliveryButton from "@/components/Buttons/DeliveryButton";
import SecondaryButton from "@/components/Buttons/SecondaryButons";
import CarrierCard from "@/components/Cards/CarrierCard";
import OrderCard from "@/components/Cards/OrderCard";
import DropDown from "@/components/DropDown/DropDown";
import CustomTextInput from "@/components/Inputs/CustomTextinput";
import RouteNumberTextInput from "@/components/Inputs/RouteNumberTextInput";
import RouteSearchTextInput from "@/components/Inputs/RouteTextInputs";
import SearchTextInput from "@/components/Inputs/SearchTextInput";
import { createShippment, offerPrice } from "@/components/services/api/authApi";
import { confirmCarrierAcceptance, getShipmentDetails, requestOfferPrice } from "@/components/services/api/carriersApi";
import useAuthStore from "@/components/store/authStore";
import useShipmentStore from "@/components/store/shipmentStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { DrawerActions } from "@react-navigation/native";
import * as Location from "expo-location";
import { useNavigation, useRouter } from "expo-router";
import { AlignCenter, InfoIcon, MapPin, Minus, Plus, X, XIcon } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
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

  const {
    activeShipmentId: createdShipmentId,
    pickupAddress,
    destinationAddress,
    origin,
    destination,
    calculatedPrice,
    finalPrice,
    paymentMethod,
    isSearching: chooseCarrierModal,
    step,
    senderPhone,
    recipientPhone,
    recipientName,
    itemDescription,
    deliveryType,
    setShipmentData,
    clearShipment,
    loadShipment
  } = useShipmentStore();

  const setStep = (step: 1 | 2) => setShipmentData({ step });
  const setPaymentMethod = (paymentMethod: string) => setShipmentData({ paymentMethod });
  const setPickupAddress = (pickupAddress: string) => setShipmentData({ pickupAddress });
  const setDestinationAddress = (destinationAddress: string) => setShipmentData({ destinationAddress });
  const setchooseCarrierModal = (isSearching: boolean) => setShipmentData({ isSearching });
  const setDeliveryType = (deliveryType: "building" | "door") => setShipmentData({ deliveryType });
  const setSenderPhone = (senderPhone: string) => setShipmentData({ senderPhone });
  const setRecipientPhone = (recipientPhone: string) => setShipmentData({ recipientPhone });
  const setItemDescription = (itemDescription: string) => setShipmentData({ itemDescription });
  const setRecipientName = (recipientName: string) => setShipmentData({ recipientName });
  const setCreatedShipmentId = (activeShipmentId: number | null) => setShipmentData({ activeShipmentId });
  const setCalculatedPrice = (calculatedPrice: string | null) => setShipmentData({ calculatedPrice });
  const setFinalPrice = (finalPrice: number) => setShipmentData({ finalPrice });
  const setOrigin = (origin: LatLng | null) => setShipmentData({ origin });
  const setDestination = (destination: LatLng | null) => setShipmentData({ destination });

  const [selected, setSelected] = useState<number | null>(null);
  const [RouteSearchSheet, setRouteSearchSheet] = useState<boolean>(false);
  const [orderDetailSheet, setOrderDetailSheet] = useState<boolean>(false);
  const [offerSheet, setOfferSheet] = useState<boolean>(false);
  const [itemValue, setItemValue] = useState<number>(1500);

  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const routeSearchSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const OrderDetailSheetRef = useRef<BottomSheet>(null);
  const offerSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();
  const [duration, setDuration] = useState<number>(0)
  const [distance, setDistance] = useState<number>(0)
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
    const initialize = async () => {
      await loadShipment();
      
      // After loading, we need to check if we should restore UI states
      const state = useShipmentStore.getState();
      const { accessToken: token } = useAuthStore.getState();

      if (state.activeShipmentId && token) {
        try {
          console.log("Syncing active shipment status from backend for ID:", state.activeShipmentId);
          const detail = await getShipmentDetails(token, state.activeShipmentId);
          console.log("Restored shipment detail:", detail);
          
          if (detail) {
            // Update store with latest data from backend if needed
            setShipmentData({
              calculatedPrice: detail.calculated_price,
              finalPrice: detail.final_price || state.finalPrice,
              isSearching: detail.status === "searching" || detail.status === "offered",
              // Add other relevant fields if necessary
            });
          }
        } catch (error) {
          console.error("Failed to sync shipment status on init:", error);
        }
      }

      const updatedState = useShipmentStore.getState();
      if (updatedState.step > 1) {
        bottomSheetRef.current?.expand();
      }
      if (updatedState.origin && updatedState.destination) {
        setShowDirection(true);
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (!origin) {
        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
      
      moveTo({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (!pickupAddress) {
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
      }
    };
    initialize();
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
    // Detailed validation
    if (!pickupAddress) {
      alert("Please enter a pickup address");
      return;
    }
    if (!destinationAddress) {
      alert("Please enter a destination address");
      return;
    }
    if (!origin) {
      alert("Please select a pickup location on the map");
      return;
    }
    if (!destination) {
      alert("Please select a destination location on the map");
      return;
    }
    if (!senderPhone) {
      alert("Please enter the sender's phone number");
      return;
    }
    if (!recipientPhone) {
      alert("Please enter the recipient's phone number");
      return;
    }
    if (!recipientName) {
      alert("Please enter the recipient's full name");
      return;
    }
    if (!itemDescription) {
      alert("Please describe the item to be delivered");
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
      if (response && response.id) {
        setCreatedShipmentId(response.id);
        setCalculatedPrice(response.calculated_price);
        setOrderDetailSheet(false);
        setStep(2);
        bottomSheetRef.current?.expand();
      } else {
        Alert.alert("Error", "Failed to get shipment ID from response");
      }
    } catch (error: any) {
      console.error("Error creating shipment:", error);
      Alert.alert("Error", error.message || "Failed to create shipment");
    }
  }

  const handleOfferPrice = async () => {
    if (!createdShipmentId) {
      Alert.alert("Error", "No shipment ID found. Please create a shipment first.");
      return;
    }
    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }
    if (!accessToken) return;

    try {
      const data = {
        final_price: finalPrice.toString(),
        payment_method: paymentMethod.toLowerCase()
      };
      const response = await offerPrice(createdShipmentId, data, accessToken);
      console.log("Offer price successful:", response);
      // setOfferSheet(false);
      // bottomSheetRef.current?.expand();
      Alert.alert("Success", "Your offer has been sent to riders!");
    } catch (error: any) {
      console.error("Error offering price:", error);
      Alert.alert("Error", error.message || "Failed to send offer");
    }
  }

  const fetchOffers = useCallback(async (silent: boolean = false) => {
    const { activeShipmentId: createdShipmentId } = useShipmentStore.getState();
    const { accessToken } = useAuthStore.getState();
    if (!createdShipmentId || !accessToken) return;
    try {
      if (!silent) setLoadingOffers(true);
      const data = await requestOfferPrice(accessToken, createdShipmentId);
      console.log("RAW OFFERS DATA:", JSON.stringify(data, null, 2));
      
      // Handle various response formats
      let offersList = [];
      if (data && data.results) {
        offersList = data.results;
      } else if (Array.isArray(data)) {
        offersList = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        offersList = data.data;
      }

      console.log(`Parsed ${offersList.length} offers`);
      setOffers(offersList);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      if (!silent) setLoadingOffers(false);
    }
  }, [createdShipmentId, accessToken]);

  useEffect(() => {
    let interval: any;
    if (chooseCarrierModal && createdShipmentId) {
      fetchOffers(); // Initial fetch
      interval = setInterval(() => {
        fetchOffers(true); // Silent background poll
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chooseCarrierModal, createdShipmentId, fetchOffers]);

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
              {loadingOffers && offers.length === 0 ? (
                <View style={[tw`py-10 items-center`]}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={[tw`text-white mt-2`, { fontFamily: fontFamily.MontserratEasyMedium }]}>Searching for riders...</Text>
                </View>
              ) : offers.length === 0 ? (
                <View style={[tw`py-10 items-center`]}>
                  <Text style={[tw`text-white text-center`, { fontFamily: fontFamily.MontserratEasyMedium }]}>No riders have accepted your offer yet.{"\n"}Rider offers will appear here automatically.</Text>
                </View>
              ) : (
                offers.map((offer, index) => {
                  return (
                    <CarrierCard
                      name={(() => {
                        const carrier = offer.carrier || offer.acceptance_sender || offer.user;
                        return carrier?.first_name ? `${carrier.first_name} ${carrier.last_name || ""}` : "Carrier";
                      })()}
                      amount={offer.final_price || offer.offered_price || finalPrice}
                      carrierType={(() => {
                        const carrier = offer.carrier || offer.acceptance_sender || offer.user;
                        return carrier?.vehicle_type?.name || "Rider";
                      })() as any}
                      image={(() => {
                        const carrier = offer.carrier || offer.acceptance_sender || offer.user;
                        return carrier?.profile_picture ? { uri: carrier.profile_picture } : require("../../assets/images/pfp.png");
                      })()}
                      acceptOnPress={async () => {
                        try {
                          if (!accessToken || !createdShipmentId || !offer.id) {
                            Alert.alert("Error", "Missing required information to accept offer");
                            return;
                          }
                          const response = await confirmCarrierAcceptance(accessToken, createdShipmentId, offer.id);
                          console.log("Carrier accepted successfully:", response);
                          await clearShipment();
                          setchooseCarrierModal(false);
                          bottomSheetRef.current?.expand();
                          setStep(1); // Reset or navigate away
                          Alert.alert("Success", "Carrier selected! Your shipment is now being processed.");
                        } catch (error: any) {
                          console.error("Error accepting carrier:", error);
                          Alert.alert("Error", error.message || "Failed to accept carrier");
                        }
                      }}
                      declineOnPress={() => {
                        // Optional: ignore this offer
                      }}
                      rating={4.5} // Backend needs to provide this
                      time="Nearby" // Backend needs to provide this
                      totalRides={offer.carrier?.total_trips || 0}
                      key={offer.id || index}
                    />
                  )
                })
              )}
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
                      text={paymentMethod && createdShipmentId ? `₦${finalPrice} via ${paymentMethod}` : "Offer your request"}
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
                }]}>Recommended price: ₦{calculatedPrice || "0"}</Text>
              </View>
              <SecondaryButton
                bgColors={themeColors.primaryColor}
                text="Find Rider"
                height={50}
                textColor={"white"}
                onpress={() => {
                  handleOfferPrice();
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
                      setCalculatedPrice(null);
                      setCreatedShipmentId(null);
                      setPaymentMethod("");
                      setFinalPrice(2000);
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
                      setCalculatedPrice(null);
                      setCreatedShipmentId(null);
                      setPaymentMethod("");
                      setFinalPrice(2000);
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

              <View style={[tw`flex-row rounded-lg gap-3 p-4 items-center bg-[#D37A0F22]`, {
                borderLeftWidth: 3,
                borderColor: "#D37A0F"
              }]}>
                <InfoIcon color={"#D37A0F"} />
                <Text style={[tw`text-[#D37A0F]`, {
                  fontFamily: fontFamily.MontserratEasyMedium
                }]}>Recommended price: ₦{calculatedPrice || "0"}</Text>
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
                  <TouchableOpacity 
                    onPress={() => setFinalPrice(finalPrice + 500)}
                    style={[tw`p-2 bg-white rounded-full`]}
                  >
                    <Plus/>
                  </TouchableOpacity>
                  <Text style={[tw`text-5xl text-[#00000055]`, {
                    fontFamily: fontFamily.Medium
                  }]}>{finalPrice}</Text>
                  <TouchableOpacity 
                    onPress={() => setFinalPrice(Math.max(0, finalPrice - 500))}
                    style={[tw`p-2 bg-white rounded-full` ]} 
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



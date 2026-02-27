import DeliveryButton from "@/components/Buttons/DeliveryButton";
import SecondaryButton from "@/components/Buttons/SecondaryButons";
import CarrierCard from "@/components/Cards/CarrierCard";
import ShipmentOrderCard from "@/components/Cards/ShipmentOrderCard";
import DropDown from "@/components/DropDown/DropDown";
import CustomTextInput from "@/components/Inputs/CustomTextinput";
import RouteNumberTextInput from "@/components/Inputs/RouteNumberTextInput";
import RouteSearchTextInput from "@/components/Inputs/RouteTextInputs";
import SearchTextInput from "@/components/Inputs/SearchTextInput";
import ShipmentDetailsBottomSheet from "@/components/Sheets/ShipmentDetailsBottomSheet";
import { useShipmentOffers } from "@/components/hooks/useShipmentOffers";
import { useShipmentTracking } from "@/components/hooks/useShipmentTracking";
import { createShippment, offerPrice } from "@/components/services/api/authApi";
import { cancelShipment as cancelShipmentApi, confirmCarrierAcceptance, getShipmentDetails, getShipperCurrentShipments, updateShipmentStatus } from "@/components/services/api/carriersApi";
import * as SecureStore from "@/components/services/storage/secureStore";
import { STORAGE_KEYS } from "@/components/services/storage/storageKeys";
import useAuthStore from "@/components/store/authStore";
import useShipmentStore, { AcceptedShipment } from "@/components/store/shipmentStore";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { DrawerActions } from "@react-navigation/native";
import * as Location from "expo-location";
import { useNavigation, useRouter } from "expo-router";
import { AlignCenter, InfoIcon, MapPin, Minus, Navigation, Plus, Star, X, XIcon } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Animated, { SlideInRight } from "react-native-reanimated";

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
    acceptedShipments,
    setShipmentData,
    addAcceptedShipment,
    updateShipmentTrackingStatus,
    updateCarrierLocation,
    cancelShipment,
    clearShipment,
    loadShipment
  } = useShipmentStore();

  // Live tracking state
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackedShipment, setTrackedShipment] = useState<AcceptedShipment | null>(null);
  const { carrierLocation, shipmentStatus, isConnected, connect: connectTracking, disconnect: disconnectTracking } = useShipmentTracking();
  const { offers, loading: loadingOffers, connect: connectOffers, disconnect: disconnectOffers } = useShipmentOffers();
  const trackingMapRef = useRef<MapView>(null);

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

  const [isAccepting, setIsAccepting] = useState(false);
  const routeSearchSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const OrderDetailSheetRef = useRef<BottomSheet>(null);
  const offerSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();
  const [duration, setDuration] = useState<number>(0)
  const [distance, setDistance] = useState<number>(0)
  const [showDirection, setShowDirection] = useState<boolean>(false);
  const isFormValid = !!(
    pickupAddress &&
    destinationAddress &&
    senderPhone &&
    recipientPhone &&
    recipientName &&
    itemDescription &&
    paymentMethod &&
    createdShipmentId
  );

  const isOrderDetailValid = !!(
    pickupAddress &&
    destinationAddress &&
    origin &&
    destination &&
    senderPhone &&
    recipientPhone &&
    recipientName &&
    itemDescription
  );

  const mapRef = useRef<MapView>(null);

  // Close other sheets when shipment details sheet is opening and restore them after
  const { selectedShipment } = useShipmentStore();
  const [prevUIState, setPrevUIState] = useState<{
    routeSearch: boolean;
    orderDetail: boolean;
    offer: boolean;
    trackingVisible: boolean;
  } | null>(null);

  useEffect(() => {
    if (selectedShipment) {
      // Capture current state if not already captured
      if (!prevUIState) {
        setPrevUIState({
          routeSearch: RouteSearchSheet,
          orderDetail: orderDetailSheet,
          offer: offerSheet,
          trackingVisible: trackingModalVisible,
        });
      }
      
      bottomSheetRef.current?.close();
      setRouteSearchSheet(false);
      setOrderDetailSheet(false);
      setOfferSheet(false);
      setTrackingModalVisible(false);
    } else if (prevUIState) {
      // Restore state
      if (prevUIState.routeSearch) setRouteSearchSheet(true);
      else if (prevUIState.orderDetail) setOrderDetailSheet(true);
      else if (prevUIState.offer) setOfferSheet(true);
      else {
        // If none of the above were open, return to main view
        bottomSheetRef.current?.expand();
      }
      
      if (prevUIState.trackingVisible) setTrackingModalVisible(true);
      
      setPrevUIState(null);
    }
  }, [selectedShipment]);

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, {duration: 1000})
    }
  }
  const { user, fetchUserProfile, isAuthenticated, accessToken } = useAuthStore();
  const GoogleApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const edgePaddingValue = 120;

  const edgePadding = {
    top: 100, // Reduced from 300 to show more map
    bottom: 500, // Increased to account for bottom sheet
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
      
      const updatedState = useShipmentStore.getState();
      if (updatedState.step > 1) {
        bottomSheetRef.current?.expand();
      }
      if (updatedState.origin && updatedState.destination) {
        setShowDirection(true);
      }

      let { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== 'granted') {
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
  }, [loadShipment]);

  // Poll for current shipper shipments
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const fetchCurrent = async () => {
      try {
        // console.log("Polling active shipments for shipper...");
        const currentShipments = await getShipperCurrentShipments(accessToken);
        
        if (currentShipments) {
          const shipmentsList = Array.isArray(currentShipments) ? currentShipments : 
                               (currentShipments.results ? currentShipments.results : [currentShipments]);
          
          const formattedShipments = shipmentsList
            .filter((s: any) => s && s.id)
            .map((s: any) => ({
              id: s.id,
              pickupAddress: s.pickup_address,
              destinationAddress: s.delivery_address,
              calculatedPrice: s.calculated_price,
              finalPrice: parseFloat(s.final_price) || 0,
              paymentMethod: s.payment_method,
              status: (s.status === "accepted" || s.status === "pending") ? "pending" : (s.status === "picked_up" ? "picked" : (s.status === "in_transit" ? "in-transit" : (s.status === "delivered" ? "delivered" : "pending"))),
              trackingStatus: (s.status === "picked" || s.status === "in_transit" || s.is_assigned === true || s.is_assigned === "true") ? "trackable" : "waiting",
              acceptedAt: s.created_at || new Date().toISOString(),
              pickupLatitude: s.pickup_latitude,
              pickupLongitude: s.pickup_longitude,
              deliveryLatitude: s.delivery_latitude,
              deliveryLongitude: s.delivery_longitude,
              isAssigned: s.is_assigned === true || s.is_assigned === "true",
              carrierName: s.driver ? `${s.driver.first_name || ""} ${s.driver.last_name || ""}` : (s.carrier ? `${s.carrier.first_name || ""} ${s.carrier.last_name || ""}` : undefined),
              carrierImage: s.driver?.profile_picture || s.carrier?.profile_picture,
              recipient_name: s.recipient_name || s.recipientName || s.receiver_name,
              recipient_phone: s.recipient_phone || s.recipientPhone || s.receiver_phone,
              package_type: s.package_type || s.packageType || s.delivery_type || s.deliveryType,
              item_description: s.item_description || s.itemDescription || s.description,
            }));

          setShipmentData({ 
            acceptedShipments: formattedShipments as any
          });
        } else {
          setShipmentData({ acceptedShipments: [] });
        }
      } catch (error) {
        console.error("Failed to poll shipments for shipper:", error);
        setShipmentData({ acceptedShipments: [] });
      }
    };

    fetchCurrent();
    const interval = setInterval(fetchCurrent, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, accessToken, setShipmentData]);
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
        if (response.calculated_price) {
          setFinalPrice(parseInt(response.calculated_price));
        }
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
      setchooseCarrierModal(true);
      // setOfferSheet(false);
      // bottomSheetRef.current?.expand();
      // Alert.alert("Success", "Your offer has been sent to riders!");
    } catch (error: any) {
      console.error("Error offering price:", error);
      Alert.alert("Error", error.message || "Failed to send offer");
    }
  }

  const handleCancelRequest = async () => {
    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel this delivery request?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              // If a shipment was already created, cancel it on the backend
              if (createdShipmentId && accessToken) {
                try {
                  await cancelShipmentApi(accessToken as string, createdShipmentId as string | number, "Shipper cancelled request");
                } catch (apiError) {
                  console.error("API Error cancelling shipment:", apiError);
                }
              }

              // Clear the store and local states as requested
              await clearShipment();
              setchooseCarrierModal(false);
              setStep(1);
              setShowDirection(false);
              Alert.alert("Cancelled", "Your delivery request has been cancelled.");
            } catch (error) {
              console.error("Error cancelling shipment:", error);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    console.log(`[DEBUG index.tsx] chooseCarrierModal: ${chooseCarrierModal}, createdShipmentId: ${createdShipmentId} (type: ${typeof createdShipmentId})`);
    if (chooseCarrierModal && createdShipmentId) {
      console.log(`[DEBUG index.tsx] Calling connectOffers with: ${createdShipmentId}`);
      connectOffers(createdShipmentId);
    } else {
      disconnectOffers();
    }
    return () => disconnectOffers();
  }, [chooseCarrierModal, createdShipmentId, connectOffers, disconnectOffers]);

  // Check shipment status for accepted shipments that are still "waiting"
  useEffect(() => {
    const waitingShipments = acceptedShipments.filter(s => s.trackingStatus === "waiting");
    if (waitingShipments.length === 0) return;

    const checkStatuses = async () => {
      const { accessToken: token } = useAuthStore.getState();
      if (!token) return;

      for (const shipment of waitingShipments) {
        try {
          const detail = await getShipmentDetails(token);
          const status = detail?.status;
          const isAssigned = detail?.is_assigned === true;
          
          if (isAssigned) {
            await updateShipmentTrackingStatus(shipment.id, "trackable", true);
          }
        } catch (error) {
          // Silently ignore 404s — shipment may not be accessible yet
        }
      }
    };

    checkStatuses();
    const interval = setInterval(checkStatuses, 8000);
    return () => clearInterval(interval);
  }, [acceptedShipments]);

  // Handle closing live tracking
  const handleCloseTracking = useCallback(() => {
    disconnectTracking();
    setTrackingModalVisible(false);
    setTrackedShipment(null);
  }, [disconnectTracking]);

  const handleCancelShipment = useCallback(async () => {
    if (!trackedShipment) return;
    
    Alert.alert(
      "Cancel Shipment",
      "Are you sure you want to cancel this shipment?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: async () => {
            try {
              const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
              if (token) {
                await updateShipmentStatus(token, trackedShipment.id, "cancelled");
                await cancelShipment(trackedShipment.id);
                handleCloseTracking();
              }
            } catch (error) {
              console.log("Error cancelling shipment:", error);
              Alert.alert("Error", "Failed to cancel shipment. Please try again.");
            }
          }
        }
      ]
    );
  }, [trackedShipment, cancelShipment, handleCloseTracking]);

  // Handle opening live tracking
  const handleTrackShipment = useCallback((shipment: AcceptedShipment) => {
    setTrackedShipment(shipment);
    setTrackingModalVisible(true);
    connectTracking(shipment.id, shipment.status);
  }, [connectTracking]);
  
  // Sync carrier location to store for persistence
  useEffect(() => {
    if (carrierLocation && trackedShipment) {
      updateCarrierLocation(trackedShipment.id, carrierLocation.latitude, carrierLocation.longitude, carrierLocation.heading);
    }
  }, [carrierLocation, trackedShipment, updateCarrierLocation]);

  // Fit map to carrier + route when carrier location updates or modal opens
  useEffect(() => {
    if (trackingModalVisible && trackedShipment && trackingMapRef.current) {
      const coords: LatLng[] = [];
      
      if (carrierLocation) {
        coords.push(carrierLocation);
      }
      
      const pLat = parseFloat(String(trackedShipment.pickupLatitude));
      const pLng = parseFloat(String(trackedShipment.pickupLongitude));
      if (!isNaN(pLat) && !isNaN(pLng)) {
        coords.push({ latitude: pLat, longitude: pLng });
      }
      
      const dLat = parseFloat(String(trackedShipment.deliveryLatitude));
      const dLng = parseFloat(String(trackedShipment.deliveryLongitude));
      if (!isNaN(dLat) && !isNaN(dLng)) {
        coords.push({ latitude: dLat, longitude: dLng });
      }

      if (coords.length > 0) {
        // Use a small timeout to ensure map is ready if modal just opened
        const timeout = setTimeout(() => {
          trackingMapRef.current?.fitToCoordinates(coords, {
            edgePadding: { top: 100, right: 70, bottom: 450, left: 70 },
            animated: true,
          });
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [carrierLocation, trackingModalVisible, trackedShipment]);

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
          strokeWidth={3}
          onReady={trackRouteOnReady}
       />
        }
        {acceptedShipments.map((shipment) => (
          (shipment.carrierLatitude && shipment.carrierLongitude) ? (
            <Marker
              key={`carrier-${shipment.id}`}
              coordinate={{
                latitude: shipment.carrierLatitude!,
                longitude: shipment.carrierLongitude!
              }}
              title={`Carrier for #${shipment.id}`}
              anchor={{ x: 0.5, y: 0.5 }}
              rotation={shipment.carrierHeading || 0}
              flat={true}
            >
               <Image 
                source={require("../../assets/images/IntroImages/icon/Car.png")} 
                style={[tw`w-10 h-10`, { resizeMode: "contain" }]} 
              />
            </Marker>
          ) : null
        ))}
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
      <Modal
          transparent={true}
          onRequestClose={() => {
            setchooseCarrierModal(false);
          }}
          animationType="slide"
          visible={chooseCarrierModal}
        >
          <View style={[tw`flex-1 px-5 pt-15 bg-black/80 gap-6`]}>
            <TouchableOpacity onPress={handleCancelRequest} style={[tw`bg-[#D37A0F88] flex-row items-center gap-2 px-3 py-2 self-start rounded-full`]}>
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
  const carrierName = offer.carrier?.first_name
    ? `${offer.carrier.first_name} ${offer.carrier.last_name || ""}`
    : offer.carrier_first_name
    ? `${offer.carrier_first_name} ${offer.carrier_last_name || ""}`
    : "Carrier";

  const carrierImage = offer.carrier?.profile_picture
    ? { uri: offer.carrier.profile_picture }
    : require("../../assets/images/pfp.png");

  const vehicleType = offer.carrier?.vehicle_type?.name
    || offer.vehicle_type_display
    || "Rider";

                  return (
                    <Animated.View 
                      entering={SlideInRight.delay(index * 100)}
                      key={offer.id || index}
                    >
                    <CarrierCard
                      name={carrierName}
                      amount={offer.final_price || offer.offered_price || finalPrice}
        carrierType={vehicleType as any}
        image={carrierImage}
        rating={offer.rating || 4.5}
        time={offer.distance_display || "Nearby"}
        totalRides={offer.carrier?.total_trips || 0}
                      acceptOnPress={async () => {
                        if (isAccepting) return;
                        try {
                          setIsAccepting(true);
                          // Try to find the carrier ID in various possible structures
                          const carrierId = 
                            offer.carrier?.id || 
                            offer.acceptance_sender?.id || 
                            offer.user?.id || 
                            offer.carrier_id;

                          if (!accessToken || !createdShipmentId || !carrierId) {
                            console.error("Missing info. Offer object:", JSON.stringify(offer, null, 2));
                            Alert.alert("Error", "Missing required information to accept offer. Check console.");
                            return;
                          }
                          const response = await confirmCarrierAcceptance(accessToken, createdShipmentId, carrierId);
                          console.log("Carrier accepted successfully:", response);

                          // Build the accepted shipment object and save to the array
                          const carrierObj = offer.carrier || offer.acceptance_sender || offer.user || {};
                          const acceptedShipment: AcceptedShipment = {
                            id: createdShipmentId,
                            pickupAddress,
                            destinationAddress,
                            calculatedPrice,
                            finalPrice: offer.final_price || offer.offered_price || finalPrice,
                            paymentMethod,
                            status: "pending",
                            trackingStatus: "waiting",
                            acceptedAt: new Date().toISOString(),
                            carrierName: carrierObj?.first_name ? `${carrierObj.first_name} ${carrierObj.last_name || ""}` : "Carrier",
                            carrierImage: carrierObj?.profile_picture || undefined,
                            pickupLatitude: origin?.latitude?.toFixed(6),
                            pickupLongitude: origin?.longitude?.toFixed(6),
                            deliveryLatitude: destination?.latitude?.toFixed(6),
                            deliveryLongitude: destination?.longitude?.toFixed(6),
                            isAssigned: response?.is_assigned === true,
                          };
                          await addAcceptedShipment(acceptedShipment);

                          // Clear form for a fresh request
                          await clearShipment();
                          setShowDirection(false);
                          setchooseCarrierModal(false);
                          bottomSheetRef.current?.expand();
                          Alert.alert("Success", "Carrier selected! Your shipment is now being processed.");
                        } catch (error: any) {
                          console.error("Error accepting carrier:", error);
                          Alert.alert("Error", error.message || "Failed to accept carrier");
                        } finally {
                          setIsAccepting(false);
                        }
                      }}
                      declineOnPress={() => {
                        // Optional: ignore this offer
                      }}
                    />
                    </Animated.View>
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
          <BottomSheetView style={[tw`justify-center pb-10`]}
          >
            
          {step === 1 && (
          <View style={[tw`gap-5`]}>
            <View style={tw`px-5`}>
              <SearchTextInput placeholderText="Track your shipment" />
            </View>
              {acceptedShipments.length > 0 ? (
                <FlatList
                  data={acceptedShipments}
                  horizontal
                  decelerationRate="fast"
                  snapToInterval={Dimensions.get('window').width - 40 + 12}
                  snapToAlignment="start"
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                  renderItem={({ item }) => (
                    <View style={{ width: Dimensions.get('window').width - 40 }}>
                      <ShipmentOrderCard
                        cardTitle="Current Shipping"
                        shippingId={`#${item.id}`}
                        pickupLocation={item.pickupAddress}
                        destinationLocation={item.destinationAddress}
                        pickupDate={new Date(item.acceptedAt).toLocaleDateString()}
                        status={item.status}
                        trackingStatus={item.trackingStatus}
                        isAssigned={item.isAssigned}
                        onTrackPress={() => handleTrackShipment(item)}
                        fullData={item}
                      />
                    </View>
                  )}
                />
              ) : (
                <View style={tw`px-8 py-5 items-center justify-center`}>
    {/* Optional: Add an Image or Lottie animation here */}
    <View style={[tw`w-20 h-20 rounded-full items-center justify-center bg-gray-50 mb-4`]}>
        <Image 
          source={require("../../assets/images/IntroImages/icon/pin.png")} // Use a box or package icon
                        style={[tw`w-12 h-12`, { opacity: 0.3 }]} 
                        resizeMode="contain"
        />
    </View>
    
    <Text style={[tw`text-lg text-center`, { 
        fontFamily: fontFamily.MontserratEasyBold, 
        color: '#1A1A1A' 
    }]}>
      No Active Shipments
    </Text>
    
    <Text style={[tw`text-sm text-center mt-2 text-gray-500`, { 
        fontFamily: fontFamily.MontserratEasyMedium 
    }]}>
      You don't have any shipments running right now. Ready to send something new?
    </Text>
    
    {/* Optional: Small shortcut button specifically for the empty state
    <TouchableOpacity 
      style={[tw`mt-6 px-6 py-2 rounded-full`, { backgroundColor: themeColors.primaryColor + '15' }]}
      onPress={() => setStep(2)}
    >
      <Text style={{ color: themeColors.primaryColor, fontFamily: fontFamily.MontserratEasyBold }}>
        + Create Request
      </Text>
    </TouchableOpacity> */}
  </View>
              )}
            <View style={[tw`flex-row justify-between items-center gap-2 px-5`]}>
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
                onpress={async () => {
                  await clearShipment();
                  setShowDirection(false);
                  setStep(2);
                }}
              />
            </View>
          </View>
          )}
          {step === 2 && (
            <View style={[tw`gap-5 px-5`]}>
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
                bgColors={isFormValid ? themeColors.primaryColor : "#ccc"}
                text="Find Rider"
                height={50}
                textColor={"white"}
                disabled={!isFormValid}
                onpress={() => {
                  if (isFormValid) {
                    handleOfferPrice();
                    bottomSheetRef.current?.close();
                    setchooseCarrierModal(true);
                  }
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
          <BottomSheetScrollView style={[tw`flex-1 px-5 pb-15`]}
            contentContainerStyle={[tw`pb-10`]}
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
                    onPress={() => setItemValue(prev => prev + 100)}
                  >
                    <Plus/>
                  </TouchableOpacity>
                  <Text style={[tw`text-5xl text-[#00000055]`, {
                    fontFamily: fontFamily.Medium
                  }]}>{itemValue}</Text>
                  <TouchableOpacity 
                    style={[tw`p-2 bg-white rounded-full`]}
                    onPress={() => setItemValue(prev => Math.max(0, prev - 100))}
                  >
                  <Minus/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={tw`mt-5`}>
              <SecondaryButton
                bgColors={isOrderDetailValid ? themeColors.primaryColor : "#ccc"}
                text="Find Rider"
                height={50}
                textColor={"white"}
                disabled={!isOrderDetailValid}
                onpress={handleCreateEvent}
              />
            </View>
        </BottomSheetScrollView>
  
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
                    onPress={() => setFinalPrice(finalPrice + 100)}
                    style={[tw`p-2 bg-white rounded-full`]}
                  >
                    <Plus/>
                  </TouchableOpacity>
                  <Text style={[tw`text-5xl text-[#00000055]`, {
                    fontFamily: fontFamily.Medium
                  }]}>{finalPrice}</Text>
                  <TouchableOpacity 
                    onPress={() => setFinalPrice(Math.max(0, finalPrice - 100))}
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

      {/* Live Tracking Modal */}
      <Modal
        visible={trackingModalVisible}
        animationType="slide"
        onRequestClose={handleCloseTracking}
      >
        <View style={[tw`flex-1`]}>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={trackingMapRef}
            style={[tw`flex-1`]}
            initialRegion={{
              latitude: carrierLocation?.latitude || trackedShipment?.carrierLatitude || (trackedShipment?.pickupLatitude ? parseFloat(String(trackedShipment.pickupLatitude)) : 6.5244),
              longitude: carrierLocation?.longitude || trackedShipment?.carrierLongitude || (trackedShipment?.pickupLongitude ? parseFloat(String(trackedShipment.pickupLongitude)) : 3.3792),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsPointsOfInterest={false}
            showsBuildings={false}
            showsCompass={false}
            mapType="standard"
          >
            {/* Carrier live marker */}
            {(carrierLocation || (trackedShipment?.carrierLatitude && trackedShipment?.carrierLongitude)) && (
              <Marker
                coordinate={{
                  latitude: carrierLocation?.latitude || trackedShipment!.carrierLatitude!,
                  longitude: carrierLocation?.longitude || trackedShipment!.carrierLongitude!
                }}
                title="Carrier"
                rotation={carrierLocation?.heading || 0}
                anchor={{ x: 0.5, y: 0.5 }}
                flat={true}
              >
                <View style={[tw`items-center justify-center`]}>
                   <Image 
                    source={require("../../assets/images/IntroImages/icon/Car.png")} 
                    style={[tw`w-12 h-12`, { resizeMode: "contain" }]} 
                  />
                </View>
              </Marker>
            )}

            {/* Pickup marker */}
            {trackedShipment?.pickupLatitude && trackedShipment?.pickupLongitude && (
              <Marker
                coordinate={{
                  latitude: parseFloat(trackedShipment.pickupLatitude),
                  longitude: parseFloat(trackedShipment.pickupLongitude),
                }}
                title="Pickup"
              >
                <Image style={[tw`w-10 h-10`, { resizeMode: "contain" }]} source={require("../../assets/images/IntroImages/icon/pin.png")} />
              </Marker>
            )}

            {/* Delivery marker */}
            {trackedShipment?.deliveryLatitude && trackedShipment?.deliveryLongitude && (
              <Marker
                coordinate={{
                  latitude: parseFloat(trackedShipment.deliveryLatitude),
                  longitude: parseFloat(trackedShipment.deliveryLongitude),
                }}
                title="Delivery"
              >
                <Image style={[tw`w-10 h-10`, { resizeMode: "contain" }]} source={require("../../assets/images/IntroImages/icon/pin.png")} />
              </Marker>
            )}

            {/* Route directions (Full Path) */}
            {trackedShipment?.pickupLatitude != null && 
             trackedShipment?.deliveryLatitude != null && (
              <MapViewDirections
                origin={{
                  latitude: parseFloat(String(trackedShipment.pickupLatitude)),
                  longitude: parseFloat(String(trackedShipment.pickupLongitude)),
                }}
                destination={{
                  latitude: parseFloat(String(trackedShipment.deliveryLatitude)),
                  longitude: parseFloat(String(trackedShipment.deliveryLongitude)),
                }}
                apikey={GoogleApiKey || ""}
                strokeColor={themeColors.primaryColor + "55"} // Faded full route
                strokeWidth={3}
              />
            )}

            {/* Live Carrier Directions (Current segment) */}
            {(carrierLocation || (trackedShipment?.carrierLatitude && trackedShipment?.carrierLongitude)) && trackedShipment && (
              <MapViewDirections
                origin={{
                  latitude: carrierLocation?.latitude || trackedShipment.carrierLatitude!,
                  longitude: carrierLocation?.longitude || trackedShipment.carrierLongitude!
                }}
                destination={
                  (trackedShipment.status === "picked" || trackedShipment.status === "in-transit")
                    ? { latitude: parseFloat(String(trackedShipment.deliveryLatitude!)), longitude: parseFloat(String(trackedShipment.deliveryLongitude!)) }
                    : { latitude: parseFloat(String(trackedShipment.pickupLatitude!)), longitude: parseFloat(String(trackedShipment.pickupLongitude!)) }
                }
                apikey={GoogleApiKey || ""}
                strokeColor={themeColors.primaryColor} // Solid active segment
                strokeWidth={5}
                onReady={(result) => {
                  console.log(`Route to next point: ${result.distance}km, ${result.duration}min`);
                }}
              />
            )}
          </MapView>

          {/* Close button */}
          <TouchableOpacity
            onPress={handleCloseTracking}
            style={[tw`absolute top-15 left-5 p-3 rounded-full`, { backgroundColor: themeColors.background }]}
          >
            <X size={22} color={themeColors.primaryColor} />
          </TouchableOpacity>

          {/* Connection status badge */}
          <View style={[tw`absolute top-15 right-5`]}>
            <View style={[tw`flex-row items-center gap-1 px-3 py-2 rounded-full`, {
              backgroundColor: isConnected ? "#ECFDF5" : "#FEF2F2"
            }]}>
              <View style={[tw`w-2 h-2 rounded-full`, {
                backgroundColor: isConnected ? "#10B981" : "#EF4444"
              }]} />
              <Text style={[tw`text-[10px]`, {
                fontFamily: fontFamily.MontserratEasyMedium,
                color: isConnected ? "#065F46" : "#991B1B"
              }]}>{isConnected ? "LIVE" : "CONNECTING..."}</Text>
            </View>
          </View>

          {/* Bottom info panel */}
          {trackedShipment && (
            <View style={[tw`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl px-5 pt-5 pb-10`, {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 10,
            }]}>
              {/* Header */}
              <View style={[tw`flex-row justify-between items-center mb-4`]}>
                <View style={[tw`flex-row items-center gap-2`]}>
                  <Navigation size={20} color="#19488A" />
                  <Text style={[tw`text-lg`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>Live Tracking</Text>
                </View>
                {isConnected && (
                  <View style={[tw`flex-row items-center gap-1 bg-green-100 px-3 py-1 rounded-full`]}>
                    <View style={[tw`w-2 h-2 rounded-full bg-green-500`]} />
                    <Text style={[tw`text-[10px] text-green-700`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>LIVE</Text>
                  </View>
                )}
              </View>

              {/* Route info */}
              <View style={[tw`gap-3 mb-4`]}>
                <View style={[tw`flex-row items-center gap-2`]}>
                  <Image style={[tw`h-5 w-5`]} source={require("../../assets/images/IntroImages/LocationMarker.png")} />
                  <View style={[tw`h-4 border border-[#19488A33]`]} />
                  <Text style={[tw`uppercase text-xs flex-1`, {
                    fontFamily: fontFamily.MontserratEasyMedium
                  }]} numberOfLines={1}>{trackedShipment.pickupAddress}</Text>
                </View>
                <View style={[tw`flex-row items-center gap-2`]}>
                  <Image style={[tw`h-5 w-5`]} source={require("../../assets/images/IntroImages/LocationMarker2.png")} />
                  <View style={[tw`h-4 border border-[#19488A33]`]} />
                  <Text style={[tw`uppercase text-xs flex-1`, {
                    fontFamily: fontFamily.MontserratEasyMedium
                  }]} numberOfLines={1}>{trackedShipment.destinationAddress}</Text>
                </View>
                <View>
                  <Text style={[tw`text-xs uppercase`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{(() => {
                      const type = (trackedShipment.delivery_type || "").charAt(0).toUpperCase() + (trackedShipment.delivery_type || "").slice(1);
                      const str = `${type}, From ${trackedShipment.sender_phone}, to ${trackedShipment.recipient_phone}`;
                      return str.length > 35 ? str.slice(0, 35) + "..." : str;
                    })()}</Text>
                  
                </View>
                <View style={[tw`flex-row items-center gap-2`]}>
                  <Image style={[tw`h-5 w-5`]} source={require("../../assets/images/IntroImages/LocationMarker2.png")} />
                  <View style={[tw`h-4 border border-[#19488A33]`]} />
                  <View style={[tw`flex-row items-center gap-1`]}>
                    <Text style={[tw`uppercase text-xs`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{"\u20A6"}{trackedShipment.finalPrice},</Text>
                    <Text style={[tw`uppercase text-xs`]}>{trackedShipment.paymentMethod}</Text>
                  </View>
                </View>
              </View>

              {/* Carrier info */}
              <View style={[tw`flex-row items-center justify-between`]}>
                <View style={[tw`flex-row items-center gap-2`]}>
                  <Image
                    style={[tw`h-12 w-12 rounded-full`]}
                    source={trackedShipment.carrierImage ? { uri: trackedShipment.carrierImage } : require("../../assets/images/pfp.png")}
                  />
                  <View style={[tw`gap-1`]}>
                    <Text style={[tw`uppercase`, {
                      fontFamily: fontFamily.MontserratEasyBold
                    }]}>{trackedShipment.carrierName || "Carrier"}</Text>
                    <View style={[tw`flex-row items-center gap-1`]}>
                      <Star fill={themeColors.primaryColor} size={12} />
                      <Text style={[tw`text-xs`, {
                        fontFamily: fontFamily.MontserratEasyLight
                      }]}>4.5(279)</Text>
                    </View>
                  </View>
                </View>
                <Text style={[tw`text-lg`, {
                  fontFamily: fontFamily.MontserratEasyBold,
                  color: themeColors.primaryColor
                }]}>{"\u20A6"}{trackedShipment.finalPrice}</Text>
              </View>

              <TouchableOpacity
                onPress={handleCancelShipment}
                style={[tw`mt-6 w-full h-[50px] bg-red-500 rounded-xl items-center justify-center`]}
              >
                <Text style={[tw`text-white`, {
                  fontFamily: fontFamily.MontserratEasyBold
                }]}>Cancel Shipment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    
      <ShipmentDetailsBottomSheet />
    </View>
  );
};

export default UserHomePage;



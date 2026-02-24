import BackButton from "@/components/Buttons/BackButton";
import { useLocationTracking } from "@/components/hooks/useLocationTracking";
import { acceptRequest, getShipmentDetails, requestShippments } from "@/components/services/api/carriersApi";
import * as SecureStore from "@/components/services/storage/secureStore";
import { STORAGE_KEYS } from "@/components/services/storage/storageKeys";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { ChevronRight, Gift, MessageCircle, MoreVertical, PhoneCall, Star } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Animated, { SlideInRight } from "react-native-reanimated";

interface IRequestScreenProps {

}

const RequestScreen = ({

}: IRequestScreenProps) => {

    const router = useRouter();
      const colorScheme = useColorScheme();
      const themeColors = Colors[colorScheme ?? "light"];
    const snapPoints = useMemo(() => ["85%"], []);
    const acceptedSheetSnapPoints = useMemo(() => ["30%"], []);
    const requestSheetRef = useRef<BottomSheet>(null);
    const acceptedSheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef<MapView>(null);

    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [acceptedRequest, setAcceptedRequest] = useState<any>(null);
    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [isAssigned, setIsAssigned] = useState(false);
  const GoogleApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  const {isOnline} = useAuthStore();
  const { startTracking, stopTracking, isTracking } = useLocationTracking();

    const edgePadding = {
      top: 50,
      right: 50,
      bottom: 300,
      left: 50,
    };

    const traceRoute = useCallback((request: any) => {
      if (request.pickup_latitude && request.pickup_longitude && request.delivery_latitude && request.delivery_longitude) {
        const origin = {
          latitude: parseFloat(request.pickup_latitude),
          longitude: parseFloat(request.pickup_longitude),
        };
        const destination = {
          latitude: parseFloat(request.delivery_latitude),
          longitude: parseFloat(request.delivery_longitude),
        };
        mapRef.current?.fitToCoordinates([origin, destination], {
          edgePadding,
          animated: true,
        });
      }
    }, []);

    const fetchShipments = useCallback(async (pageNum: number = 1, append: boolean = false, silent: boolean = false) => {
      if (acceptingId && !append) return; // Don't refresh whole list while accepting
      
      try {
        if (append) {
          setLoadingMore(true);
        } else if (!silent) {
          setLoading(true);
        }
        const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await requestShippments(token, pageNum);
        const results = data.results || [];
        
        // Final check before state update to prevent race conditions
        if (acceptingId && !append) return;

        if (append) {
          setRequests(prev => [...prev, ...results]);
        } else {
          setRequests(results);
        }
        setHasNextPage(!!data.next);
        setPage(pageNum);
      } catch (error) {
        console.log("Error fetching shipments:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }, [acceptingId]);

    useEffect(() => {
      fetchShipments(1);
    }, [fetchShipments]);

    useEffect(() => {
      // Start polling every 5 seconds
      const interval = setInterval(() => {
        // Only poll if we're not currently accepting a request or loading
        if (!acceptedRequest && !loading && !loadingMore && !acceptingId) {
          fetchShipments(1, false, true);
        }
      }, 5000);

      return () => clearInterval(interval);
    }, [fetchShipments, acceptedRequest, loading, loadingMore, acceptingId]);

    const loadMore = useCallback(() => {
      if (!loadingMore && hasNextPage) {
        fetchShipments(page + 1, true);
      }
    }, [loadingMore, hasNextPage, page, fetchShipments]);

    const handleAccept = useCallback(async (request: any) => {
      if (acceptingId) return;
      
      try {
        setAcceptingId(request.id);
        const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token) return;
        
        console.log(`Rider accepting shipment ${request.id}...`);
        await acceptRequest(token, request.id);
        
        // Remove from local list immediately to prevent double-rendering/animations
        setRequests(prev => prev.filter(r => r.id !== request.id));
        
        // Update state to stop polling and show detail sheet
        setAcceptedRequest(request);
        traceRoute(request);
        
        // Use a small delay for sheet transitions to prevent gorhom/bottom-sheet glitches
        requestSheetRef.current?.close();
        setTimeout(() => {
          acceptedSheetRef.current?.expand();
        }, 100);
      } catch (error) {
        console.log("Failed to accept shipment:", error);
      } finally {
        setAcceptingId(null);
      }
    }, [acceptingId, traceRoute]);

    const openAcceptedSheet = useCallback((request: any) => {
      setAcceptedRequest(request);
      requestSheetRef.current?.close();
      acceptedSheetRef.current?.expand();
    }, []);

    const handleGoBack = useCallback(() => {
      acceptedSheetRef.current?.close();
      requestSheetRef.current?.expand();
    }, []);

    const closeAcceptedSheet = useCallback(() => {
      stopTracking();
      acceptedSheetRef.current?.close();
      setAcceptedRequest(null);
      setIsAssigned(false);
      requestSheetRef.current?.expand();
    }, []);

    // Poll shipment status using carrier endpoint until shipper confirms
    useEffect(() => {
      if (!acceptedRequest || isAssigned) return;

      const pollStatus = async () => {
        try {
          const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          if (!token) return;

          // Use direct shipment ID polling to get the latest assignment field
          // Use carrier's current shipment endpoint
          try {
            const data = await getShipmentDetails(token);
            // Enhanced logging to see the exact structure and values
            console.log("DEBUG: Current shipment data for carrier:", JSON.stringify(data, null, 2));

            const results = data?.results || data || [];
            const shipment = Array.isArray(results) ? results[0] : (results.id ? results : null);

            if (shipment) {
              const status = shipment.status || shipment.shipment_status || shipment.request_status;
              const remoteId = String(shipment.id || shipment.shipment_id || "");
              const localId = String(acceptedRequest.id);
              
              console.log(`DEBUG: Polling Shipment ID: ${remoteId} (Local ID: ${localId})`);
              console.log(`DEBUG: Shipment Status: ${status}, is_assigned: ${shipment.is_assigned} (type: ${typeof shipment.is_assigned})`);

              // Verify this is actually the shipment we accepted
              if (remoteId !== localId && remoteId !== "") {
                console.log("DEBUG: Mismatch! This shipment is not the one we just accepted. Ignoring.");
                return;
              }

              // ONLY trigger tracking when is_assigned is strictly true
              if (shipment.is_assigned === true || shipment.is_assigned === "true") {
                console.log("[Rider] SUCCESS! Shipment is assigned. Starting tracking for ID:", acceptedRequest.id);
                setIsAssigned(true);
                startTracking(acceptedRequest.id, status || "status");
                acceptedSheetRef.current?.snapToIndex(0);
              } else {
                console.log("[Rider] Poll: Shipment not yet assigned. Status:", status, "is_assigned:", shipment.is_assigned);
              }
            } else {
              console.log("DEBUG: No active shipment found for carrier.");
            }
          } catch (error) {
            // Silently ignore 404/polling errors
          }
        } catch (error) {
          // Keep generic catch but silent to avoid spam
        }
      };

      pollStatus(); // Initial check
      const interval = setInterval(pollStatus, 5000);
      return () => clearInterval(interval);
    }, [acceptedRequest, isAssigned]);

    
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
              {acceptedRequest && (
                <>
                  <Marker
                    coordinate={{
                      latitude: parseFloat(acceptedRequest.pickup_latitude),
                      longitude: parseFloat(acceptedRequest.pickup_longitude),
                    }}
                  >
                    <Image style={[tw`w-10 h-10`, { resizeMode: "contain" }]} source={require("../../assets/images/IntroImages/icon/pin.png")}/>
                  </Marker>
                  <Marker
                    coordinate={{
                      latitude: parseFloat(acceptedRequest.delivery_latitude),
                      longitude: parseFloat(acceptedRequest.delivery_longitude),
                    }}
                  >
                    <Image style={[tw`w-10 h-10`, { resizeMode: "contain" }]} source={require("../../assets/images/IntroImages/icon/pin.png")}/>
                  </Marker>
                  <MapViewDirections
                    origin={{
                      latitude: parseFloat(acceptedRequest.pickup_latitude),
                      longitude: parseFloat(acceptedRequest.pickup_longitude),
                    }}
                    destination={{
                      latitude: parseFloat(acceptedRequest.delivery_latitude),
                      longitude: parseFloat(acceptedRequest.delivery_longitude),
                    }}
                    apikey={GoogleApiKey || ""}
                    strokeColor={themeColors.primaryColor}
                    strokeWidth={6}
                  />
                </>
              )}
                </MapView>
            <BottomSheet
        snapPoints={snapPoints}
        ref={requestSheetRef}
        backgroundStyle={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}
      >
          <BottomSheetScrollView style={[tw`p-5`]}>
            {!isOnline ?  (
              <View style={[tw`items-center justify-center`]}>
                <Text style={[tw`mt-3 text-sm`, { fontFamily: fontFamily.MontserratEasyMedium }]}>You are offline</Text>
              </View>
            ) : (
                <View>
                     {loading ? (
                      <View style={[tw`items-center justify-center py-20`]}>
                        <ActivityIndicator size="large" color={themeColors.primaryColor} />
                        <Text style={[tw`mt-3 text-sm`, { fontFamily: fontFamily.MontserratEasyMedium }]}>Loading requests...</Text>
                      </View>
                    ) : requests.length === 0 ? (
                      <View style={[tw`items-center justify-center py-20`]}>
                        <Text style={[tw`text-sm`, { fontFamily: fontFamily.MontserratEasyMedium }]}>No requests available</Text>
                      </View>
                    ) : (
                    <>
                    <View style={[tw`gap-2`]}>
                        {requests.map((request: any, index: number) => (
                                <Animated.View 
                                  entering={SlideInRight.delay(index * 100)}
                                  key={request.id} 
                                  style={[tw`flex-row bg-white/80 items-center gap-5 px-5 py-4 rounded-lg`]}
                                >
                                    <View style={[tw`items-center gap-3 w-[60px]`]}>
                                        <View style={[tw`h-14 w-14 rounded-full bg-[#19488A] flex items-center justify-center`]}>
                                            <Gift color="white" size={30}/>
                                        </View>
                                        <View style={[tw`items-center`]}>
                                        <Text style={[tw`text-[11px]`, {
                                                fontFamily: fontFamily.MontserratEasyRegular
                                            }]}>{request.recipient_name || "Shipper"}</Text>
                                            
                                        </View>
                                    </View>
                                    <View style={[tw`gap-2 flex-1`]}>
                                        <View style={[tw`flex-row items-center gap-3`]}>
                                        <Text style={[tw`text-xl`, {
                                            fontFamily: fontFamily.MontserratEasyMedium
                                        }]}>{"\u20A6"}{request.calculated_price}</Text>
                                        <View style={[tw`h-3 border-1 border`]} />
                                        <Text style={[tw`text-[#19488A33]`, {
                                            fontFamily: fontFamily.MontserratEasyMedium
                                        }]}>{request.distance_display}</Text>
                                    </View>
                                    <View style={[tw`gap-1`]}>
                                    <View style={[tw`flex-row items-center gap-2`]}>
                                        <Image style={[tw`h-4 w-4`]} source={require("../../assets/images/IntroImages/LocationMarker.png")} />
                                            <Text numberOfLines={2} style={[tw`uppercase text-[10px] flex-1`, {
                                            fontFamily: fontFamily.MontserratEasyMedium
                                        }]}>{request.pickup_address}</Text>
                                        </View>
                                    <View style={[tw`flex-row items-center gap-2`]} >
                                        <Image style={[tw`h-4 w-4`]} source={require("../../assets/images/IntroImages/LocationMarker2.png")} />
                                        <Text numberOfLines={2} style={[tw`uppercase text-[10px] flex-1`, {
                                            fontFamily: fontFamily.MontserratEasyMedium
                                        }]}>{request.delivery_address}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => handleAccept(request)}
                                      disabled={acceptingId === request.id}
                                      style={[tw`bg-[#19488A] flex-row items-center w-25 justify-between px-4 py-1.5 rounded-full gap-2`, acceptingId === request.id && tw`opacity-50`]}>
                                        {acceptingId === request.id ? (
                                          <ActivityIndicator size="small" color="white" />
                                        ) : (
                                          <>
                                            <Text style={[tw`text-white text-xs`, {
                                                fontFamily: fontFamily.MontserratEasyBold
                                            }]}>Accept</Text>
                                            <ChevronRight size={15} color="white"/>
                                          </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                </Animated.View>
                            ))}
           </View>
                    {hasNextPage && (
                      <TouchableOpacity
                        onPress={loadMore}
                        style={[tw`items-center py-4`]}
                      >
                        {loadingMore ? (
                          <ActivityIndicator size="small" color={themeColors.primaryColor} />
                        ) : (
                          <Text style={[tw`text-sm`, { fontFamily: fontFamily.MontserratEasyMedium, color: themeColors.primaryColor }]}>Load More</Text>
                        )}
                      </TouchableOpacity>
                    )}
                    </>
                    )}
                </View>
                
            )}
                   
        </BottomSheetScrollView>
      </BottomSheet>

        {/* Accepted request detail sheet - Waiting for shipper */}
        <BottomSheet
          snapPoints={acceptedSheetSnapPoints}
          ref={acceptedSheetRef}
          enablePanDownToClose={true}
          index={-1}
          onClose={() => {
            if (!isAssigned) {
              setAcceptedRequest(null);
              requestSheetRef.current?.expand();
            }
          }}
        >
          <BottomSheetView style={[tw`px-5 pb-10`]}>
            {acceptedRequest && (
              <View style={[tw`gap-5`]}>
               <View style={[tw`flex-row justify-between items-center`]}>
                  <Text style={[tw`text-lg`, {
                    fontFamily: fontFamily.MontserratEasyBold
                  }]}>Waiting for Confirmation</Text>
                </View>
                <View style={[tw`gap-4 px-4`]}>           
                  <View style={[tw`flex-row items-center gap-2`]}>
                    <Image style={[tw`h-5 w-5`]} source={require("../../assets/images/IntroImages/LocationMarker.png")} />
                    <View style={[tw`h-4 border border-1 border-[#19488A33]`]} />
                    <Text style={[tw`uppercase text-xs flex-1`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{acceptedRequest.pickup_address}</Text>
                  </View>
                  <View style={[tw`flex-row items-center gap-2`]}>
                    <Image style={[tw`h-5 w-5`]} source={require("../../assets/images/IntroImages/LocationMarker2.png")} />
                    <View style={[tw`h-4 border border-1 border-[#19488A33]`]} />
                    <Text style={[tw`uppercase text-xs flex-1`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{acceptedRequest.delivery_address}</Text>
                  </View>
                  <View style={[tw`flex-row items-center gap-2`]}>
                    <Image style={[tw`h-5 w-5`]} source={require("../../assets/images/IntroImages/icon/Details.png")} />
                    <View style={[tw`h-4 border border-1 border-[#19488A33]`]} />
                    <Text style={[tw`text-xs uppercase`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{(() => {
                      const type = (acceptedRequest.delivery_type || "").charAt(0).toUpperCase() + (acceptedRequest.delivery_type || "").slice(1);
                      const str = `${type}, From ${acceptedRequest.sender_phone}, to ${acceptedRequest.recipient_phone}`;
                      return str.length > 35 ? str.slice(0, 35) + "..." : str;
                    })()}</Text>
                  </View>
                  <View style={[tw`flex-row items-center gap-2`]}> 
                    <Image style={[tw`h-5 w-5`]} source={require("../../assets/images/IntroImages/icon/Offer.png")} />
                    <View style={[tw`h-4 border border-1 border-[#19488A33]`]} />
                    <Text style={[tw`text-xs uppercase`, {
                      fontFamily: fontFamily.MontserratEasyMedium
                    }]}>{acceptedRequest.final_price + " Via " + acceptedRequest.payment_method}</Text>
                  </View>
                </View>
                <View style={[tw`flex-row items-center justify-between`]}>
                  <View style={[tw`flex-row items-center gap-2`]}>
                    <Image style={[tw`h-12 w-12 rounded-full`]} source={require("../../assets/images/pfp.png")} />
                    <View style={[tw`gap-2`]}>
                      <Text style={[tw`uppercase`, {
                        fontFamily: fontFamily.MontserratEasyBold
                      }]}>{acceptedRequest.recipient_name || "Shipper"}</Text>
                      <View style={[tw`flex-row items-center gap-2`]}>
                        <Star fill="black" size={15}/>
                        <Text style={[tw`text-xs uppercase`, {
                          fontFamily: fontFamily.MontserratEasyLight
                        }]}>4.5 (270)</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[tw`flex-row items-center gap-5`]}>
                    <TouchableOpacity>
                      <MessageCircle/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <PhoneCall/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <MoreVertical />
                    </TouchableOpacity>
                  </View>
                </View>
                {(() => {
                  console.log(`DEBUG RENDER: isAssigned is ${isAssigned}`);
                  return null;
                })()}
                {!isAssigned ? (
                  <View style={[tw`flex-row items-center justify-center gap-3 py-3 rounded-full border`, { borderColor: "#19488A" }]}>
                    <ActivityIndicator size="small" color="#19488A" />
                    <Text style={[tw`text-sm`, {
                      fontFamily: fontFamily.MontserratEasyBold,
                      color: "#19488A"
                    }]}>Waiting for shipper to confirm...</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      // Navigate to index where map shows tracking
                      router.push("/(Rider-Drawer)");
                    }}
                    style={[tw`flex-row items-center justify-center gap-2 py-3 rounded-full`, { backgroundColor: "#19488A" }]}
                  >
                    <View style={[tw`w-2 h-2 rounded-full bg-green-400`]} />
                    <Text style={[tw`text-sm text-white`, { fontFamily: fontFamily.MontserratEasyBold }]}>Track Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>



        {/* Back button - rendered last to be on top of everything */}
        <View style={[tw`absolute top-15 left-5`, { zIndex: 999 }]}>
          <BackButton
            onPress={() => {
              if (isAssigned) {
                Alert.alert(
                  "Stop Tracking?",
                  "Are you sure you want to go back? This will stop live tracking.",
                  [
                    { text: "No", style: "cancel" },
                    {
                      text: "Yes",
                      style: "destructive",
                      onPress: () => closeAcceptedSheet()
                    }
                  ]
                );
              } else if (acceptedRequest) {
                closeAcceptedSheet();
              } else {
                router.back();
              }
            }}
          />
        </View>
        </View>
      </GestureHandlerRootView>
    )
}

export default RequestScreen;
import BackButton from "@/components/Buttons/BackButton";
import SecondaryButton from "@/components/Buttons/SecondaryButons";
import { acceptRequest, requestShippments } from "@/components/services/api/carriersApi";
import * as SecureStore from "@/components/services/storage/secureStore";
import { STORAGE_KEYS } from "@/components/services/storage/storageKeys";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { ChevronRight, Gift, MessageCircle, MoreVertical, PhoneCall, Star } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

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

    const fetchShipments = useCallback(async (pageNum: number = 1, append: boolean = false, silent: boolean = false) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else if (!silent) {
          setLoading(true);
        }
        const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }
        const data = await requestShippments(token, pageNum);
        const results = data.results || [];
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
    }, []);

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

    const handleAccept = async (request: any) => {
      try {
        setAcceptingId(request.id);
        const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token) return;
        
        await acceptRequest(token, request.id);
        
        setAcceptedRequest(request);
        requestSheetRef.current?.close();
        acceptedSheetRef.current?.expand();
      } catch (error) {
        console.log("Failed to accept shipment:", error);
      } finally {
        setAcceptingId(null);
      }
    };

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
      acceptedSheetRef.current?.close();
      setAcceptedRequest(null);
      requestSheetRef.current?.expand();
    }, []);

    
    
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
                </MapView>
            <BottomSheet
        snapPoints={snapPoints}
        ref={requestSheetRef}
        
      >
          <BottomSheetScrollView style={[tw`pb-15`]}>
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
                    <View style={[tw``]}>
                        {requests.map((request: any) => (
                                <View key={request.id} style={[tw`flex-row items-center gap-5 px-5 border-b-2 py-4 border-[#19488A33]`]}>
                                    <View style={[tw`items-center gap-3 w-[100px]`]}>
                                        <View style={[tw`h-14 w-14 rounded-full bg-[#19488A] flex items-center justify-center`]}>
                                            <Gift color="white" size={30}/>
                                        </View>
                                        <View style={[tw`items-center`]}>
                                        <Text style={[tw`text-[11px]`, {
                                                fontFamily: fontFamily.MontserratEasyRegular
                                            }]}>{request.recipient_name || "Shipper"}</Text>
                                            <View style={[tw`flex-row items-center gap-1`]}>
                                                <Star size={10} fill="black"/>
                                            <Text style={[tw`text-[10px]`, {
                                                    fontFamily: fontFamily.MontserratEasyRegular
                                                }]}>4.5</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[tw`gap-2 flex-1`]}>
                                        <View style={[tw`flex-row items-center gap-3`]}>
                                        <Text style={[tw`text-xl`, {
                                            fontFamily: fontFamily.MontserratEasyMedium
                                        }]}>₦{request.calculated_price}</Text>
                                        <View style={[tw`h-3 border-1 border`]} />
                                        <Text style={[tw`text-[#19488A33]`, {
                                            fontFamily: fontFamily.MontserratEasyMedium
                                        }]}>{request.vehicle_type_display}</Text>
                                    </View>
                                    <View style={[tw`gap-1`]}>
                                    <View style={[tw`flex-row items-center gap-2`]}>
                                        <Image style={[tw`h-4 w-4`]} source={require("../../assets/images/IntroImages/LocationMarker.png")} />
                                            <Text style={[tw`uppercase text-[10px] flex-1`, {
                                            fontFamily: fontFamily.MontserratEasyMedium
                                        }]}>{request.pickup_address}</Text>
                                        </View>
                                    <View style={[tw`flex-row items-center gap-2`]} >
                                        <Image style={[tw`h-4 w-4`]} source={require("../../assets/images/IntroImages/LocationMarker2.png")} />
                                        <Text style={[tw`uppercase text-[10px] flex-1`, {
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
                                </View>
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
        </BottomSheetScrollView>
      </BottomSheet>

        {/* Accepted request detail sheet */}
        <BottomSheet
          snapPoints={acceptedSheetSnapPoints}
          ref={acceptedSheetRef}
          enablePanDownToClose={true}
          index={-1}
          onClose={() => {
            setAcceptedRequest(null);
            requestSheetRef.current?.expand();
          }}
        >
          <BottomSheetView style={[tw`px-5 pb-10`]}>
            {acceptedRequest && (
              <View style={[tw`gap-5`]}>
               <View style={[tw`flex-row justify-between items-center`]}>
                                    <Text style={[tw`text-lg`, {
                                        fontFamily: fontFamily.MontserratEasyBold
                                    }]}>Arriving For Pick-Up</Text>
                                    <Text style={[tw`text-lg`, {
                                        fontFamily: fontFamily.MontserratEasyBold
                                    }]}>ETA: 4min</Text>
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
                      <Image style={[tw`h-5 w-5 `]} source={require("../../assets/images/IntroImages/icon/Details.png")} />
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
                                            <MoreVertical   />
                                        </TouchableOpacity>
                    </View>
                                </View>
                    <SecondaryButton
                      text="Waiting..."
                    textColor="#19488A"
                    bgColors="white"
                    icon={require("../../assets/images/IntroImages/icon/history-line.png")}
                    height={50}
                    borderColor="#19488A"
                    borderWidth={1}
                    />
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>

        {/* Back button — rendered last to be on top of everything */}
        <View style={[tw`absolute top-15 left-5`, { zIndex: 999 }]}>
          <BackButton
            onPress={() => {
              if (acceptedRequest) {
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
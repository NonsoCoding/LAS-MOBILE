import BackButton from "@/components/Buttons/BackButton";
import OrderCard from "@/components/Cards/OrderCard";
import { useCarrierNotifications } from "@/components/hooks/useCarrierNotifications";
import { cancelShipment, getShipmentDetails } from "@/components/services/api/carriersApi";
import * as SecureStore from "@/components/services/storage/secureStore";
import { STORAGE_KEYS } from "@/components/services/storage/storageKeys";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Package, XCircle } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CarrierShipmentsScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? "light"];
    
    const [shipments, setShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { lastNotification, connect: connectNotifications } = useCarrierNotifications();

    useEffect(() => {
        connectNotifications();
    }, [connectNotifications]);

    useEffect(() => {
        if (lastNotification?.id && lastNotification?.shipment_id) {
            // If we receive a cancellation notification, refresh the list
            Alert.alert("Notification", lastNotification.message || "A shipment was cancelled");
            fetchShipments();
        }
    }, [lastNotification]);

    const fetchShipments = useCallback(async (isRefreshing = false) => {
        try {
            if (isRefreshing) setRefreshing(true);
            else setLoading(true);

            const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            if (!token) return;

            const data = await getShipmentDetails(token);
            console.log("Carrier shipments data:", JSON.stringify(data, null, 2));

            // Data can be a single object or a results array
            const results = data?.results || (Array.isArray(data) ? data : (data.id ? [data] : []));
            setShipments(results);
        } catch (error) {
            console.error("Error fetching carrier shipments:", error);
            setShipments([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchShipments();
    }, [fetchShipments]);

    const handleCancelShipment = async (shipmentId: string | number) => {
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
                            if (!token) return;

                            await cancelShipment(token, shipmentId, "Carrier cancelled shipment");
                            Alert.alert("Success", "Shipment cancelled successfully");
                            fetchShipments();
                        } catch (error) {
                            console.error("Failed to cancel shipment:", error);
                            Alert.alert("Error", "Failed to cancel shipment. Please try again.");
                        }
                    }
                }
            ]
        );
    };

    const handleCancelAll = async () => {
        if (shipments.length === 0) return;

        Alert.alert(
            "Cancel All Shipments",
            "Are you sure you want to cancel ALL active shipments?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel All",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                            if (!token) return;

                            await Promise.all(
                                shipments.map(s => cancelShipment(token, s.id, "Carrier cancelled all shipments"))
                            );
                            Alert.alert("Success", "All shipments cancelled");
                            fetchShipments();
                        } catch (error) {
                            console.error("Failed to cancel all shipments:", error);
                            Alert.alert("Error", "Failed to cancel some shipments.");
                            fetchShipments();
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[tw`flex-1 bg-[#F9FBFF]`]}>
            <View style={[tw`flex-row items-center px-5 py-4 justify-between`]}>
                <View style={[tw`flex-row items-center gap-3`]}>
                    <BackButton onPress={() => router.back()} />
                    <Text style={[tw`text-xl`, { fontFamily: fontFamily.MontserratEasyBold, color: themeColors.text }]}>
                        Ongoing Shipments
                    </Text>
                </View>
                {shipments.length > 1 && (
                    <TouchableOpacity onPress={handleCancelAll} style={[tw`bg-red-50 px-3 py-1.5 rounded-lg flex-row items-center gap-2`]}>
                         <XCircle size={16} color="#ef4444" />
                        <Text style={[tw`text-red-500 text-xs`, { fontFamily: fontFamily.MontserratEasyBold }]}>Cancel All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={[tw`flex-1 items-center justify-center`]}>
                    <ActivityIndicator size="large" color={themeColors.primaryColor} />
                </View>
            ) : shipments.length === 0 ? (
                <View style={[tw`flex-1 items-center justify-center px-10 gap-4`]}>
                    <View style={[tw`bg-gray-100 p-6 rounded-full`]}>
                        <Package size={60} color="#cbd5e1" />
                    </View>
                    <Text style={[tw`text-center text-gray-500`, { fontFamily: fontFamily.MontserratEasyMedium }]}>
                        No active shipments found.
                    </Text>
                    <TouchableOpacity 
                        onPress={() => router.push("/(Rider-Drawer)/request")}
                        style={[tw`bg-[#19488A] px-8 py-3 rounded-full mt-2`]}
                    >
                        <Text style={[tw`text-white`, { fontFamily: fontFamily.MontserratEasyBold }]}>Find Shipments</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={shipments}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={[tw`px-5 pb-10`]}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => fetchShipments(true)} />
                    }
                    renderItem={({ item }) => (
                        <View>
                            <OrderCard
                                cardTitle="Order Details"
                                shippingId={`#${item.id}`}
                                pickupLocation={item.pickup_address || item.pickupAddress}
                                destinationLocation={item.delivery_address || item.destinationAddress}
                                pickupDate={item.created_at ? new Date(item.created_at).toLocaleDateString() : "Today"}
                                status={item.status || item.request_status}
                                isAssigned={true}
                                onPress={() => {}}
                            />
                            <TouchableOpacity 
                                onPress={() => handleCancelShipment(item.id)}
                                style={[tw`bg-red-50 py-3 items-center border-t border-red-100 flex-row justify-center gap-2`]}
                            >
                                <XCircle size={18} color="#ef4444" />
                                <Text style={[tw`text-red-500`, { fontFamily: fontFamily.MontserratEasyBold }]}>Cancel Shipment</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default CarrierShipmentsScreen;

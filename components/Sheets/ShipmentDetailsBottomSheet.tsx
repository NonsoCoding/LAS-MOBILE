import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { cancelShipmentShipper } from "@/components/services/api/carriersApi";
import useAuthStore from "@/components/store/authStore";
import useShipmentStore from "@/components/store/shipmentStore";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Box, Calendar, MapPin, Package, Phone, User, X } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const ShipmentDetailsBottomSheet = () => {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? "light"];
    const { accessToken } = useAuthStore();
    const { selectedShipment, setSelectedShipment, cancelShipment: cancelShipmentInStore } = useShipmentStore();
    const [isCancelling, setIsCancelling] = React.useState(false);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);

    const statuses = [
        { key: "pending", label: "PENDING" },
        { key: "picked", label: "PICKED" },
        { key: "in-transit", label: "IN-TRANSIT" },
        { key: "delivered", label: "DELIVERED" },
    ];

    const getStatusIndex = (currentStatus: string) => {
        return statuses.findIndex(s => s.key === currentStatus);
    };

    useEffect(() => {
        if (selectedShipment) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [selectedShipment]);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setSelectedShipment(null);
        }
    }, [setSelectedShipment]);

    const handleCancel = async () => {
        Alert.alert(
            "Cancel Shipment",
            "Are you sure you want to cancel this shipment? This action cannot be undone.",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: async () => {
                        if (!accessToken || !selectedShipment?.id) return;
                        try {
                            setIsCancelling(true);
                            await cancelShipmentShipper(accessToken, selectedShipment.id, "Shipper cancelled from details sheet");
                            
                            // Remove from local store
                            await cancelShipmentInStore(selectedShipment.id);
                            
                            Alert.alert("Success", "Shipment cancelled successfully.");
                            setSelectedShipment(null);
                        } catch (error: any) {
                            console.error("Error cancelling shipment:", error);
                            Alert.alert("Error", error.message || "Failed to cancel shipment.");
                        } finally {
                            setIsCancelling(false);
                        }
                    }
                }
            ]
        );
    };

    const currentStatusIndex = getStatusIndex(selectedShipment?.status || "pending");

    const detailRows = selectedShipment ? [
        { icon: <User size={18} color={themeColors.primaryColor} />, label: "Recipient", value: selectedShipment.recipient_name || "N/A" },
        { icon: <Phone size={18} color={themeColors.primaryColor} />, label: "Recipient Phone", value: selectedShipment.recipient_phone || "N/A" },
        { icon: <Calendar size={18} color={themeColors.primaryColor} />, label: "Date Created", value: selectedShipment.acceptedAt ? new Date(selectedShipment.acceptedAt).toLocaleString() : "N/A" },
        { icon: <Box size={18} color={themeColors.primaryColor} />, label: "Package Type", value: (selectedShipment.package_type || selectedShipment.delivery_type)?.replace("_", " ")?.replace("to ", "") || "N/A" },
        { icon: <Text style={{ color: themeColors.primaryColor, fontWeight: 'bold', fontSize: 16 }}>₦</Text>, label: "Total Price", value: `₦${Number(selectedShipment.finalPrice || selectedShipment.calculatedPrice || 0).toLocaleString()}` },
    ] : [];

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={selectedShipment ? 0 : -1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onChange={handleSheetChanges}
            backgroundStyle={{ backgroundColor: "#FFFFFF" }}
            handleIndicatorStyle={{ backgroundColor: themeColors.primaryColor }}
            enableOverDrag={false}
        >
            <BottomSheetScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={tw`px-5 pb-10`}
            >
                {selectedShipment ? (
                    <>
                        <View style={tw`flex-row items-center justify-between py-2 mb-4`}>
                            <Text style={[tw`text-xl`, { fontFamily: fontFamily.MontserratEasyBold, color: themeColors.primaryColor }]}>
                                Shipment Details
                            </Text>
                            <TouchableOpacity 
                                onPress={() => setSelectedShipment(null)} 
                                style={[tw`p-2 rounded-full`, { backgroundColor: themeColors.primaryColor }]}
                            >
                                <X size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Progress Bar - Mirroring Card Style */}
                        <View style={tw`bg-[#19488A11] rounded-2xl p-5 mb-6`}>
                            <View style={tw`flex-row justify-between items-center relative h-12 mb-2`}>
                                {statuses.map((statusItem, index) => {
                                    const isActive = index <= currentStatusIndex;
                                    return (
                                        <View key={statusItem.key} style={tw`flex-1 items-center relative`}>
                                            {index > 0 && (
                                                <View style={[tw`absolute h-0.5 left-0`, {
                                                    width: "50%", top: 4,
                                                    backgroundColor: isActive ? themeColors.primaryColor : "#E5E5EA",
                                                }]} />
                                            )}
                                            <View style={[tw`w-2.5 h-2.5 rounded-full z-10`, {
                                                backgroundColor: isActive ? themeColors.primaryColor : "#E5E5EA",
                                            }]} />
                                            {index < statuses.length - 1 && (
                                                <View style={[tw`absolute h-0.5 right-0`, {
                                                    width: "50%", top: 4,
                                                    backgroundColor: index < currentStatusIndex ? themeColors.primaryColor : "#E5E5EA",
                                                }]} />
                                            )}
                                            <Text style={[tw`text-[9px] mt-2 text-center`, {
                                                color: isActive ? themeColors.primaryColor : "#8E8E93",
                                                fontFamily: fontFamily.MontserratEasyMedium,
                                            }]} numberOfLines={1}>
                                                {statusItem.label}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={tw`gap-4`}>
                                <View style={tw`flex-row items-start gap-3`}>
                                    <MapPin size={18} color={themeColors.primaryColor} style={tw`mt-1`} />
                                    <View style={tw`flex-1`}>
                                        <Text style={[tw`text-[10px] uppercase text-gray-500`, { fontFamily: fontFamily.MontserratEasyRegular }]}>Pickup</Text>
                                        <Text style={[tw`text-sm`, { fontFamily: fontFamily.MontserratEasyMedium }]}>{selectedShipment.pickupAddress}</Text>
                                    </View>
                                </View>
                                <View style={tw`flex-row items-start gap-3`}>
                                    <MapPin size={18} color="#FF3B30" style={tw`mt-1`} />
                                    <View style={tw`flex-1`}>
                                        <Text style={[tw`text-[10px] uppercase text-gray-500`, { fontFamily: fontFamily.MontserratEasyRegular }]}>Destination</Text>
                                        <Text style={[tw`text-sm`, { fontFamily: fontFamily.MontserratEasyMedium }]}>{selectedShipment.destinationAddress}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Additional Details */}
                        <View style={tw`bg-[#19488A11] rounded-2xl p-5 border border-gray-100 shadow-sm mb-6`}>
                            <Text style={[tw`text-sm mb-4 uppercase text-gray-400`, { fontFamily: fontFamily.MontserratEasyBold }]}>More Information</Text>
                            {detailRows.map((row, index) => (
                                <View key={index} style={[tw`flex-row items-center mb-4 pb-4 border-b border-gray-50`, index === detailRows.length - 1 && tw`border-b-0 mb-0 pb-0`]}>
                                    <View style={tw`w-9 h-9 rounded-full items-center justify-center mr-4`}>
                                        {row.icon}
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={[tw`text-[10px] text-gray-400 uppercase`, { fontFamily: fontFamily.MontserratEasyRegular }]}>
                                            {row.label}
                                        </Text>
                                        <Text style={[tw`text-sm`, { fontFamily: fontFamily.MontserratEasyMedium, color: "black" }]}>
                                            {row.value}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Item Description */}
                        {selectedShipment.item_description && (
                            <View style={[tw`bg-[#19488A11] rounded-2xl p-5 border border-gray-100 mb-6`]}>
                                <View style={tw`flex-row items-center gap-2 mb-2`}>
                                    <Package size={18} color={themeColors.primaryColor} />
                                    <Text style={[tw`text-sm uppercase text-gray-400`, { fontFamily: fontFamily.MontserratEasyBold }]}>
                                        Item Description
                                    </Text>
                                </View>
                                <View style={tw`bg-gray-50 p-3 rounded-md`}>
                                    <Text style={[tw`text-sm`, { fontFamily: fontFamily.MontserratEasyRegular, color: "black" }]}>
                                        {selectedShipment.item_description}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Cancellation Action */}
                        {(selectedShipment.status === 'pending' || selectedShipment.status === 'searching') ? (
                            <View style={tw`mt-2`}>
                                <PrimaryButton 
                                    text={isCancelling ? "Cancelling..." : "Cancel Shipment"}
                                    onpress={handleCancel}
                                    bgColors="#FF3B30"
                                    height={55}
                                    textColor="white"
                                    disabled={isCancelling}
                                />
                            </View>
                        ) : (
                            <View style={tw`bg-orange-50 p-4 rounded-xl mt-2 flex-row items-center gap-3`}>
                                <Box size={20} color="#FF9500" />
                                <Text style={[tw`flex-1 text-xs text-orange-600`, { fontFamily: fontFamily.MontserratEasyMedium }]}>
                                    This shipment is currently {selectedShipment.status}. Active shipments cannot be cancelled from here.
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={tw`h-20 items-center justify-center`}>
                        <Text style={[tw`text-gray-400`, { fontFamily: fontFamily.MontserratEasyMedium }]}>Loading details...</Text>
                    </View>
                )}
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default ShipmentDetailsBottomSheet;

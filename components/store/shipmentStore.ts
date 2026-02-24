import * as AsyncStore from "@/components/services/storage/asyncStore";
import { STORAGE_KEYS } from "@/components/services/storage/storageKeys";
import { LatLng } from "react-native-maps";
import { create } from "zustand";

export interface AcceptedShipment {
    id: number;
    pickupAddress: string;
    destinationAddress: string;
    calculatedPrice: string | null;
    finalPrice: number;
    paymentMethod: string;
    status: "pending" | "picked" | "in-transit" | "delivered";
    trackingStatus: "waiting" | "trackable";
    acceptedAt: string; // ISO date string
    carrierName?: string;
    carrierImage?: string;
    pickupLatitude?: string;
    pickupLongitude?: string;
    deliveryLatitude?: string;
    deliveryLongitude?: string;
    isAssigned?: boolean;
}

interface ShipmentState {
    activeShipmentId: number | null;
    pickupAddress: string;
    destinationAddress: string;
    origin: LatLng | null;
    destination: LatLng | null;
    calculatedPrice: string | null;
    finalPrice: number;
    paymentMethod: string;
    isSearching: boolean;
    step: 1 | 2;
    senderPhone: string;
    recipientPhone: string;
    recipientName: string;
    itemDescription: string;
    deliveryType: "building" | "door";
    acceptedShipments: AcceptedShipment[];

    setShipmentData: (data: Partial<ShipmentState>) => void;
    addAcceptedShipment: (shipment: AcceptedShipment) => Promise<void>;
    updateShipmentTrackingStatus: (shipmentId: number, trackingStatus: "waiting" | "trackable", isAssigned?: boolean) => Promise<void>;
    clearShipment: () => Promise<void>;
    loadShipment: () => Promise<void>;
}

const initialState: {
    activeShipmentId: number | null;
    pickupAddress: string;
    destinationAddress: string;
    origin: LatLng | null;
    destination: LatLng | null;
    calculatedPrice: string | null;
    finalPrice: number;
    paymentMethod: string;
    isSearching: boolean;
    step: 1 | 2;
    senderPhone: string;
    recipientPhone: string;
    recipientName: string;
    itemDescription: string;
    deliveryType: "building" | "door";
    acceptedShipments: AcceptedShipment[];
} = {
    activeShipmentId: null,
    pickupAddress: "",
    destinationAddress: "",
    origin: null,
    destination: null,
    calculatedPrice: null,
    finalPrice: 2000,
    paymentMethod: "",
    isSearching: false,
    step: 1,
    senderPhone: "",
    recipientPhone: "",
    recipientName: "",
    itemDescription: "",
    deliveryType: "building",
    acceptedShipments: [],
};

const useShipmentStore = create<ShipmentState>((set, get) => ({
    ...initialState,

    setShipmentData: async (data) => {
        set(data);
        const currentState = get();
        const persistentData = {
            activeShipmentId: currentState.activeShipmentId,
            pickupAddress: currentState.pickupAddress,
            destinationAddress: currentState.destinationAddress,
            origin: currentState.origin,
            destination: currentState.destination,
            calculatedPrice: currentState.calculatedPrice,
            finalPrice: currentState.finalPrice,
            paymentMethod: currentState.paymentMethod,
            isSearching: currentState.isSearching,
            step: currentState.step,
            senderPhone: currentState.senderPhone,
            recipientPhone: currentState.recipientPhone,
            recipientName: currentState.recipientName,
            itemDescription: currentState.itemDescription,
            deliveryType: currentState.deliveryType,
            acceptedShipments: currentState.acceptedShipments,
        };
        await AsyncStore.setItem(STORAGE_KEYS.ACTIVE_SHIPMENT, JSON.stringify(persistentData));
    },

    addAcceptedShipment: async (shipment) => {
        const currentState = get();
        // Prevent duplicate IDs by using an upsert-style update
        const exists = currentState.acceptedShipments.some(s => s.id === shipment.id);
        let updatedShipments: AcceptedShipment[];
        
        if (exists) {
            // Update existing shipment details instead of appending
            updatedShipments = currentState.acceptedShipments.map(s => 
                s.id === shipment.id ? { ...s, ...shipment } : s
            );
        } else {
            // Append new shipment
            updatedShipments = [...currentState.acceptedShipments, shipment];
        }

        set({ acceptedShipments: updatedShipments });
        
        // Persist the updated list
        const persistentData = {
            ...currentState,
            acceptedShipments: updatedShipments,
        };
        // Remove functions before persisting
        const { setShipmentData, clearShipment, loadShipment, addAcceptedShipment: _a, updateShipmentTrackingStatus: _u, ...dataOnly } = persistentData as any;
        await AsyncStore.setItem(STORAGE_KEYS.ACTIVE_SHIPMENT, JSON.stringify(dataOnly));
    },

    updateShipmentTrackingStatus: async (shipmentId, trackingStatus, isAssigned) => {
        const currentState = get();
        const updatedShipments = currentState.acceptedShipments.map(s =>
            s.id === shipmentId ? { ...s, trackingStatus, isAssigned: isAssigned ?? s.isAssigned } : s
        );
        set({ acceptedShipments: updatedShipments });
        // Persist
        const { setShipmentData, clearShipment, loadShipment, addAcceptedShipment: _a, updateShipmentTrackingStatus: _u, ...dataOnly } = { ...currentState, acceptedShipments: updatedShipments } as any;
        await AsyncStore.setItem(STORAGE_KEYS.ACTIVE_SHIPMENT, JSON.stringify(dataOnly));
    },

    clearShipment: async () => {
        // Preserve acceptedShipments across new requests
        const { acceptedShipments } = get();
        set({ ...initialState, acceptedShipments });
        // Persist the accepted shipments so they survive reload
        const persistentData = { ...initialState, acceptedShipments };
        await AsyncStore.setItem(STORAGE_KEYS.ACTIVE_SHIPMENT, JSON.stringify(persistentData));
    },

    loadShipment: async () => {
        const storedData = await AsyncStore.getItem(STORAGE_KEYS.ACTIVE_SHIPMENT);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                // We previously cleared this due to schema changes, but now we allow persistence
                set(parsedData);
                // Persist the cleared data
                await AsyncStore.setItem(STORAGE_KEYS.ACTIVE_SHIPMENT, JSON.stringify(parsedData));
            } catch (error) {
                console.error("Error parsing stored shipment data:", error);
            }
        }
    },
}));

export default useShipmentStore;

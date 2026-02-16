import * as AsyncStore from "@/components/services/storage/asyncStore";
import { STORAGE_KEYS } from "@/components/services/storage/storageKeys";
import { LatLng } from "react-native-maps";
import { create } from "zustand";

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

    setShipmentData: (data: Partial<ShipmentState>) => void;
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
        };
        await AsyncStore.setItem(STORAGE_KEYS.ACTIVE_SHIPMENT, JSON.stringify(persistentData));
    },

    clearShipment: async () => {
        await AsyncStore.removeItem(STORAGE_KEYS.ACTIVE_SHIPMENT);
        set(initialState);
    },

    loadShipment: async () => {
        const storedData = await AsyncStore.getItem(STORAGE_KEYS.ACTIVE_SHIPMENT);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                set(parsedData);
            } catch (error) {
                console.error("Error parsing stored shipment data:", error);
            }
        }
    },
}));

export default useShipmentStore;

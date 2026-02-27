import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { livetracking } from "../services/api/carriersApi";
import * as SecureStore from "../services/storage/secureStore";
import { STORAGE_KEYS } from "../services/storage/storageKeys";

const WS_HOST = "web-production-60428.up.railway.app";

export const useLocationTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const activeShipmentId = useRef<string | number | null>(null);

  const startTracking = async (shipmentId: string | number, status: string = "status") => {
    console.log("Starting tracking for shipment ID:", shipmentId, "with status:", status);
    try {
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      activeShipmentId.current = shipmentId;
      setIsTracking(true);

      // Stop any existing tracking
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, // Update every 3 seconds
          distanceInterval: 2, // Or every 2 meters
        },
        async (location) => {
          console.log("[Rider] watchPositionAsync triggered:", location.coords.latitude, location.coords.longitude);
          if (activeShipmentId.current) {
            const { latitude, longitude } = location.coords;
            await sendViaRest(latitude, longitude);
          }
        }
      );
    } catch (error) {
      console.error("Error starting location tracking:", error);
    }
  };

  const sendViaRest = async (latitude: number, longitude: number) => {
    try {
      const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && activeShipmentId.current) {
        await livetracking(token, activeShipmentId.current, latitude, longitude);
        console.log(`[REST] Location sent for shipment ${activeShipmentId.current}:`, latitude, longitude);
      }
    } catch (error) {
      console.error("[REST] Failed to send location update:", error);
    }
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    activeShipmentId.current = null;
    setIsTracking(false);
    console.log("Location tracking stopped");
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  return { startTracking, stopTracking, isTracking };
};

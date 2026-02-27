import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { livetracking } from "../services/api/carriersApi";
import * as SecureStore from "../services/storage/secureStore";
import { STORAGE_KEYS } from "../services/storage/storageKeys";

const WS_HOST = "web-production-60428.up.railway.app";
const toRad = (n: number) => (n * Math.PI) / 180;
const toDeg = (n: number) => (n * 180) / Math.PI;

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

export const useLocationTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const activeShipmentId = useRef<string | number | null>(null);
  const lastLocation = useRef<{ latitude: number; longitude: number; heading?: number } | null>(null);

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
          if (activeShipmentId.current) {
            const { latitude, longitude } = location.coords;
            let heading = location.coords.heading;

            // Fallback: calculate bearing if heading is missing or device is moving
            if ((heading === null || heading === undefined || heading < 0) && lastLocation.current) {
              heading = calculateBearing(
                lastLocation.current.latitude,
                lastLocation.current.longitude,
                latitude,
                longitude
              );
            }

            console.log("[Rider] watchPositionAsync triggered:", latitude, longitude, "Heading:", heading);
            
            lastLocation.current = { latitude, longitude, heading: heading ?? undefined };
            await sendViaRest(latitude, longitude, heading ?? undefined);
          }
        }
      );
    } catch (error) {
      console.error("Error starting location tracking:", error);
    }
  };

  const sendViaRest = async (latitude: number, longitude: number, heading?: number) => {
    try {
      const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && activeShipmentId.current) {
        await livetracking(token, activeShipmentId.current, latitude, longitude, heading);
        console.log(`[REST] Location sent for shipment ${activeShipmentId.current}:`, latitude, longitude, heading);
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

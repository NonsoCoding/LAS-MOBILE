import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { livetracking } from "../services/api/carriersApi";
import * as SecureStore from "../services/storage/secureStore";
import { STORAGE_KEYS } from "../services/storage/storageKeys";

const WS_HOST = "web-production-4a8a5.up.railway.app";

export const useLocationTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const activeShipmentId = useRef<string | number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const useWebSocket = useRef(false);

  const connectWebSocket = async (shipmentId: string | number, status: string = "status") => {
    try {
      const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) return;

      const wsUrl = `wss://${WS_HOST}/ws/shipments/${shipmentId}/status/?token=${token}`;
      console.log("Connecting location WebSocket:", wsUrl);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("Location WebSocket connected for shipment:", shipmentId);
        useWebSocket.current = true;
        wsRef.current = ws;
      };

      ws.onmessage = (event) => {
        console.log("WebSocket received:", event.data);
      };

      ws.onerror = (error) => {
        console.error("Location WebSocket error, falling back to REST:", error);
        useWebSocket.current = false;
      };

      ws.onclose = (event) => {
        console.log("Location WebSocket closed:", event.code, event.reason);
        useWebSocket.current = false;
        wsRef.current = null;
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      useWebSocket.current = false;
    }
  };

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

      // Try connecting WebSocket for location sending
      await connectWebSocket(shipmentId, status);

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // Increased accuracy
          timeInterval: 3000, // Update every 3 seconds
          distanceInterval: 2, // Or every 2 meters
        },
        async (location) => {
          console.log("[Rider] watchPositionAsync triggered:", location.coords.latitude, location.coords.longitude);
          if (activeShipmentId.current) {
            const { latitude, longitude, heading } = location.coords;

            // Try WebSocket first, fall back to REST
            if (useWebSocket.current && wsRef.current?.readyState === WebSocket.OPEN) {
              try {
                wsRef.current.send(JSON.stringify({ 
                  type: "location_update",
                  latitude, 
                  longitude,
                  heading: heading ?? 0
                }));
                console.log(`[WEBSOCKET] Tracking update sent for shipment ${activeShipmentId.current}: Lat ${latitude}, Lon ${longitude}, Heading ${heading}`);
              } catch (error) {
                console.error("[WS] Send failed, falling back to REST:", error);
                useWebSocket.current = false;
                // Fall through to REST
                await sendViaRest(latitude, longitude);
              }
            } else {
              await sendViaRest(latitude, longitude);
            }
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
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      useWebSocket.current = false;
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
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { startTracking, stopTracking, isTracking };
};

import { useCallback, useEffect, useRef, useState } from "react";
import * as SecureStore from "../services/storage/secureStore";
import { STORAGE_KEYS } from "../services/storage/storageKeys";

const WS_HOST = "web-production-4a8a5.up.railway.app";

export interface CarrierLocation {
  latitude: number;
  longitude: number;
  heading?: number;
}

/**
 * Shipper-side hook to listen for real-time location & status updates
 * from the carrier via WebSocket.
 *
 * Connects to: wss://<host>/ws/shipments/{id}/status/?token=<JWT>
 * Receives: { type: "location_update", latitude, longitude }
 *           { type: "status_update", status: "..." }
 */
export const useShipmentTracking = () => {
  const [carrierLocation, setCarrierLocation] = useState<CarrierLocation | null>(null);
  const [shipmentStatus, setShipmentStatus] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const activeShipmentId = useRef<string | number | null>(null);
  const shouldReconnect = useRef(false);

  const cleanup = useCallback(() => {
    shouldReconnect.current = false;
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(async (shipmentId: string | number, status: string = "status") => {
    // Clean up any existing connection
    cleanup();

    activeShipmentId.current = shipmentId;
    shouldReconnect.current = true;
    reconnectAttempts.current = 0;

    const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      console.error("[ShipmentTracking] No access token found");
      return;
    }

    const openConnection = () => {
      if (!shouldReconnect.current) return;

      const wsUrl = `wss://${WS_HOST}/ws/shipments/${shipmentId}/status/?token=${token}`;
      console.log("[ShipmentTracking] Connecting:", wsUrl);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("[ShipmentTracking] Connected for shipment:", shipmentId);
        setIsConnected(true);
        reconnectAttempts.current = 0;
        wsRef.current = ws;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("[ShipmentTracking] Message received:", data);

          // Handle location_update messages from the carrier
          const lat = data.latitude ?? data.lat;
          const lng = data.longitude ?? data.lng;
          const head = data.heading ?? data.head ?? data.rotation;
          const type = data.type ?? data.event;

          if ((type === "location_update" || !type) && lat != null && lng != null) {
            console.log("[ShipmentTracking] Updating carrier location:", { lat, lng, head });
            setCarrierLocation({
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
              heading: head != null ? parseFloat(head) : undefined
            });
          }

          // Handle status_update messages
          if (data.type === "status_update" && data.status) {
            setShipmentStatus(data.status);
          }
          // Some backends send status at the top level
          else if (data.status && data.type !== "location_update") {
            setShipmentStatus(data.status);
          }
        } catch (error) {
          console.error("[ShipmentTracking] Error parsing message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("[ShipmentTracking] WebSocket error:", error);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log("[ShipmentTracking] WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;

        // Reconnect with exponential backoff if we should still be connected
        if (shouldReconnect.current && reconnectAttempts.current < 10) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`[ShipmentTracking] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1})`);
          reconnectAttempts.current += 1;
          reconnectTimeout.current = setTimeout(openConnection, delay);
        }
      };
    };

    openConnection();
  }, [cleanup]);

  const disconnect = useCallback(() => {
    console.log("[ShipmentTracking] Disconnecting");
    cleanup();
    activeShipmentId.current = null;
    setCarrierLocation(null);
    setShipmentStatus(null);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    carrierLocation,
    shipmentStatus,
    isConnected,
    connect,
    disconnect,
  };
};

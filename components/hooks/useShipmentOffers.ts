import { useCallback, useEffect, useRef, useState } from "react";
import { requestOfferPrice } from "../services/api/carriersApi";
import * as SecureStore from "../services/storage/secureStore";
import { STORAGE_KEYS } from "../services/storage/storageKeys";

const WS_HOST = "web-production-60428.up.railway.app";

/**
 * Shipper-side hook to listen for real-time carrier acceptances/offers
 * from the carrier via WebSocket.
 *
 * Connects to: wss://<host>/ws/shipments/{id}/acceptances/?token=<JWT>
 */
export const useShipmentOffers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(false);
  }, []);

  const connect = useCallback(async (shipmentId: string | number) => {
    console.log("[ShipmentOffers] connect called with shipmentId:", shipmentId);
    // Clean up any existing connection
    cleanup();

    activeShipmentId.current = shipmentId;
    shouldReconnect.current = true;
    reconnectAttempts.current = 0;
    setLoading(true);

    const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      console.error("[ShipmentOffers] No access token found");
      setLoading(false);
      return;
    }

    // Initial fetch to get existing offers (matching the old REST pattern)
    try {
      console.log(`[ShipmentOffers] Initial fetch for shipmentId: ${shipmentId}`);
      const initialData = await requestOfferPrice(token, Number(shipmentId));
      console.log("[ShipmentOffers] Initial fetch response:", JSON.stringify(initialData, null, 2));
      
      let initialOffers = [];
      if (Array.isArray(initialData)) {
        initialOffers = initialData;
      } else if (initialData && initialData.results) {
        initialOffers = initialData.results;
      } else if (initialData && initialData.data) {
        initialOffers = initialData.data;
      }
      setOffers(initialOffers);
    } catch (error) {
      console.log("[ShipmentOffers] Initial fetch failed:", error);
    }

    const openConnection = () => {
      if (!shouldReconnect.current) return;

      const wsUrl = `wss://${WS_HOST}/ws/shipments/${shipmentId}/acceptances/?token=${token}`;
      console.log("[ShipmentOffers] Connecting WebSocket:", wsUrl);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("[ShipmentOffers] WebSocket CONNECTED for shipment:", shipmentId);
        setIsConnected(true);
        setLoading(false);
        reconnectAttempts.current = 0;
        wsRef.current = ws;
      };

     ws.onmessage = (event) => {
  try {
    console.log("[ShipmentOffers] WebSocket MESSAGE:", event.data);
    const data = JSON.parse(event.data);
    console.log("[ShipmentOffers] Parsed message:", data);

    // Handle array / paginated list
    let offersList: any[] = [];
    if (Array.isArray(data)) {
      offersList = data;
    } else if (data?.results && Array.isArray(data.results)) {
      offersList = data.results;
    } else if (data?.data && Array.isArray(data.data)) {
      offersList = data.data;
    } else if (data && (data.carrier_id || data.id)) {
      // ✅ Single acceptance pushed by server — merge/add it
      setOffers(prev => {
        const exists = prev.some(
          o => o.id === data.id || o.carrier_id === data.carrier_id
        );
        if (exists) {
          return prev.map(o =>
            o.id === data.id || o.carrier_id === data.carrier_id ? data : o
          );
        }
        return [...prev, data];
      });
      return;
    }

    if (offersList.length > 0) {
      setOffers(offersList);
    }
  } catch (error) {
    console.error("[ShipmentOffers] Error parsing message:", error);
  }
};

      ws.onerror = (error) => {
        console.error("[ShipmentOffers] WebSocket error:", error);
        setIsConnected(false);
        setLoading(false);
      };

      ws.onclose = (event) => {
        console.log("[ShipmentOffers] WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;

        // Reconnect with exponential backoff if we should still be connected
        if (shouldReconnect.current && reconnectAttempts.current < 10) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`[ShipmentOffers] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1})`);
          reconnectAttempts.current += 1;
          reconnectTimeout.current = setTimeout(openConnection, delay);
        }
      };
    };

    openConnection();
  }, [cleanup]);

  const disconnect = useCallback(() => {
    console.log("[ShipmentOffers] Disconnecting");
    cleanup();
    activeShipmentId.current = null;
    setOffers([]);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    offers,
    isConnected,
    loading,
    connect,
    disconnect,
  };
};

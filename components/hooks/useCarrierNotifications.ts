import { useCallback, useEffect, useRef, useState } from "react";
import * as SecureStore from "../services/storage/secureStore";
import { STORAGE_KEYS } from "../services/storage/storageKeys";

const WS_HOST = "web-production-60428.up.railway.app";

/**
 * Carrier-side hook to listen for general notifications (like cancellations)
 * wss://<host>/ws/shipments/carrier/notifications/?token=<JWT>
 */
export const useCarrierNotifications = () => {
  const [lastNotification, setLastNotification] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
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

  const connect = useCallback(async () => {
    cleanup();
    shouldReconnect.current = true;
    reconnectAttempts.current = 0;

    const token = await SecureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return;

    const openConnection = () => {
      if (!shouldReconnect.current) return;

      const wsUrl = `wss://${WS_HOST}/ws/shipments/carrier/notifications/?token=${token}`;
      console.log("[CarrierNotifications] Connecting:", wsUrl);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("[CarrierNotifications] Connected");
        setIsConnected(true);
        reconnectAttempts.current = 0;
        wsRef.current = ws;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("[CarrierNotifications] Message received:", data);
          setLastNotification(data);

          // The user mentioned: payload: id, shipment_id, message
          // if (data.type === "shipment_cancelled") { ... }
        } catch (error) {
          console.error("[CarrierNotifications] Error parsing message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("[CarrierNotifications] WebSocket error:", error);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log("[CarrierNotifications] WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;

        if (shouldReconnect.current && reconnectAttempts.current < 10) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current += 1;
          reconnectTimeout.current = setTimeout(openConnection, delay);
        }
      };
    };

    openConnection();
  }, [cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    lastNotification,
    isConnected,
    connect,
    disconnect,
  };
};

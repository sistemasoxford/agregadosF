import { useEffect, useState } from "react";
import socket from "../app/services/tollgate/socket";

export function useVehicleData() {
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const [inactiveSeconds, setInactiveSeconds] = useState<number>(0);
  const [lastSeen, setLastSeen] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  // 🔌 WebSocket KeepAlive y datos en tiempo real
  useEffect(() => {
    socket.on("keep-alive", () => {
      setLastSeen(Date.now());
      setInactiveSeconds(0);
      setStatus("active");
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => {
      setIsConnected(false);
      setLastSeen(Date.now());
      setStatus("inactive");
    });
    socket.on("connect_error", () => {
      setIsConnected(false);
      setLastSeen(Date.now());
      setStatus("inactive");
    });

    return () => {
      socket.off("keep-alive");
      socket.off("data:update");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  // ⏱ Contador de inactividad
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSeen === 0) return;
      const diff = Math.floor((Date.now() - lastSeen) / 1000);
      setInactiveSeconds(diff);

      if (status === "active" && diff > 10) {
        setStatus("inactive");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSeen, status]);

  return { status, inactiveSeconds, isConnected };
}

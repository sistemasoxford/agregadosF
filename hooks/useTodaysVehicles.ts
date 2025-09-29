import { useEffect, useState } from "react";
import socket from "../app/services/tollgate/socket";
import { fetchVehiclesToday } from "../app/services/tollgate/tollgateService";
import { useAuth } from "./useAuth";

export type VehicleItem = {
  id: string;
  plate: string;
  vehicleType: string;
  color: string;
  timestamp: string;
};

export type VehiclesResponse = {
  data: VehicleItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const useTodaysVehicles = (page = 1, pageSize = 10) => {
  const { userId, loading: authLoading } = useAuth();
  const [data, setData] = useState<VehicleItem[]>([]);
  const [pagination, setPagination] = useState<Omit<VehiclesResponse, "data"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (authLoading || !userId) return;

      setLoading(true);
      try {
        const response = await fetchVehiclesToday(page, pageSize);
        setData((prev) => (page === 1 ? response.data : [...prev, ...response.data]));
        const { data, ...rest } = response;
        setPagination(rest);
      } catch (err: any) {
        console.error("Error cargando vehículos del día:", err);
        setError(err.message || "Error al cargar vehículos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, authLoading, page, pageSize]);

  useEffect(() => {
    if (!userId) return;

    const handleTollgateEvent = (event: VehicleItem) => {
      setData((prev) => {
        const exists = prev.find((v) => v.plate === event.plate && v.timestamp === event.timestamp);
        return exists ? prev.map((v) => (v.plate === event.plate ? event : v)) : [event, ...prev];
      });

      setPagination((prev) => (prev ? { ...prev, total: (prev.total || 0) + 1 } : prev));
    };

    socket.on("tollgate-event", handleTollgateEvent);
    return () => {
      socket.off("tollgate-event", handleTollgateEvent);
    };
  }, [userId]);

  return { data, pagination, loading, error };
};

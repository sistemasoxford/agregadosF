import { useEffect, useState } from "react";
import { fetchVehiclesByPlate } from "../app/services/tollgate/tollgateService";
import { useAuth } from "./useAuth";
import { VehicleItem, VehiclesResponse } from "./useTodaysVehicles";

export const useVehiclesByPlate = (plate: string, page = 1, pageSize = 10) => {
  const { userId, loading: authLoading } = useAuth();
  const [data, setData] = useState<VehicleItem[]>([]);
  const [pagination, setPagination] = useState<Omit<VehiclesResponse, "data"> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !userId) return;
    if (!plate) {
      setData([]);
      setPagination(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchVehiclesByPlate(plate, page, pageSize);
        setData((prev) => (page === 1 ? response.data : [...prev, ...response.data]));
        const { data: _, ...rest } = response;
        setPagination(rest);
      } catch (err: any) {
        setError(err.message || "Error en búsqueda");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [plate, page, pageSize, userId, authLoading]);

  return { data, pagination, loading, error };
};

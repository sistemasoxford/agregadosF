// app/services/tollgate/tollgateApi.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import tollgateApi from "./api"; // instancia propia de Tollgate

import { VehicleItem, VehiclesResponse } from "../../../hooks/useTodaysVehicles";

// Obtener todos los vehículos/eventos
export const fetchVehicles = async (page = 1, pageSize = 10): Promise<VehicleItem[]> => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const response = await tollgateApi.post(
    "/tollgate/events",
    { page, pageSize },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};

// Obtener eventos del día
export const fetchVehiclesToday = async (page = 1, pageSize = 10): Promise<VehiclesResponse> => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const response = await tollgateApi.post(
    "/tollgate/events/today",
    { page, pageSize },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data as VehiclesResponse; // tipa correctamente
};

// Obtener eventos filtrando por placa
export const fetchVehiclesByPlate = async (
  plate: string,
  page = 1,
  pageSize = 10
): Promise<VehicleItem[]> => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const response = await tollgateApi.post(
    "/tollgate/events/by-plate-today",
    { plate, page, pageSize },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};

// Obtener eventos filtrados por placa, rango de fechas, etc.
export const fetchVehiclesByFilters = async (
  filters: { plate?: string; from?: string; to?: string },
  page = 1,
  pageSize = 10
): Promise<VehicleItem[]> => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const response = await tollgateApi.post(
    "/tollgate/events/filters",
    { ...filters, page, pageSize },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};

export const updateVehiclePlate = async (
  eventId: string,
  newPlate: string
): Promise<void> => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  await tollgateApi.put(
    `/tollgate/events/${eventId}/plate`,
    { plate: newPlate },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};
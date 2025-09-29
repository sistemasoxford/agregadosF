import { useVehicleData } from "@/hooks/useCameraData";
import { useTodaysVehicles, VehicleItem } from "@/hooks/useTodaysVehicles";
import { useVehiclesByPlate } from "@/hooks/useVehiclesByPlate";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { updateVehiclePlate } from "../../app/services/tollgate/tollgateService";
import VehicleList from "../../components/ui/VehicleList";
import { useAuth } from "../../hooks/useAuth";


export default function HomeTab() {
  const { userId, loading: authLoading } = useAuth();
  const router = useRouter();

  const [plateSearch, setPlateSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // 🔑 este dispara la búsqueda
  const [page, setPage] = useState(1);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]); // 🔹 estado local para la tabla

  // 👇 Hooks
  const {
    data: todaysVehicles,
    loading: vehiclesLoading,
    error,
    pagination,
  } = useTodaysVehicles(page, 10);

  const {
    data: searchedVehicles,
    loading: searching,
    error: searchError,
    pagination: searchPagination,
  } = useVehiclesByPlate(searchQuery, page, 10);

  // 👇 Sincronizar el estado local con los hooks según la búsqueda
  useEffect(() => {
    setVehicles(searchQuery ? searchedVehicles : todaysVehicles);
  }, [todaysVehicles, searchedVehicles, searchQuery]);

  const loading = searchQuery ? searching : vehiclesLoading;
  const paginationData = searchQuery ? searchPagination : pagination;

  // 👇 Manejar edición de placa
  const handleEditPlate = async (oldPlate: string, newPlate: string, eventId: string) => {
    try {
      await updateVehiclePlate(eventId, newPlate);

      // 🔄 Actualizar la tabla localmente
      setVehicles((prev) =>
        prev.map((v) => (v.id === eventId ? { ...v, plate: newPlate } : v))
      );
    } catch (error) {
      console.error("❌ Error actualizando placa:", error);
    }
  };

  const handleLoadMore = () => {
    if (paginationData && page < paginationData.totalPages && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const { status, inactiveSeconds, isConnected } = useVehicleData();

  const blinkAnim = useRef(new Animated.Value(0)).current;
  const blinkAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!authLoading && !userId) {
      router.replace("/login");
    }
  }, [authLoading, userId, router]);

  useEffect(() => {
    if (!isConnected) {
      blinkAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      );
      blinkAnimationRef.current.start();
    } else {
      if (blinkAnimationRef.current) {
        blinkAnimationRef.current.stop();
        blinkAnim.setValue(0);
      }
    }
  }, [isConnected, blinkAnim]);

  if (authLoading || loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!userId) return null;

  if (error || searchError) {
    return (
      <View style={styles.center}>
        <Text>Error: {error || searchError}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={[styles.keepAliveText, { color: status === "active" ? "green" : "red" }]}>
          {status === "active" ? "✅ Cámara activa" : "❌ Cámara inactiva"}
        </Text>

        {!isConnected && (
          <Animated.Text style={[styles.offlineText, { opacity: blinkAnim }]}>
            ⚠️ No hay conexión con el servidor
          </Animated.Text>
        )}

        <Text style={styles.counterText}>
          ⏱ {status === "active" ? "Última señal hace" : "Inactivo desde hace"} {inactiveSeconds} segundos
        </Text>

        {/* 🔍 Input con debounce */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por placa..."
          value={plateSearch}
          onChangeText={setPlateSearch} // 🔹 solo actualiza el texto
          onSubmitEditing={() => {
            setSearchQuery(plateSearch); // 🔹 dispara búsqueda
            setPage(1); // reinicia página
          }}
          returnKeyType="search"
        />

        <VehicleList
          data={vehicles}
          loading={loading}
          hasMore={paginationData ? page < paginationData.totalPages : false}
          onLoadMore={handleLoadMore}
          onEditPlate={handleEditPlate} // 👈 asignamos callback
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  keepAliveText: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  counterText: { fontSize: 16, marginBottom: 10, color: "#666" },
  offlineText: { fontSize: 16, fontWeight: "bold", color: "red", marginBottom: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VehicleItem } from "../../hooks/useTodaysVehicles";
import VehicleItemRow from "./VehicleItemRow";

type Props = {
  data: VehicleItem[];
  onPress?: (plate: string) => void;
  onEditPlate?: (oldPlate: string, newPlate: string, eventId: string) => void; // 👈 aquí
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
};

export default function VehicleList({ data, onEditPlate, onLoadMore, hasMore, loading }: Props) {

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Placa</Text>
      <Text style={styles.headerCell}>Tipo</Text>
      <Text style={styles.headerCell}>Color</Text>
      <Text style={styles.headerCell}>Fecha / Hora</Text>
    </View>
  );

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={{ padding: 10, alignItems: "center" }}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    if (hasMore && onLoadMore) {
      return (
        <View style={{ padding: 10, alignItems: "center" }}>
          <TouchableOpacity style={styles.loadMoreBtn} onPress={onLoadMore}>
            <Text style={styles.loadMoreText}>⬇️ Cargar más</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item.plate}-${item.timestamp}-${index}`}
      renderItem={({ item }) => (
        <VehicleItemRow 
          item={item} 
          onEditPlate={onEditPlate} // recibe 3 args: oldPlate, newPlate, eventId
        />
      )}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: "#000",
    backgroundColor: "#f0f0f0",
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
  },
  loadMoreBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

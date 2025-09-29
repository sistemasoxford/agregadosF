import React, { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { VehicleItem } from "../../hooks/useTodaysVehicles";

type Props = {
  item: VehicleItem;
  onPress?: (plate: string) => void;
  onEditPlate?: (oldPlate: string, newPlate: string, eventId: string) => void; // 👈 agregamos eventId
};

export default function VehicleItemRow({ item, onPress, onEditPlate }: Props) {
  const date = new Date(item.timestamp);

  const formattedDate = date.toLocaleDateString("es-ES");
  const formattedTime = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // 🔧 Estado de edición
  const [editing, setEditing] = useState(false);
  const [plateValue, setPlateValue] = useState(item.plate);
  const lastTapRef = useRef<number | null>(null);

  // 🔧 Detectar doble tap
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      setEditing(true);
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.cell}>
        {editing ? (
          <TextInput
            value={plateValue}
            onChangeText={setPlateValue}
            autoFocus
            onBlur={() => {
              setEditing(false);
              if (plateValue !== item.plate && onEditPlate) {
                onEditPlate(item.plate, plateValue, item.id); // 👈 pasamos el id del evento
              }
            }}
            style={styles.editInput}
          />
        ) : (
          <TouchableOpacity onPress={handleDoubleTap}>
            <Text style={styles.text}>{item.plate}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.cell}>{item.vehicleType}</Text>
      <Text style={styles.cell}>{item.color}</Text>
      <Text style={styles.cell}>
        {formattedDate} {formattedTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
  },
  text: {
    fontSize: 14,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 6,
    padding: 4,
    fontSize: 14,
  },
});

import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { DataTable } from "react-native-paper";
import socket from "../services/tollgate/socket";

type Item = {
  id: number;
  name: string;
  status: string;
};

export default function ExploresScreen() {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    // Escuchar datos iniciales
    socket.on("data:init", (items: Item[]) => {
      setData(items);
    });

    // Escuchar eventos en tiempo real
    socket.on("data:update", (item: Item) => {
      setData((prev) => {
        const exists = prev.find((i) => i.id === item.id);
        if (exists) {
          return prev.map((i) => (i.id === item.id ? item : i));
        } else {
          return [...prev, item];
        }
      });
    });

    return () => {
      socket.off("data:init");
      socket.off("data:update");
    };
  }, []);

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title>Nombre</DataTable.Title>
          <DataTable.Title>Estado</DataTable.Title>
        </DataTable.Header>

        {data.map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.id}</DataTable.Cell>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell>{item.status}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
});

import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function RootLayout() {
  const { userId, loading } = useAuth();

  // Mientras cargamos token → spinner
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!userId && <Stack.Screen name="(auth)" />}
      {userId && <Stack.Screen name="(tabs)" />}
    </Stack>
  );
}

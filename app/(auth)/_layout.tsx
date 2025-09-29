import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      {/* Si agregas register u otras pantallas de auth */}
      {/* <Stack.Screen name="register" options={{ title: "Registro" }} /> */}
    </Stack>
  );
}

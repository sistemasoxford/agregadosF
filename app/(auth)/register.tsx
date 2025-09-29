import { useRouter } from "expo-router";
import React from "react";
import { Alert, View } from "react-native";
import LoginForm from "../../components/ui/LoginForm";
import { register } from "../services/auth/authService";

export default function RegisterScreen() {
  const router = useRouter();

  const handleRegister = async (email: string, password: string) => {
    try {
      await register(email, password);
      Alert.alert("Éxito", "Usuario registrado");
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Error", error.error || "Error en registro");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <LoginForm onSubmit={handleRegister} />
    </View>
  );
}
